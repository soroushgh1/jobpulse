import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware } from '@nestjs/common';
import { WinstonLogger } from './winston.logger';
import { v4 as uuidv4 } from 'uuid';
import { NextFunction, Response } from 'express';
import { finalize, Observable, tap } from 'rxjs';

@Injectable()
export class LogRequest implements NestInterceptor {

  constructor(
    private readonly logger: WinstonLogger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    
    const ctx = context.switchToHttp();

    const req = ctx.getRequest();

    const { password, ...safeBody } = req.body;

    let logContext = {
      logId: uuidv4(),
      body: safeBody,
      ip: req.ip,
      user: req.user,
      agent: req.get('User-Agent'),
      method: req.method
    };

    this.logger.http(logContext);

    return next.handle();
  }
}