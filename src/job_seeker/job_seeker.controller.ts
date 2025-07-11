import { BadRequestException, Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseFilePipeBuilder, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/Guards/auth.guard';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { JobSeekerService } from './job_seeker.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MakeUniqueFileName } from 'src/utils/helpers';
import { DeleteFileInterceptor } from 'src/company/DeleteFileInterceptor.interceptor';

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
    @ApiBody({ type: "file" })
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
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./uploads",
            filename(req, file, callback) {
                const uniqueName: string = MakeUniqueFileName(file.originalname);
                return callback(null, uniqueName);
            },
        }),
        limits: { fileSize: 10_000_000 },
        async fileFilter(req, file, callback) {
            if (file.mimetype !== 'application/pdf') {
                return callback(new BadRequestException('Only PDFs allowed'), false);
            }

            return callback(null, true);
        },
    }),
    DeleteFileInterceptor
    )
    @HttpCode(201)
    async MakeRequest(@UploadedFile(
        new ParseFilePipeBuilder()
        .build({
            fileIsRequired: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    ) file: Express.Multer.File, @Param('slug') position_slug: string, @Req() req): Promise<any> {
        req.UploadedFiles = file;

        if (req.fileValidationErr) {
            return { error: req.fileValidationErr, success: false };
        }
        const result: string = await this.jobSeekerService.MakeRequest(file, position_slug, req);
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

    @Post('getme')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    async GetMe(@Req() req): Promise<any> {
        const user = await this.jobSeekerService.GetMe(req.user.id);
        return { success: true, user: user };
    }
    
}
