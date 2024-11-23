import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import routes from './routes';
import envPlugin from './plugins/env';

const buildApp = async () => {
  const app = Fastify({ logger: true });

  // Register plugins
  app.register(envPlugin);
  app.register(cors);
  app.register(sensible);

  // Register routes
  app.register(routes);

  try {
    await app.listen({ port: 3000 });
    console.log('Server is running at http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
};

buildApp();
