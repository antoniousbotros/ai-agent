import { generateGemmaResponse } from '../services/ai.js';

// Dummy Validation (We will connect Supabase later)
const MOCK_API_KEY = "test_key_123";

export default async function chatRoutes(fastify, options) {
  fastify.post('/api/v1/chat', async (request, reply) => {
    try {
      const { apiKey, botId, message } = request.body;

      if (!apiKey || apiKey !== MOCK_API_KEY) {
        return reply.code(401).send({ error: 'Invalid or missing API Key. Use "test_key_123" for MVP.' });
      }

      if (!message) {
        return reply.code(400).send({ error: 'Message payload is required.' });
      }

      // MVP Mock Bot Setup
      const systemPrompt = "You are a helpful customer support bot for a SaaS platform. Keep responses very brief and professional.";
      const model = "gemma:2b"; // Assuming they have local Ollama

      console.log(`Sending to Ollama (Model: ${model}): "${message}"`);
      const aiResponseText = await generateGemmaResponse(model, systemPrompt, message);

      return reply.send({ response: aiResponseText });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'AI processing failed' });
    }
  });
}
