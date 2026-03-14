// MongoDB connection configuration

export const databaseConfig = {
  uri: process.env.MONGODB_URI!,
  options: {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};

export function validateDatabaseConfig(): void {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }
}
