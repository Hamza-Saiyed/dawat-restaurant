import mongoose from 'mongoose';
import { logger } from './logger';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof globalThis & { mongoose?: CachedConnection };

const cached: CachedConnection = globalWithMongoose.mongoose || { conn: null, promise: null };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    logger.info('Connecting to MongoDB...');

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        logger.info('✅ MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        logger.error('❌ MongoDB connection failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
