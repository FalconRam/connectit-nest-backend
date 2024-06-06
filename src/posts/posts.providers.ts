import { Mongoose } from 'mongoose';
import {
  postMessageSchema,
  savedUserPostsSchema,
} from './schemas/posts.schema';
import { userProviders } from 'src/user/user.providers';

export const postsProviders = [
  {
    provide: 'POSTS_MESSAGE_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('PostMessage', postMessageSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SAVED_USER_POSTS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('SavedUserPosts', savedUserPostsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  userProviders[0], // User Model
];
