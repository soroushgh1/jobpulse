import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from 'path';
import { AuthModule } from './modules/auth.module';
import { CompanyModule } from './modules/company.module';
import { JobSeekerModule } from './modules/job_seeker.module';
import { PositionModule } from './modules/position.module';
import { TicketModule } from './modules/ticket.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    CompanyModule,
    JobSeekerModule,
    PositionModule,
    RedisModule,
    PrismaModule,
    MulterModule.register({
      dest: './uploads'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    TicketModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 60 * 1000, // 1 minute
          limit: 10, // max 10 requests per minute
        },
        {
          name: 'medium',
          ttl: 10 * 60 * 1000, // 10 minutes
          limit: 250, // max 250 requests per 10 min (~5/min sustained)
        },
        {
          name: 'long',
          ttl: 60 * 60 * 1000, // 1 hour
          limit: 500, // max 500 requests per hour (~3.3/min sustained)
        },
      ],
    }),
  ],
  
  exports: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})

export class AppModule {}