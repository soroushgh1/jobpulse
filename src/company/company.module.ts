import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';
import { RedisModule } from 'src/redis/redis.module';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { PrismaModule } from 'src/prisma/prisma.module';
import { redisProvider } from 'src/redis/redis.provider';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, prismaProvider, AuthGuard, JwtService, AuthRepository, redisProvider],
  imports: [PrismaModule, RedisModule]
})
export class CompanyModule {}
