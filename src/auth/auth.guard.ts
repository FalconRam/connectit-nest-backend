import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CreateResponseService } from 'src/utils/createResponse/createResponse.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private createResponseService: CreateResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Public API Access
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) {
      throw new UnauthorizedException(
        this.createResponseService.customErrorResponse(401, {}, 'Unauthorized'),
      );
    }

    try {
      if (!process.env.AUTH_ACCESS_TOKEN_SECRET_KEY)
        throw new HttpException(
          'JWT Key not available',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      let decodedData = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.AUTH_ACCESS_TOKEN_SECRET_KEY,
      });
      request['userId'] = decodedData.id;
      request['email'] = decodedData.email;
    } catch (error) {
      throw new UnauthorizedException(
        this.createResponseService.customErrorResponse(401, {}, 'Unauthorized'),
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) return undefined;
    const [type, token] = request.headers.authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
