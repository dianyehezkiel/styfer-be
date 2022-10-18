import mongoose, { Error as MongooseError } from 'mongoose';
import { MONGODB_URI } from '../config';

export default async function connectToMongoDB() {
  const uri = MONGODB_URI;
  try {
    if (!uri) throw new Error('no uri defined in environment');

    console.log('try connecting to', uri);

    await mongoose.connect(uri);
    console.log('connection established');
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      console.log('error connecting to mongodb:', error.message);
    } else {
      console.log('unknown error when connecting:', error);
    }
  }
}
