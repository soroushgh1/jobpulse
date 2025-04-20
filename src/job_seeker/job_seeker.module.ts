import { Module } from '@nestjs/common';
import { JobSeekerService } from './job_seeker.service';
import { JobSeekerController } from './job_seeker.controller';

@Module({
  providers: [JobSeekerService],
  controllers: [JobSeekerController]
})
export class JobSeekerModule {}
