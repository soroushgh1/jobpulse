import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import {
  CompanyRegisterInput,
  CompanyUpdateInput,
  DenyRequestInput,
} from '../dtos/company.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyGuard } from 'src/guards/company.guard';
import { CompanyGet } from 'src/types/types';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MakeUniqueFileName } from 'src/utils/helpers';
import { DeleteFilesInterceptor } from '../interceptors/deleteFiles.interceptor';
import * as docs from 'src/docs/company.docs';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @ApiResponse(docs.createCompanyOK)
  @ApiResponse(docs.createCompanyBAD)
  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard, CompanyGuard)
  async createCompany(
    @Body() input: CompanyRegisterInput,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.createCompany(input, req);
    return { message: result, success: true };
  }

  @Post('attachpicture/:slug')
  @UseGuards(AuthGuard, CompanyGuard)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName: string = MakeUniqueFileName(file.originalname);
          callback(null, uniqueName);
        },
      }),
      limits: { fileSize: 10_000_000 },
      fileFilter(req, file, callback) {
        const isImage: boolean =
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/jpg';
        if (!isImage) {
          req.fileValidationErr = 'Wrong type';
          return callback(null, false);
        }

        return callback(null, true);
      },
    }),

    DeleteFilesInterceptor
  )
  @HttpCode(201)
  @ApiResponse(docs.attachPictureOK)
  async attachPicture(
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      })
    )
    files: Array<Express.Multer.File>,
    @Param('slug') slug: string,
    @Req() req
  ): Promise<any> {
    req.UploadedFiles = files;

    if (req.fileValidationErr) return { success: false, error: req.fileValidationErr };

    const result: string = await this.companyService.attachPicture(files, slug, req);

    return { success: true, result: result };
  }

  @Put('update/:slug')
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for update',
    example: 'my-good-company-2',
  })
  @ApiResponse(docs.updateCompanyOK)
  @ApiResponse(docs.updateCompanyBAD)
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async updateCompany(
    @Body() input: CompanyUpdateInput,
    @Req() req,
    @Param('slug') company_slug: string
  ): Promise<any> {
    const result: string = await this.companyService.updateCompany(input, company_slug, req);
    return { message: result, success: true };
  }

  @UseGuards(AuthGuard, CompanyGuard)
  @Post('getme')
  @HttpCode(200)
  async showMyCompany(
    @Req() req
  ): Promise<any> {
    const company: CompanyGet | null = await this.companyService.showMyCompany(req);
    return { company, success: true };
  }

  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for deleting',
    example: 'my-company-1521',
  })
  @ApiResponse(docs.deleteCompanyOK)
  @ApiResponse(docs.deleteCompanyNOTFOUND)
  @Delete('delete/:slug')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async deleteCompany(@Param('slug') company_slug: string, @Req() req): Promise<any> {
    const result: string = await this.companyService.deleteCompany(company_slug, req);
    return { success: true, message: result };
  }

  @Get('')
  @ApiResponse(docs.viewAllOK)
  @ApiResponse(docs.viewAllINTERNALERROR)
  @HttpCode(200)
  async viewAll(): Promise<any> {
    return { companies: await this.companyService.viewAll(), success: true };
  }

  @ApiParam({
    name: 'request_id',
    type: 'number',
    description: 'Request ID for denying a request',
  })
  @ApiResponse(docs.denyRequestOK)
  @ApiResponse(docs.denyRequestBAD)
  @Post('denyrequest/:request_id')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async denyRequest(
    @Param('request_id') request_id: number,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.denyRequest(input, request_id, req);
    return { message: result, success: true };
  }

  @ApiParam({
    name: 'request_id',
    type: 'number',
    description: 'Request ID for accepting a request',
  })
  @ApiResponse(docs.acceptRequestOK)
  @ApiResponse(docs.acceptRequestNOTFOUND)
  @Post('acceptrequest/:request_id')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async acceptRequest(
    @Body() input: DenyRequestInput,
    @Param('request_id') request_id: number,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.acceptRequest(request_id, req);
    return { message: result, success: true };
  }

  @Get('search')
  @HttpCode(200)
  async searchCompanies(@Query('q') query: string): Promise<any> {
    const result: CompanyGet[] | null | string = await this.companyService.searchCompanies(query);
    return { result: result, success: true };
  }

  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for fetching information',
  })
  @ApiResponse(docs.showCompanyOK)
  @ApiResponse(docs.showCompanyNOTFOUND)
  @Get(':slug')
  async getCompany(
    @Param('slug') slug: string
  ): Promise<any> {
    const company: CompanyGet = await this.getCompany(slug);

    return { company, success: true };
  }
  
  @Post('deleterequest/:request_id')
  @UseGuards(AuthGuard, CompanyGuard)
  @HttpCode(200)
  async deleteRequestsForPosition(
    @Param('request_id') request_id: number,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.deleteRequestsForPosition(request_id, req);

    return { result, success: true };
  }
  
}