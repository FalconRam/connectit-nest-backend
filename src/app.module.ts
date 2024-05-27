import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { JwtService } from './utils/jwt/jwt.service';
import { UserService } from './user/user.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CreateResponseService } from './utils/createResponse/createResponse.service';
import { userProviders } from './user/user.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    UserService,
    ...userProviders,
    JwtService,
    CreateResponseService,
  ],
})
export class AppModule {}
