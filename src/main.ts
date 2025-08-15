import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import winston from 'winston/lib/winston/config';
import { WinstonLogger } from './config/winston.logger';
import { LogExceptionFilter } from './config/logexception.filter';
import { LogRequest } from './config/log.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }))
  app.use(cookieParser())

  const swaggerConfig = new DocumentBuilder()
  .setTitle('JobPulse')
  .setDescription('Job searching API')
  .setVersion('1.0.0')
  .build();

  const logger: WinstonLogger = new WinstonLogger();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  logger.debug("app is running on port 3000");
  app.useGlobalFilters(new LogExceptionFilter(logger));
  app.useGlobalInterceptors(new LogRequest(logger));
  app.use(helmet());
  app.enableCors({
    origin: "*"
  })

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();