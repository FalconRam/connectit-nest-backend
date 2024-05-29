import { Module } from '@nestjs/common';
import { userProviders } from './user.providers';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [UserService, CreateResponseService, ...userProviders],
})
export class UserModule {}
