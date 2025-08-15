import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class WinstonLogger {
  private readonly logger: winston.Logger;

  constructor() {

    const levelFilter = (level: string) =>
      winston.format((info) => (info.level === level ? info : false))();

    const logDir = path.join(process.cwd(), 'src', 'logs');

    const textFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      }),
    );

    const jsonFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    );

    this.logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'error.log',
          dirname: logDir,
          level: 'error',
          format: winston.format.combine(
            textFormat,
            levelFilter("error")
          ),
        }),
        new winston.transports.File({
          filename: 'warn.log',
          dirname: logDir,
          level: 'warn',
          format: winston.format.combine(
            textFormat,
            levelFilter("warn")
          ),
        }),
        new winston.transports.File({
          filename: 'info.log',
          dirname: logDir,
          level: 'info',
          format: winston.format.combine(
            textFormat,
            levelFilter("info")
          ),
        }),
        new winston.transports.File({
          filename: 'debug.log',
          dirname: logDir,
          level: 'debug',
          format: winston.format.combine(
            textFormat,
            levelFilter("debug")
          ),
        }),
        new winston.transports.File({
          filename: 'http.json',
          dirname: logDir,
          level: 'http',
          format: winston.format.combine(
            jsonFormat,
            levelFilter("http")
          ),
        }),
      ],
    });
  }

  error(message: string, trace?: string) {
    this.logger.error(trace ? `${message} - ${trace}` : message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  http(data: Record<string, any>) {
    this.logger.http(data);
  }
}
