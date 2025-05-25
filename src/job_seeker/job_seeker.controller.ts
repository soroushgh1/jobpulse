import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { MakeRequestInput } from './DTO/job_seeker.dto';
import { JobSeekerService } from './job_seeker.service';
import { CompanyGuard } from 'src/Guards/company.guard';

@Controller('jobseeker')
export class JobSeekerController {
    constructor(
        private readonly jobSeekerService: JobSeekerService,
    ){}

    @Post(':slug/makerequest')
    @UseGuards(AuthGuard, JobSeekerGuard)
    async MakeRequest(@Body() input: MakeRequestInput, @Param('slug') position_slug: string, @Req() req): Promise<any> {

        const result: string = await this.jobSeekerService.MakeRequest(input, position_slug, req);

        return { message: result, success: true };
    }

    @Delete(':slug/deleterequest')
    @UseGuards(AuthGuard, JobSeekerGuard)
    async DeleteRequest(@Param('slug') position_slug: string, @Req() req): Promise<any> {

        const result: string = await this.jobSeekerService.DeleteRequest(position_slug, req);

        return { message: result, success: true };
    }

    @Post('myrequests')
    @UseGuards(AuthGuard, JobSeekerGuard)
    async ShowMyRequests(@Req() req): Promise<any> {

        const requests: any = await this.jobSeekerService.ShowMyRequests(req);

        return { requests, success: true };
    }

    @Post(':slug/allrequests')
    @UseGuards(AuthGuard, CompanyGuard)
    async ShowAllRequestForPosition(@Param('slug') position_slug: string, @Req() req): Promise<any> {

        const requests: any = await this.jobSeekerService.ShowAllRequestForPosition(position_slug, req);

        return { requests, success: true };
    }

    @Post('mynotifications')
    @UseGuards(AuthGuard, JobSeekerGuard)
    async ShowMyNotification(@Req() req): Promise<any> {

        const notifications: string[] = await this.jobSeekerService.ShowMyNotification(req.user.id);

        return { success: true, notifications: notifications };
        
    }
    
}