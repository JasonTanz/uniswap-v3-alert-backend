import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

export const connectDB = async (): Promise<void> => {
  try {
    const con = await mongoose.connect(MONGODB_URI);
    logger.info(`MongoDB connected successfully, ${con.connection.host}`);
  } catch (error) {
    logger.error('Error connecting to MongoDB: ', error);
    process.exit(1);
  }
};

export default connectDB;
