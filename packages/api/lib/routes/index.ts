import { FastifyInstance } from 'fastify';
import userRoutes from './user';
import protectedRoutes from './protected';
import uploadRoutes from './upload';
import notificationRoutes from './notification';

export default async function (app: FastifyInstance) {
  app.get('/', async () => {
    return { message: 'Welcome to the Fastify App' };
  });

  app.register(userRoutes, { prefix: '/users' });
  app.register(protectedRoutes, { prefix: '/protected' });
  app.register(uploadRoutes, { prefix: '/upload' });
  app.register(notificationRoutes, { prefix: '/notification' });
}
