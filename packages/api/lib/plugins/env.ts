import fp from 'fastify-plugin';

export default fp(async (app) => {
  app.register(require('@fastify/env'), {
    schema: {
      type: 'object',
      properties: {
        PORT: { type: 'string', default: '3000' },
      },
    },
  });
});
