import { HttpException, Injectable } from '@nestjs/common';
import { JobSeekerRepo } from './job_seeker.repository';
import { MakeRequestInput } from './DTO/job_seeker.dto';
import { Request } from '@prisma/client';

@Injectable()
export class JobSeekerService {
    constructor(
        private readonly jobSeekerRepo: JobSeekerRepo,
    ){}

    async MakeRequest(input: MakeRequestInput, position_slug: string, req): Promise<string> {

        try {
            
            this.jobSeekerRepo.MakeRequest(input, position_slug, req);

            return "requested successfull";
        } catch (err: any) {
            throw new HttpException(err.message, 400);
        }
    }

}