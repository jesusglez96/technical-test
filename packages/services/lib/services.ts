import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createUserValidator = Prisma.validator<Prisma.UserCreateInput>();
const updateUserValidator = Prisma.validator<Prisma.UserUpdateInput>();

export const createUser = async (name: string, email: string) => {
  const data: Prisma.UserCreateInput = createUserValidator({
    name,
    email,
  });
  return prisma.user.create({
    data: { name, email },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
};

export const updateUser = async (
  id: number,
  data: Partial<{ name: string; email: string }>
) => {
  const validatedData: Prisma.UserUpdateInput = updateUserValidator(data);
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({ include: { posts: true } });
};
