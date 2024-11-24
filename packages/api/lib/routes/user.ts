import { FastifyInstance } from 'fastify';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from 'services';

export default async function (app: FastifyInstance) {
  // Create User
  app.post('/', async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };
    try {
      const user = await createUser(name, email);
      reply.code(201).send(user);
    } catch (error) {
      reply.code(400).send({ error: 'Failed to create user' });
    }
  });

  // Get All Users
  app.get('/', async (_, reply) => {
    const users = await getAllUsers();
    reply.send(users);
  });

  // Get User by ID
  app.get('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    const user = await getUserById(id);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }
    reply.send(user);
  });

  // Update User
  app.put('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    const data = request.body as Partial<{ name: string; email: string }>;
    try {
      const user = await updateUser(id, data);
      reply.send(user);
    } catch (error) {
      reply.code(400).send({ error: 'Failed to update user' });
    }
  });

  // Delete User
  app.delete('/:id', async (request, reply) => {
    // @ts-ignore
    const id = parseInt(request.params.id, 10);
    try {
      await deleteUser(id);
      reply.code(204).send();
    } catch (error) {
      reply.code(400).send({ error: 'Failed to delete user' });
    }
  });
}
