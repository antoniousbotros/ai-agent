import { generateGemmaResponse } from '../services/ai.js';
import { validateApiKey, getBotConfig, logUsage, logChatTranscript } from '../services/db.js';

export default async function chatRoutes(fastify, options) {
  fastify.post('/api/v1/chat', async (request, reply) => {
    try {
      const { apiKey, botId, message } = request.body;

      if (!apiKey) return reply.code(400).send({ error: 'API Key is required.' });
      if (!botId) return reply.code(400).send({ error: 'Bot ID is required.' });
      if (!message) return reply.code(400).send({ error: 'Message payload is required.' });

      // Connect to Supabase to fetch User
      const userId = await validateApiKey(apiKey);
      if (!userId) {
        return reply.code(401).send({ error: 'Invalid or revoked API Key.' });
      }

      // Fetch Bot Configuration
      const botConfig = await getBotConfig(botId, userId);
      if (!botConfig) {
        return reply.code(404).send({ error: 'Bot not found or unauthorized.' });
      }

      const systemPrompt = botConfig.system_prompt || "You are a helpful customer support bot.";
      const model = botConfig.model_name || "gemma:2b"; 

      const aiResponseText = await generateGemmaResponse(model, systemPrompt, message);

      // Log Usage + Full Transcript Asynchronously
      const tokensEstimated = Math.ceil((message.length + aiResponseText.length) / 4);
      logUsage(userId, botId, tokensEstimated);
      logChatTranscript(userId, botId, 'web', message, aiResponseText);

      return reply.send({ response: aiResponseText });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'AI processing failed' });
    }
  });
}
