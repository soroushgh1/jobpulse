import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import PrismaService from 'prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/Guards/auth.guard';
import Redis from 'ioredis';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PrismaService,
    JwtModule,
    JwtService,
    AuthGuard,
    Redis,
  ],
})
export class AuthModule {}