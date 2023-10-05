import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User';

//
export const registerUser = async (req: Request, res: Response) => {
  const user = await User.create({
    email: 'themohitsaud@gmail.com',
    role: 'super-admin',
  });

  res.status(StatusCodes.CREATED).json({ user });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = ['Ram', 'Shyam', 'Sita', 'Hari'];

  res.status(StatusCodes.OK).json({ users });
};
