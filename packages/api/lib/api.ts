import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import fastifyWebsocket from '@fastify/websocket';
import fastifyCookie from '@fastify/cookie';
import routes from './routes';
import envPlugin from './plugins/env';

const buildApp = async () => {
  const app = Fastify({ logger: true });

  // Register plugins
  app.register(envPlugin);
  app.register(cors);
  app.register(sensible);

  app.register(fastifyJwt, {
    secret: 'supersecret', // Replace with a strong secret
    sign: { expiresIn: '1h' },
  });
  app.register(fastifyCookie);

  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify(); // Verifies the token
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Middleware to authorize based on user role
  // @ts-ignore
  app.decorate('authorize', (roles: string[]) => {
    return async (
      request: { user: any },
      reply: {
        code: (arg0: number) => {
          (): any;
          new (): any;
          send: { (arg0: { error: string }): void; new (): any };
        };
      }
    ) => {
      const user = request.user;
      if (!roles.includes(user.role)) {
        reply.code(403).send({ error: 'Forbidden' });
      }
    };
  });

  app.register(fastifyMultipart);
  app.register(fastifyWebsocket);
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
