import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import PrismaService from 'prisma/prisma.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, PrismaService, AuthGuard, JwtService, AuthRepository]
})
export class CompanyModule {}
