import { Request } from 'express';
import { User } from 'src/user/user.interface';

export interface CustomRequest extends Request {
  userId: string;
  email: string;
}

export interface UserServiceResponse {
  userDetails: User | {};
  isExists: boolean;
}
