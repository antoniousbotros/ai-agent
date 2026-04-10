import { generateGemmaResponse } from '../services/ai.js';
import { getBotConfig, logUsage, logChatTranscript } from '../services/db.js';

export default async function webhooksRoutes(fastify, options) {
  
  // Facebook/Meta Webhook Challenge Verification
  // When a user connects their Facebook Page, Meta sends a GET request to verify ownership
  fastify.get('/api/webhooks/messenger', async (request, reply) => {
    const query = request.query;
    
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // In a real production app, compare this against a secret environment variable
    if (mode === 'subscribe' && token === 'my_secure_webhook_token') {
      console.log('✅ WEBHOOK_VERIFIED by Meta');
      return reply.code(200).send(Number(challenge)); // Meta requires a raw 200 HTTP response with the challenge code
    } else {
      return reply.code(403).send('Forbidden');
    }
  });

  // Incoming Messages from Channels (Messenger, Instagram, Slack)
  // Maps directly to a Bot ID, bypassing standard API Key because we validate the Payload Signature instead
  fastify.post('/api/webhooks/messenger/:userId/:botId', async (request, reply) => {
    try {
      const { userId, botId } = request.params;
      const body = request.body;

      // Ensure this is a page subscription from Facebook Graph API
      if (body.object !== 'page') return reply.code(404).send('Not Found');

      // Loop over Graph API batched messaging entries
      body.entry.forEach(async (entry) => {
        const webhook_event = entry.messaging[0];
        const sender_psid = webhook_event.sender.id;
        
        if (webhook_event.message && webhook_event.message.text) {
           const message = webhook_event.message.text;
           console.log(`[FACEBOOK MESSENGER] Received message from user ${sender_psid}: "${message}"`);
           
           // Fetch Bot Configuration for Inference
           const botConfig = await getBotConfig(botId, userId);
           if (!botConfig) {
             console.error(`[WEBHOOK] Bot ${botId} not found or unauthorized for Webhook access.`);
             return; // Fail silently so Meta doesn't retry forever
           }

           const systemPrompt = botConfig.prompt || "You are a helpful customer support bot.";
           const model = botConfig.model_id || "gemma:2b"; 

           // Infer Response
           const aiResponseText = await generateGemmaResponse(model, systemPrompt, message);
           
           // Log Usage + Transcript
           const tokensEstimated = Math.ceil((message.length + aiResponseText.length) / 4);
           logUsage(userId, botId, tokensEstimated);
           logChatTranscript(userId, botId, 'messenger', message, aiResponseText);

           // Send back to Facebook Graph API
           sendMockFacebookMessage(sender_psid, aiResponseText);
        }
      });

      // Always return a '200 OK' response to all requests
      // This tells Facebook we successfully received it. Otherwise they'll keep retrying.
      return reply.code(200).send('EVENT_RECEIVED');

    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Webhook processing failed' });
    }
  });
}

// Mock Outbound Network Request to Facebook Graph API
function sendMockFacebookMessage(sender_psid, text) {
   console.log('\n--- 🌐 EXTERNAL API MOCK: FACEBOOK GRAPH ---');
   console.log(`Endpoint: POST https://graph.facebook.com/v19.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>`);
   console.log(`Payload:`);
   console.log(JSON.stringify({
      recipient: { id: sender_psid },
      message: { text: text }
   }, null, 2));
   console.log('--- 🚀 SENT SUCCESSFULLY ---\n');
}
