import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class WinstonLogger {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'src', 'logs');

    const levelFilter = (level: string) => {
      return winston.format((info) => {
        return info.level === level ? info : false;
      })();
    };

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          dirname: logDir,
          level: 'error',
          format: levelFilter('error')
        }),
        new winston.transports.File({
          filename: 'warn.log',
          dirname: logDir,
          level: 'warn',
          format: levelFilter('warn')
        }),
        new winston.transports.File({
          filename: 'info.log',
          dirname: logDir,
          level: 'info',
          format: levelFilter('info')
        }),
        new winston.transports.File({
          filename: 'http.log',
          dirname: logDir,
          level: 'http',
          format: levelFilter('http')
        }),
        new winston.transports.File({
          filename: 'debug.log',
          dirname: logDir,
          level: 'debug',
          format: levelFilter('debug')
        }),
      ],
    });
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  http(message: string) {
    this.logger.http(message);
  }
}
