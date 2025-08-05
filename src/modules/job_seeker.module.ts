import { Module } from '@nestjs/common';
import { JobSeekerService } from '../services/job_seeker.service';
import { JobSeekerController } from '../controllers/job_seeker.controller';
import { JobSeekerRepo } from '../repositories/job_seeker.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { JwtService } from '@nestjs/jwt';
import { PositionRepo } from 'src/repositories/position.repository';
import { JobSeekerGuard } from 'src/guards/job_seeker.guard';
import { AuthRepository } from 'src/repositories/auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { redisProvider } from 'src/redis/redis.provider';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  providers: [
    JobSeekerService,
    JobSeekerRepo,
    prismaProvider,
    JwtService,
    PositionRepo,
    JobSeekerGuard,
    AuthRepository,
    redisProvider
  ],
  controllers: [JobSeekerController],
  imports: [PrismaModule, RedisModule]
})
export class JobSeekerModule {}
