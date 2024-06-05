import mongoose, { Mongoose } from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<Mongoose> => {
      const connectionUrl = process.env.CONNECTION_URL;

      if (!connectionUrl) {
        throw new Error('DB Connection establish error: URI is not defined');
      }

      try {
        const connection = await mongoose.connect(connectionUrl);

        console.log('Connected to database');

        return connection;
      } catch (error) {
        throw new Error(`Failed to connect to database: ${error}`);
      }
    },
  },
];
