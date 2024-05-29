import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { userProviders } from 'src/user/user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    CreateResponseService,
    ...userProviders,
  ],
})
export class AuthModule {}
