import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const connectionUrl = process.env.CONNECTION_URL;
      if (!connectionUrl) {
        throw new Error('DB Connection establish error: URI is not defined');
      }

      await mongoose.connect(connectionUrl);
      return mongoose;
    },
  },
];
