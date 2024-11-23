import { FastifyInstance } from 'fastify';
import userRoutes from './user';

export default async function (app: FastifyInstance) {
  app.get('/', async () => {
    return { message: 'Welcome to the Fastify App' };
  });

  app.register(userRoutes, { prefix: '/users' });
}
