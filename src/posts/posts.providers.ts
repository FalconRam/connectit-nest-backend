import { Mongoose } from 'mongoose';
import { postsTestSchema, savedUserPostsSchema } from './schemas/posts.schema';

export const postsProviders = [
  {
    provide: 'POSTS_TEST_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('PostsTest', postsTestSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SAVED_USER_POSTS_MODEL',
    useFactory: (mongoose: Mongoose) =>
      mongoose.model('SavedUserPosts', savedUserPostsSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];