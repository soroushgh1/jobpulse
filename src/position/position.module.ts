import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { PositionRepo } from './position.repository';
import PrismaService from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/Guards/auth.guard';
import { AuthRepository } from 'src/auth/auth.repository';

@Module({
  providers: [PositionService, PositionRepo, PrismaService, JwtService, AuthGuard, AuthRepository],
  controllers: [PositionController]
})
export class PositionModule {}
