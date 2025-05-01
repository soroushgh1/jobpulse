import { Module } from '@nestjs/common';
import { JobSeekerService } from './job_seeker.service';
import { JobSeekerController } from './job_seeker.controller';
import { JobSeekerRepo } from './job_seeker.repository';
import PrismaService from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PositionRepo } from 'src/position/position.repository';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { AuthRepository } from 'src/auth/auth.repository';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    RedisModule
  ],
  providers: [
    JobSeekerService,
    JobSeekerRepo,
    PrismaService,
    JwtService,
    PositionRepo,
    JobSeekerGuard,
    AuthRepository,
  ],
  controllers: [JobSeekerController],
})
export class JobSeekerModule {}
