import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
