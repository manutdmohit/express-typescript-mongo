import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import userRouter from './routes/userRoutes';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) =>
  res.send('Welcome to Node Typescript tutorial')
);

app.use('/api/v1/users', userRouter);

app.listen(PORT, () =>
  console.log(`The server is listening on the port ${PORT}`)
);
