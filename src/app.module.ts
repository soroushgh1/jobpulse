import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { JobSeekerModule } from './job_seeker/job_seeker.module';
import { PositionModule } from './position/position.module';
import { RedisModule } from './redis/redis.module';
import Redis from 'ioredis';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CompanyModule,
    JobSeekerModule,
    PositionModule,
    RedisModule,
  ],
  exports: []
})

export class AppModule {}