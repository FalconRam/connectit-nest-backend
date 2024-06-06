import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CreateResponseService } from './utils/createResponse/createResponse.service';
import { userProviders } from './user/user.providers';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import { CloudinaryService } from './utils/cloudinary/cloudinary.service';
import { postsProviders } from './posts/posts.providers';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    PostsModule,
    ProfileModule,
  ],
  controllers: [AppController, UserController, PostsController, ProfileController],
  providers: [
    AppService,
    UserService,
    PostsService,
    ...userProviders,
    ...postsProviders,
    CreateResponseService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    CloudinaryService,
    ProfileService,
  ],
})
export class AppModule {}
