import { FastifyInstance } from 'fastify';
import { getUserById } from '../services/userService';

export default async function (app: FastifyInstance) {
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await getUserById(id);
    if (!user) {
      reply.notFound('User not found');
    }
    return user;
  });
}
