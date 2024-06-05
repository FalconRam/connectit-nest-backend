import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CreateResponseService {
  successResponse(payload: {}, customMessage: string) {
    return {
      status: true,
      data: payload,
      message: customMessage || 'Success',
    };
  }
  successAuthResponse(
    payload: {},
    tokens: { accessToken: string; refreshToken: string },
    customMessage: string,
  ) {
    return {
      status: true,
      data: payload,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: customMessage || 'Success',
    };
  }
  customErrorResponse(statusCode: number, payload: {}, customMessage: string) {
    throw new HttpException(
      {
        status: false,
        data: payload,
        message: customMessage || 'Failure',
      },
      statusCode,
    );
  }
  handleError(error: Error) {
    console.log(error.message);
    if (error instanceof HttpException) throw error;
    else
      throw new InternalServerErrorException(
        this.customErrorResponse(
          500,
          {},
          'An Error Occured, Please Try again.',
        ),
      );
  }
}
