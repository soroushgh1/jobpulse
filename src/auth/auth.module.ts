import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/Guards/auth.guard';
import Redis from 'ioredis';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    prismaProvider,
    JwtModule,
    JwtService,
    AuthGuard,
  ],
  imports: [PrismaModule, RedisModule],
  exports: [AuthRepository]
})
export class AuthModule {}