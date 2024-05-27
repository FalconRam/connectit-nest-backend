import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CreateResponseService {
  successResponse(payload: {}, customMessage: string) {
    return {
      status: true,
      data: payload,
      message: customMessage || 'Success',
    };
  }
  serverErrorResponse(payload: {}, customMessage: string) {
    throw new HttpException(
      {
        status: false,
        message: customMessage || 'An Error Occured, Please Try again.',
        data: payload,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  notFoundErrorResponse(payload: {}, customMessage: string) {
    throw new HttpException(
      {
        status: false,
        message: customMessage || 'Resource Not found',
        data: payload,
      },
      HttpStatus.NOT_FOUND,
    );
  }
  badErrorResponse(payload: {}, customMessage: string) {
    throw new HttpException(
      {
        status: false,
        message: customMessage || 'Please check the Inputs',
        data: payload,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
