import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  healthCheck(@Res() res: Response): Response {
    return res
      .status(200)
      .json({ message: "I'm okay!", timestamps: new Date() });
  }
}
