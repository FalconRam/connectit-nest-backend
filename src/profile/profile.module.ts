import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { profileProviders } from './profile.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...profileProviders],
})
export class ProfileModule {}
