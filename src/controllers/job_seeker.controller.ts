import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { JobSeekerGuard } from 'src/guards/job_seeker.guard';
import { CompanyGuard } from 'src/guards/company.guard';
import { JobSeekerService } from '../services/job_seeker.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MakeUniqueFileName } from 'src/utils/helpers';
import { DeleteFileInterceptor } from 'src/interceptors/deleteFile.interceptor';
import * as docs from 'src/docs/job_seeker.docs';
import { Throttle } from '@nestjs/throttler';

@ApiTags('jobseeker')
@Controller('jobseeker')
export class JobSeekerController {
  constructor(private readonly jobSeekerService: JobSeekerService) {}

  @Throttle({ default: { ttl: 600_000, limit: 250 } }) // medium: 10 min, 250 req
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Position slug to make request for',
  })
  @ApiBody({ type: 'file' })
  @ApiResponse(docs.makeRequestOK)
  @ApiResponse(docs.makeRequestBAD)
  @Post(':slug/makerequest')
  @UseGuards(AuthGuard, JobSeekerGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
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
  async makeRequest(
    @UploadedFile(
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      })
    )
    file: Express.Multer.File,
    @Param('slug') positionSlug: string,
    @Req() req
  ): Promise<any> {
    req.UploadedFiles = file;

    if (req.fileValidationErr) {
      return { error: req.fileValidationErr, success: false };
    }
    const result: string = await this.jobSeekerService.makeRequest(file, positionSlug, req);
    return { message: result, success: true };
  }

  @Throttle({ default: { ttl: 600_000, limit: 250 } }) // medium
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Position slug to delete my request for',
  })
  @ApiResponse(docs.deleteRequestOK)
  @ApiResponse(docs.deleteRequestBAD)
  @Delete(':slug/deleterequest')
  @UseGuards(AuthGuard, JobSeekerGuard)
  @HttpCode(200)
  async deleteRequest(@Param('slug') positionSlug: string, @Req() req): Promise<any> {
    const result: string = await this.jobSeekerService.deleteRequest(positionSlug, req);
    return { message: result, success: true };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long: 1 hour, 500 req
  @ApiResponse(docs.showMyRequestsOK)
  @Post('myrequests')
  @UseGuards(AuthGuard, JobSeekerGuard)
  @HttpCode(200)
  async showMyRequests(@Req() req): Promise<any> {
    const requests: any = await this.jobSeekerService.showMyRequests(req);
    return { requests, success: true };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long
  @ApiResponse(docs.showAllRequestsOK)
  @ApiResponse(docs.showAllRequestsUNAUTHORIZED)
  @Post('allrequests')
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(200)
  async showAllRequests(@Req() req): Promise<any> {
    const requests: any = await this.jobSeekerService.showAllRequests(req);
    return { requests, success: true };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Position slug to view all requests (company access)',
  })
  @ApiResponse(docs.showAllRequestsOK)
  @ApiResponse(docs.showAllRequestsUNAUTHORIZED)
  @Post(':slug/allrequests')
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(200)
  async showAllRequestsForPosition(@Param('slug') positionSlug: string, @Req() req): Promise<any> {
    const requests: any = await this.jobSeekerService.showAllRequestsForPosition(positionSlug, req);
    return { requests, success: true };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long
  @ApiResponse(docs.showMyNotificationsOK)
  @ApiResponse(docs.showMyNotificationsBAD)
  @Post('mynotifications')
  @UseGuards(AuthGuard, JobSeekerGuard)
  @HttpCode(200)
  async showMyNotifications(@Req() req): Promise<any> {
    const notifications: string[] = await this.jobSeekerService.showMyNotifications(req.user.id);
    return { success: true, notifications: notifications };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long
  @Post('getme')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getMe(@Req() req): Promise<any> {
    const user = await this.jobSeekerService.getMe(req.user.id, req.user.isAdmin);
    return { success: true, user: user };
  }

  @Throttle({ default: { ttl: 3_600_000, limit: 500 } }) // long
  @Post('deletenotif/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async deleteNotification(@Param('id') notification_id: number, @Req() req): Promise<any> {
    const result: string = await this.jobSeekerService.deleteNotification(notification_id, req);
    return { result, success: true };
  }
}