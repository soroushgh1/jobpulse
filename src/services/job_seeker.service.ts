import { HttpException, Injectable } from '@nestjs/common';
import { JobSeekerRepo } from '../repositories/job_seeker.repository';
import { Request } from '@prisma/client';

@Injectable()
export class JobSeekerService {
  constructor(private readonly jobSeekerRepo: JobSeekerRepo) {}

  async makeRequest(resumeFile: Express.Multer.File, positionSlug: string, req): Promise<string> {
    await this.jobSeekerRepo.makeRequest(resumeFile, positionSlug, req);
    return 'requested successful';
  }

  async deleteRequest(positionSlug: string, req): Promise<string> {
    const result: string = await this.jobSeekerRepo.deleteRequest(positionSlug, req);
    return result;
  }

  async showMyRequests(req): Promise<any> {
    const requests: any = await this.jobSeekerRepo.showMyRequests(req);
    return requests;
  }

  async showAllRequestsForPosition(positionSlug: string, req): Promise<any> {
    const requests: any = await this.jobSeekerRepo.showAllRequestsForPosition(positionSlug, req);
    return requests;
  }

  async showAllRequests(req): Promise<any> {
    const requests: any = await this.jobSeekerRepo.showAllRequests(req);
    return requests;
  }

  async showAllAcceptedsForPosition(positionSlug: string, req): Promise<any> {
    const requests: any = await this.jobSeekerRepo.showAllAcceptedsForPosition(positionSlug, req);
    return requests;
  }

  async showMyNotifications(userId: number): Promise<string[]> {
    const notifications: string[] = await this.jobSeekerRepo.showMyNotifications(userId);
    return notifications;
  }

  async getMe(userId: number, isAdmin: boolean): Promise<any> {
    return await this.jobSeekerRepo.getMe(userId, isAdmin);
  }

  async deleteNotification(notification_id: number, req): Promise<string> {
    return await this.jobSeekerRepo.deleteNotification(notification_id, req);
  }
}