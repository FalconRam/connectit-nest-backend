import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserServiceResponse } from 'src/common/types';
import { User } from 'src/user/user.interface';

@Injectable()
export class ProfileService {
  constructor(@Inject('USER_MODEL') private userModel: Model<User>) {}

  async getUserCommonService(userId: string): Promise<UserServiceResponse> {
    try {
      const userDetails = await this.userModel
        .findById(userId)
        .select('-password');
      if (!userDetails) return { userDetails: {}, isExists: false };
      return { userDetails, isExists: true };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
