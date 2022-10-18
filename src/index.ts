// early import dotenv and assign env variables
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

// imports
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import postRouter from './routes/post';
import connectToMongoDB from './lib/connectToMongoDb';
import accountRouter from './routes/account';
import { requestLogger } from './lib/middlewares';


connectToMongoDB()
  .then(() => {
    console.info("SUCCESS!");
  })
  .catch(() => {
    console.error("FAILED!");
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// define route
app.use('/account', accountRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
