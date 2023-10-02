import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  const users = ['Ram', 'Shyam', 'Sita', 'Hari'];

  res.status(200).json({ users });
};
