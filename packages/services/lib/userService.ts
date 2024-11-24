import { Prisma, PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashPassword, verifyPassword } from './authService';

const prisma = new PrismaClient();

const createUserValidator = Prisma.validator<Prisma.UserCreateInput>();
const updateUserValidator = Prisma.validator<Prisma.UserUpdateInput>();

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const hashedPassword = await hashPassword(password);
  const data: Prisma.UserCreateInput = createUserValidator({
    name,
    email,
    password: hashedPassword,
    role,
  });
  return prisma.user.create({
    data,
  });
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
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
