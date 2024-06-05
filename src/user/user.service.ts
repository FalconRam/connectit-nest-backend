import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserLoginDTO } from './dto/UserLogin.dto';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private jwtService: JwtService,
    private createResponse: CreateResponseService,
  ) {}

  async loginUserService(userLoginDTO: UserLoginDTO) {
    const { email, password } = userLoginDTO;
    try {
      if (!email || !password)
        throw new BadRequestException(
          this.createResponse.customErrorResponse(
            400,
            {},
            'All Fields are required',
          ),
        );
      const userdetails = await this.userModel.findOne({ email });

      if (!userdetails)
        throw new NotFoundException(
          this.createResponse.customErrorResponse(404, {}, 'User not found'),
        );

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userdetails.password,
      );

      if (!isPasswordCorrect)
        throw new BadRequestException(
          this.createResponse.customErrorResponse(
            400,
            {},
            'Either Email or Password is incorrect',
          ),
        );

      const payload = { id: userdetails._id, email: userdetails.email };

      const accessToken = await this.jwtService.signAsync(payload);

      // Overridding signAsync with new key & expiry time for refresh token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.AUTH_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
      });
      return this.createResponse.successAuthResponse(
        {
          id: userdetails._id,
          name: userdetails.name,
          email: userdetails.email,
        },
        { accessToken, refreshToken },
        'Login Success',
      );
    } catch (error) {
      this.createResponse.handleError(error);
    }
  }

  async createUserService(createUserDTO: CreateUserDTO) {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      city,
      country,
    } = createUserDTO;
    try {
      if (
        !email ||
        !password ||
        !confirmPassword ||
        !firstName ||
        !lastName ||
        !city ||
        !country
      )
        throw new BadRequestException(
          this.createResponse.customErrorResponse(
            400,
            {},
            'All Fields are required',
          ),
        );
      const existingUser = await this.userModel.findOne({ email });

      if (existingUser)
        throw new ConflictException(
          this.createResponse.customErrorResponse(
            409,
            {},
            'User already exists.',
          ),
        );
      if (password !== confirmPassword)
        throw new BadRequestException(
          this.createResponse.customErrorResponse(
            400,
            {},
            "Password doesn't match.",
          ),
        );

      let hashedPassword = await bcrypt.hash(password, 12);

      let newUser = new this.userModel({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        city,
        country,
      });
      await newUser.save();

      const payload = { id: newUser._id, email };

      const accessToken = await this.jwtService.signAsync(payload);

      // Overridding signAsync with new key & expiry time for refresh token
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.AUTH_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
      });

      return this.createResponse.successAuthResponse(
        { id: newUser._id, name: newUser.name, email: newUser.email },
        { accessToken, refreshToken },
        'Your profile Created',
      );
    } catch (error) {
      this.createResponse.handleError(error);
    }
  }
}
