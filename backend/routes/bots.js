import { supabase } from '../services/db.js';

export default async function botsRoutes(fastify, options) {
  // CREATE a Bot
  fastify.post('/api/v1/bots', async (request, reply) => {
    try {
      const { name, prompt, model_id, userId, primary_color, logo_url, position, theme } = request.body;
      
      if (!userId || !name) return reply.code(400).send({ error: 'User ID and Bot Name are required' });

      const { data, error } = await supabase
        .from('bots')
        .insert([{ 
          user_id: userId, 
          name, 
          system_prompt: prompt, 
          model_name: model_id,
          primary_color: primary_color || '#3b82f6',
          logo_url: logo_url || null,
          position: position || 'bottom-right',
          theme: theme || 'light'
        }])
        .select()
        .single();

      if (error) throw error;
      return reply.code(201).send({ message: 'Bot created successfully', bot: data });
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to create bot', details: err.message });
    }
  });

  // GET Public Bot Config (For Widget)
  fastify.get('/api/v1/bots/:botId/public', async (request, reply) => {
    try {
      const { botId } = request.params;
      const { data, error } = await supabase
        .from('bots')
        .select('name, primary_color, logo_url, position, theme, model_name')
        .eq('id', botId)
        .single();

      if (error || !data) return reply.code(404).send({ error: 'Bot not found' });
      return reply.send(data);
    } catch (err) {
      return reply.code(500).send({ error: 'Failed to fetch public config' });
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

  // UPDATE a Bot Prompt/Model/Visuals
  fastify.put('/api/v1/bots/:botId', async (request, reply) => {
    try {
      const { botId } = request.params;
      const { prompt, model_id, name, primary_color, logo_url, position, theme } = request.body;
      
      const { data, error } = await supabase
        .from('bots')
        .update({ 
          system_prompt: prompt, 
          model_name: model_id, 
          name,
          primary_color,
          logo_url,
          position,
          theme
        })
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
