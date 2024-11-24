import { FastifyInstance } from 'fastify';
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    authorize: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<FastifyReply>;
  }
}
export default async function (app: FastifyInstance) {
  // Protected route for any authenticated user
  app.get('/', { preHandler: app.authenticate }, async (request, reply) => {
    reply.send({ message: `Welcome, user ${request.user}!` });
  });

  // Protected route for admin users only
  app.get(
    '/admin',
    // @ts-ignore
    { preHandler: [app.authenticate, app.authorize(['ADMIN'])] },
    async (request, reply) => {
      reply.send({ message: `Welcome, admin user ${request.user}!` });
    }
  );
}
