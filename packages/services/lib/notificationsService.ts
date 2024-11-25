const clients: Set<WebSocket> = new Set();

export const addClient = (client: WebSocket) => {
  clients.add(client);
};

export const removeClient = (client: WebSocket) => {
  clients.delete(client);
};

export const broadcast = (message: string) => {
  for (const client of clients) {
    client.send(message);
  }
};
