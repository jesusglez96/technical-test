import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
