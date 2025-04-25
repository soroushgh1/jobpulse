import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { MakeRequestInput } from './DTO/job_seeker.dto';
import { JobSeekerService } from './job_seeker.service';

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
}