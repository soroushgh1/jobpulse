import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	InternalServerErrorException,
	UnauthorizedException,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { WinstonLogger } from './winston.logger';

@Catch()
export class LogExceptionFilter implements ExceptionFilter {
	constructor(private readonly logger: WinstonLogger) {}

	catch(
		exception: InternalServerErrorException | UnauthorizedException,
		host: ArgumentsHost,
	) {
		const context = host.switchToHttp();
		const req: any = context.getRequest();
		const res: Response = context.getResponse();

		if (exception instanceof InternalServerErrorException) {
			this.logger.error(exception.message, exception.stack);

			res.status(500).json({
				message: 'something bad happened at server',
				error: 'internal error',
				statusCode: 500,
			});
		}

		if (exception instanceof UnauthorizedException) {
			this.logger.warn(
				`Unauthorized request from [ip: ${req.ip}, agent: ${req.get('User-Agent')}, payload: ${JSON.stringify(req.user) ?? null}, body: ${JSON.stringify(req.body) ?? null}] to ${req.method} ${req.url}`,
			);
			res.status(500).json({
				message: 'you can not do this action, you do not have required access',
				error: 'Unauthorized',
				statusCode: 401,
			});
		}
	}
}
