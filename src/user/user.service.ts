import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserLoginDTO } from './dto/UserLogin.dto';
// import { JwtService } from 'src/utils/jwt/jwt.service';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService,
    private createResponse: CreateResponseService,
  ) {}

  async loginUserService(userLoginDTO: UserLoginDTO) {
    const userdetails = await this.userModel.findOne({
      email: userLoginDTO.email,
    });

    if (!userdetails)
      return this.createResponse.notFoundErrorResponse({}, 'User not found');

    const isPasswordCorrect = await bcrypt.compare(
      userLoginDTO.password,
      userdetails.password,
    );

    if (!isPasswordCorrect)
      return this.createResponse.serverErrorResponse(
        {},
        'Either Email or Password is incorrect',
      );

    const accessToken = await this.jwtService.signAsync({
      id: userdetails._id,
      email: userdetails.email,
    });

    return this.createResponse.successResponse(
      {
        id: userdetails._id.toString(),
        name: userdetails.name,
        email: userdetails.email,
        accessToken,
      },
      'Login Success',
    );
  }
  async registerUserService() {}
}
