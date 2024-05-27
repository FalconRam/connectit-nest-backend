import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

@Injectable()
export class JwtService {
  // Creates a New JWT Token
  async signJWTToken({ email, id }: { email: string; id: string }) {
    if (!process.env.AUTH_ACCESS_TOKEN_SECRET_KEY)
      throw new HttpException(
        'JWT Key not available',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    const accessToken = await jwt.sign(
      { email, id },
      process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY },
    );
    return accessToken;
  }

  // Verify JWT Token
  async validateJWTToken(acessToken: string) {
    if (!process.env.AUTH_ACCESS_TOKEN_SECRET_KEY)
      throw new HttpException(
        'JWT Key not available',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    try {
      await jwt.verify(acessToken, process.env.AUTH_ACCESS_TOKEN_SECRET_KEY);
    } catch (error) {
      throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
    }
  }
}
