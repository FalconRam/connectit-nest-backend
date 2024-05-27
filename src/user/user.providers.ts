import { Mongoose } from 'mongoose';
import { userSchema, passwordLinkSchema } from './schemas/user.schema';

export const userProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (mongoose: Mongoose) => mongoose.model('User', userSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PASSWORDLINK_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('PasswordLink', passwordLinkSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
