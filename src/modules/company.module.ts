import { Module } from '@nestjs/common';
import { CompanyController } from '../controllers/company.controller';
import { CompanyService } from '../services/company.service';
import { CompanyRepository } from '../repositories/company.repository';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/repositories/auth.repository';
import { RedisModule } from 'src/redis/redis.module';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { PrismaModule } from 'src/prisma/prisma.module';
import { redisProvider } from 'src/redis/redis.provider';
import { PositionModule } from './position.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, prismaProvider, AuthGuard, JwtService, AuthRepository, redisProvider],
  imports: [PrismaModule, RedisModule, PositionModule]
})
export class CompanyModule {}
