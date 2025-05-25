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
            
            await this.jobSeekerRepo.MakeRequest(input, position_slug, req);

            return "requested successfull";
        } catch (err: any) {
            throw new HttpException(err.message, 400);
        }
    }

    async DeleteRequest(position_slug: string, req): Promise<string> {

        try {
            
            const result: string = await this.jobSeekerRepo.DeleteRequest(position_slug, req);

            return result;
        } catch (err: any) {
            throw new HttpException(err.message, 400);
        }
    }

    async ShowMyRequests(req): Promise<any> {

        try {
            
            const requests: any = await this.jobSeekerRepo.ShowMyRequests(req);

            return requests;

        } catch (err: any) {

            throw new HttpException(err.message, 400);
        }

    }

    async ShowAllRequestForPosition(position_slug: string, req): Promise<any> {

        try {
            
            const requests: any = await this.jobSeekerRepo.ShowAllRequestForPosition(position_slug, req);

            return requests;

        } catch (err: any) {

            throw new HttpException(err.message, 400);
        }

    }

    async ShowMyNotification(user_id: number): Promise<string[]> {

        try {
            
            const notifications: string[] = await this.jobSeekerRepo.ShowMyNotification(user_id);

            return notifications;

        } catch (err: any) {

            throw new HttpException(err.message, 400);
        }
        
    }
}