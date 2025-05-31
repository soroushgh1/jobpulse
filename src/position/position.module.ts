import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { PositionRepo } from './position.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/Guards/auth.guard';
import { AuthRepository } from 'src/auth/auth.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PositionService, PositionRepo, prismaProvider, JwtService, AuthGuard, AuthRepository],
  controllers: [PositionController],
  imports: [PrismaModule]
})
export class PositionModule {}
