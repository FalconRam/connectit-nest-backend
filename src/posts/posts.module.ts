import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { DatabaseModule } from 'src/database/database.module';
import { postsProviders } from './posts.providers';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    PostsService,
    ProfileService,
    CreateResponseService,
    CloudinaryService,
    ...postsProviders,
  ],
})
export class PostsModule {}
