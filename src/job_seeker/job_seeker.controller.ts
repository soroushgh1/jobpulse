import { Body, Controller, Delete, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { MakeRequestInput } from './DTO/job_seeker.dto';
import { JobSeekerService } from './job_seeker.service';

@ApiTags('jobseeker')
@Controller('jobseeker')
export class JobSeekerController {
    constructor(
        private readonly jobSeekerService: JobSeekerService,
    ){}

    @ApiParam({
        name: 'slug',
        type: 'string',
        description: 'Position slug to make request for',
    })
    @ApiBody({ type: MakeRequestInput })
    @ApiResponse({
        status: 201,
        description: 'Request created successfully',
        example: {
            message: 'request created successfully',
            success: true,
        },
    })
    @ApiResponse({
        status: 400,
        description: 'You already sent a request for this position',
        example: {
            statusCode: 400,
            message: 'you already sent a request for this position',
        },
    })
    @Post(':slug/makerequest')
    @UseGuards(AuthGuard, JobSeekerGuard)
    @HttpCode(201)
    async MakeRequest(@Body() input: MakeRequestInput, @Param('slug') position_slug: string, @Req() req): Promise<any> {
        const result: string = await this.jobSeekerService.MakeRequest(input, position_slug, req);
        return { message: result, success: true };
    }

    @ApiParam({
        name: 'slug',
        type: 'string',
        description: 'Position slug to delete my request for',
    })
    @ApiResponse({
        status: 200,
        description: 'Request deleted successfully',
        example: {
            message: 'request deleted successfully',
            success: true,
        },
    })
    @ApiResponse({
        status: 400,
        description: 'You did not send a request to this position',
        example: {
            statusCode: 400,
            message: 'you did not sent a request to this position',
        },
    })
    @Delete(':slug/deleterequest')
    @UseGuards(AuthGuard, JobSeekerGuard)
    @HttpCode(200)
    async DeleteRequest(@Param('slug') position_slug: string, @Req() req): Promise<any> {
        const result: string = await this.jobSeekerService.DeleteRequest(position_slug, req);
        return { message: result, success: true };
    }

    @ApiResponse({
        status: 200,
        description: 'List of User requests',
        example: {
            requests: [
                "<myrequest_1>",
                "<myrequest_2>",
                "<myrequest_3>",
            ],
            success: true,
        },
    })
    @Post('myrequests')
    @UseGuards(AuthGuard, JobSeekerGuard)
    @HttpCode(200)
    async ShowMyRequests(@Req() req): Promise<any> {
        const requests: any = await this.jobSeekerService.ShowMyRequests(req);
        return { requests, success: true };
    }

    @ApiParam({
        name: 'slug',
        type: 'string',
        description: 'Position slug to view all requests (company access)',
    })
    @ApiResponse({
        status: 200,
        description: 'List of all requests for position (company access)',
        example: {
            requests: [
                "<request_1>",
                "<request_2>",
                "<request_3>"
            ],
            success: true,
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized to check the requests',
        example: {
            statusCode: 401,
            message: 'you are not the owner of the company for checking the requests',
        },
    })
    @Post(':slug/allrequests')
    @UseGuards(AuthGuard, CompanyGuard)
    @HttpCode(200)
    async ShowAllRequestForPosition(@Param('slug') position_slug: string, @Req() req): Promise<any> {
        const requests: any = await this.jobSeekerService.ShowAllRequestForPosition(position_slug, req);
        return { requests, success: true };
    }

    @ApiResponse({
        status: 200,
        description: 'List of user notifications',
        example: {
            success: true,
            notifications: ['Request accepted'],
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Trouble in getting notification',
        example: {
            statusCode: 400,
            message: 'trouble in getting notification',
        },
    })
    @Post('mynotifications')
    @UseGuards(AuthGuard, JobSeekerGuard)
    @HttpCode(200)
    async ShowMyNotification(@Req() req): Promise<any> {
        const notifications: string[] = await this.jobSeekerService.ShowMyNotification(req.user.id);
        return { success: true, notifications: notifications };
    }
}