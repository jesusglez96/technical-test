type User = {
  id: string;
  name: string;
};

const users: User[] = [
  { id: '1', name: 'Jesus' },
  { id: '2', name: 'Carmela' },
];

export const getUserById = async (id: string): Promise<User | null> => {
  return users.find((user) => user.id === id) || null;
};
