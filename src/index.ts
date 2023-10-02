import dotenv from 'dotenv';
import express from 'express';

import userRouter from './routes/userRoutes';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

app.use('/api/v1/users', userRouter);

app.listen(PORT, () =>
  console.log(`The server is listening on the port ${PORT}`)
);
