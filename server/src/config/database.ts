import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let shuttingDown = false;

export const connectDatabase = async (): Promise<void> => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
        w: 'majority',
      });

      console.log('MongoDB connected');
      return;
    } catch (error) {
      console.error(
        `MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES})`,
        error
      );

      if (attempt === MAX_RETRIES) {
        if (env.NODE_ENV === 'production') {
          process.exit(1);
        }
        throw error;
      }

      await delay(RETRY_DELAY_MS);
    }
  }
};

/* Connection events */

if (mongoose.connection.listenerCount('error') === 0) {
  mongoose.connection.on('error', (error) => {
    console.error('MongoDB runtime error:', error);
  });
}

if (mongoose.connection.listenerCount('disconnected') === 0) {
  mongoose.connection.on('disconnected', () => {
    if (!shuttingDown) {
      console.warn('MongoDB disconnected');
    }
  });
}

/* Graceful shutdown */

const shutdown = async (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`Process received ${signal}. Closing MongoDB connection.`);

  try {
    await mongoose.connection.close();
  } finally {
    process.exit(0);
  }
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

/* Utils */

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
