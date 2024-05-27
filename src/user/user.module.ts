import { Module } from '@nestjs/common';
import { JwtService } from 'src/utils/jwt/jwt.service';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [JwtService, UserService, CreateResponseService, ...userProviders],
})
export class UserModule {}
