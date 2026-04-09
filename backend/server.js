import Fastify from 'fastify';
import cors from '@fastify/cors';
import chatRoutes from './routes/chat.js';
import botsRoutes from './routes/bots.js';
import webhooksRoutes from './routes/webhooks.js';

const fastify = Fastify({ logger: true });

// Register Plugins
await fastify.register(cors, {
  origin: '*', // For MVP widget, allow all domains
});

// Register Routes
fastify.register(chatRoutes);
fastify.register(botsRoutes);
fastify.register(webhooksRoutes);

fastify.get('/health', async () => ({ status: 'ok', server: 'fastify', ai: 'gemma' }));

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log('🤖 AI SaaS Backend running on http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
