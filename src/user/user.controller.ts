import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginDTO } from './dto/UserLogin.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login-user')
  async loginController(@Body() userLoginDTO: UserLoginDTO) {
    return this.userService.loginUserService(userLoginDTO);
  }
}
