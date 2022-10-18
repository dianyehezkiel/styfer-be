import mongoose, { Error as MongooseError } from 'mongoose';
import { MONGODB_URI } from '../config';
import { logger } from './utils';

export default async function connectToMongoDB() {
  const uri = MONGODB_URI;
  try {
    if (!uri) throw new Error('no uri defined in environment');

    logger.info('try connecting to', uri);

    await mongoose.connect(uri);
    logger.info('connection established');
  } catch (error: unknown) {
    if (error instanceof MongooseError) {
      logger.info('error connecting to mongodb:', error.message);
    } else {
      logger.info('unknown error when connecting:', error);
    }
  }
}
