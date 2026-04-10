import { generateGemmaResponse } from '../services/ai.js';
import { getBotConfig, logUsage, logChatTranscript } from '../services/db.js';

export default async function webhooksRoutes(fastify, options) {
  
  // Facebook/Meta Webhook Challenge Verification
  fastify.get('/api/webhooks/messenger', async (request, reply) => {
    const query = request.query;
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    // Use environment variable for security
    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'rabeh_ai_default_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WEBHOOK_VERIFIED by Meta');
      return reply.code(200).send(Number(challenge));
    } else {
      return reply.code(403).send('Forbidden');
    }
  });

  // Incoming Messages from Channels
  fastify.post('/api/webhooks/messenger/:userId/:botId', async (request, reply) => {
    try {
      const { userId, botId } = request.params;
      const body = request.body;

      if (body.object !== 'page') return reply.code(404).send('Not Found');

      for (const entry of body.entry) {
        const webhook_event = entry.messaging[0];
        const sender_psid = webhook_event.sender.id;
        
        if (webhook_event.message && webhook_event.message.text) {
           const message = webhook_event.message.text;
           
           // Fetch Bot Configuration
           const botConfig = await getBotConfig(botId, userId);
           if (!botConfig) return;

           const systemPrompt = botConfig.system_prompt || "You are a helpful customer support bot.";
           const model = botConfig.model_name || "gemma:2b"; 

           // Infer Response
           const aiResponseText = await generateGemmaResponse(model, systemPrompt, message);
           
           // Log Usage + Transcript
           const tokensEstimated = Math.ceil((message.length + aiResponseText.length) / 4);
           await logUsage(userId, botId, tokensEstimated);
           await logChatTranscript(userId, botId, 'messenger', message, aiResponseText);

           // Send back to Facebook Graph API
           await sendFacebookMessage(sender_psid, aiResponseText, botConfig.meta_page_access_token);
        }
      }

      return reply.code(200).send('EVENT_RECEIVED');
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Webhook processing failed' });
    }
  });
}

// REAL Outbound Network Request to Facebook Graph API
async function sendFacebookMessage(sender_psid, text, pageAccessToken) {
    if (!pageAccessToken) {
      console.warn('⚠️ No Page Access Token found for this bot. Message not sent to Meta.');
      return;
    }

    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: sender_psid },
          message: { text: text }
        })
      });
      const data = await response.json();
      if (!response.ok) console.error('Meta API Push Error:', data.error);
    } catch (e) {
      console.error('Meta API Connectivity Error:', e.message);
    }
}
