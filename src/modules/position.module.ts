import { Module } from '@nestjs/common';
import { PositionService } from '../services/position.service';
import { PositionController } from '../controllers/position.controller';
import { PositionRepo } from '../repositories/position.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthRepository } from 'src/repositories/auth.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PositionService, PositionRepo, prismaProvider, JwtService, AuthGuard, AuthRepository],
  controllers: [PositionController],
  imports: [PrismaModule]
})
export class PositionModule {}
