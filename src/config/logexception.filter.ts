import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { WinstonLogger } from './winston.logger';

@Catch(InternalServerErrorException)
export class LogExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: WinstonLogger,
    ) {
    }

    catch(exception: InternalServerErrorException, host: ArgumentsHost) {
        this.logger.error(exception.message, exception.stack)

        const context = host.switchToHttp();
        const res: Response = context.getResponse();

        res.status(500).json({
            message: "something bad happened at server",
            error: "internal error",
            statusCode: 500
        });
    }
}
