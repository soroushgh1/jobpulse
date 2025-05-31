import { Module } from '@nestjs/common';
import { JobSeekerService } from './job_seeker.service';
import { JobSeekerController } from './job_seeker.controller';
import { JobSeekerRepo } from './job_seeker.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { JwtService } from '@nestjs/jwt';
import { PositionRepo } from 'src/position/position.repository';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { AuthRepository } from 'src/auth/auth.repository';
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
