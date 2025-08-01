import { HttpException, Injectable } from '@nestjs/common';
import { JobSeekerRepo } from './job_seeker.repository';
import { Request } from '@prisma/client';

@Injectable()
export class JobSeekerService {
    constructor(
        private readonly jobSeekerRepo: JobSeekerRepo,
    ){}

    async MakeRequest(resume_file: Express.Multer.File, position_slug: string, req): Promise<string> {
            await this.jobSeekerRepo.MakeRequest(resume_file, position_slug, req);

            return "requested successfull";
    }

    async DeleteRequest(position_slug: string, req): Promise<string> {

            const result: string = await this.jobSeekerRepo.DeleteRequest(position_slug, req);

            return result;
    }

    async ShowMyRequests(req): Promise<any> {

            const requests: any = await this.jobSeekerRepo.ShowMyRequests(req);

            return requests;
    }

    async ShowAllRequestForPosition(position_slug: string, req): Promise<any> {

            const requests: any = await this.jobSeekerRepo.ShowAllRequestForPosition(position_slug, req);

            return requests;
    }

    async ShowMyNotification(user_id: number): Promise<string[]> {
  
            const notifications: string[] = await this.jobSeekerRepo.ShowMyNotification(user_id);

            return notifications;
    }

    async GetMe(userId: number): Promise<any> {
            return await this.jobSeekerRepo.GetMe(userId);
    }
    
}