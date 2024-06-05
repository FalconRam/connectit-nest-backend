import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDTO } from './dto/UserLogin.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { PublicAPI } from 'src/auth/decorators/public.decorator';
import { CreateUserDTO } from './dto/CreateUser.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private createResponse: CreateResponseService,
  ) {}

  // Added /login-user route to support for existing FE
  @HttpCode(HttpStatus.OK)
  @PublicAPI()
  @Post('login-user')
  async loginController(@Body() userLoginDTO: UserLoginDTO) {
    return this.userService.loginUserService(userLoginDTO);
  }

  @PublicAPI()
  @Post('/create-user')
  async createUserController(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createUserService(createUserDTO);
  }

  // Added for Test: TODO: Remove this method
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request | any) {
    return this.createResponse.successResponse({ email: req.email }, '');
  }
}
