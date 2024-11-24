import { FastifyInstance } from 'fastify';
import userRoutes from './user';
import protectedRoutes from './protected';

export default async function (app: FastifyInstance) {
  app.get('/', async () => {
    return { message: 'Welcome to the Fastify App' };
  });

  app.register(userRoutes, { prefix: '/users' });
  app.register(protectedRoutes, { prefix: '/protected' });
}
