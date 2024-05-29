import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserLoginDTO } from 'src/user/dto/UserLogin.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PublicAPI } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @PublicAPI()
  @HttpCode(HttpStatus.OK)
  @Post('login-user')
  async loginController(@Body() userLoginDTO: UserLoginDTO) {
    return this.userService.loginUserService(userLoginDTO);
  }
}
