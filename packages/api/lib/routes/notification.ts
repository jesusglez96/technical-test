import { FastifyInstance } from 'fastify';
import { addClient } from 'services';

export default async function (app: FastifyInstance) {
  app.get('/', { websocket: true }, (connection: any, req) => {
    // console.log('\nhola\n');
    // addClient(connection.socket);
    // Example: Send a welcome message when a client connects
    connection.socket.send('Welcome to the notification system!');

    // Handle incoming messages
    connection.socket.on('message', (message: any) => {
      console.log('Received:', message.toString());
      connection.socket.send(`Echo: ${message}`);
    });

    // Handle disconnection
    connection.socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
}
