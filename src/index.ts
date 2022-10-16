// early import dotenv and assign env variables
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

// imports
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import postRouter from './routes/post';
import connectToMongoDB from './utils/connectToMongoDb';
import accountRouter from './routes/account';


connectToMongoDB()
  .then(() => {
    console.info("SUCCESS!");
  })
  .catch(() => {
    console.error("FAILED!");
  });
// if (!uri) throw new MongooseError('no uri defined in environment');
// console.log('try connecting to', uri);
// mongoose.connect(uri)
//   .then(() => {
//     console.log('connection established');
//   })
//   .catch((error) => {
//     if (error instanceof MongooseError) {
//       console.log('error connecting to mongodb:', error.message);
//     } else {
//       console.log('unknown error when connecting:', error);
//     }
//   });

// init express and all middleware
const app = express();
app.use(cors());
app.use(express.json());

// define route
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/account', accountRouter);

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
