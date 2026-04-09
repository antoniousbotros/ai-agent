import { supabase } from '../services/db.js';

export default async function botsRoutes(fastify, options) {
  // CREATE a Bot
  fastify.post('/api/v1/bots', async (request, reply) => {
    try {
      const { name, prompt, model_id, userId } = request.body;
      
      if (!userId || !name) return reply.code(400).send({ error: 'User ID and Bot Name are required' });

      const { data, error } = await supabase
        .from('bots')
        .insert([{ user_id: userId, name, system_prompt: prompt, model_name: model_id }])
        .select()
        .single();

      if (error) throw error;
      return reply.code(201).send({ message: 'Bot created successfully', bot: data });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create bot', details: err.message });
    }
  });

  // GET user's Bots
  fastify.get('/api/v1/bots/:userId', async (request, reply) => {
    try {
      const { userId } = request.params;
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return reply.send({ bots: data });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch bots' });
    }
  });

  // UPDATE a Bot Prompt/Model
  fastify.put('/api/v1/bots/:botId', async (request, reply) => {
    try {
      const { botId } = request.params;
      const { prompt, model_id, name } = request.body;
      
      const { data, error } = await supabase
        .from('bots')
        .update({ system_prompt: prompt, model_name: model_id, name })
        .eq('id', botId)
        .select()
        .single();

      if (error) throw error;
      return reply.send({ message: 'Bot updated successfully', bot: data });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update bot' });
    }
  });
}
