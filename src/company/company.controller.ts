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
import { CompanyService } from './company.service';
import {
  CompanyRegisterInput,
  CompanyUpdateInput,
  DenyRequestInput,
} from './DTO/company.dto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { CompanyGet } from 'src/types/types';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MakeUniqueFileName } from 'src/utils/helpers';
import { DeleteFilesInterceptor } from './DeleteFilesInterceptor.interceptor';
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
  async CreateCompany(
    @Body() input: CompanyRegisterInput,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.CreateCompany(input, req);
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
  async AttachPicture(
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

    const result: string = await this.companyService.AttachPicture(files, slug, req);

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
  async UpdateCompany(
    @Body() input: CompanyUpdateInput,
    @Req() req,
    @Param('slug') company_slug: string
  ): Promise<any> {
    const result: string = await this.companyService.UpdateCompany(input, company_slug, req);
    return { message: result, success: true };
  }

  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for fetching information',
  })
  @ApiResponse(docs.showCompanyOK)
  @ApiResponse(docs.showCompanyNOTFOUND)
  @Get('getme/:slug')
  @HttpCode(200)
  async ShowCompany(@Param('slug') company_slug: string): Promise<any> {
    const company: CompanyGet | null = await this.companyService.ShowCompany(company_slug);
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
  async DeleteCompany(@Param('slug') company_slug: string, @Req() req): Promise<any> {
    const result: string = await this.companyService.DeleteCompany(company_slug, req);
    return { success: true, message: result };
  }

  @Get('')
  @ApiResponse(docs.viewAllOK)
  @ApiResponse(docs.viewAllINTERNALERROR)
  @HttpCode(200)
  async ViewAll(): Promise<any> {
    return { companies: await this.companyService.ViewAll(), success: true };
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
  async DenyRequest(
    @Body() input: DenyRequestInput,
    @Param('request_id') request_id: number,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.DenyRequest(input, request_id, req);
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
  async AcceptRequest(
    @Body() input: DenyRequestInput,
    @Param('request_id') request_id: number,
    @Req() req
  ): Promise<any> {
    const result: string = await this.companyService.AcceptRequest(request_id, req);
    return { message: result, success: true };
  }

  @Get('search')
  @HttpCode(200)
  async SearchCompanies(@Query('q') query: string): Promise<any> {
    const result: CompanyGet[] | null | string = await this.companyService.SearchCompanies(query);
    return { result: result, success: true };
  }

  @Get(':slug')
  async GetCompany(
    @Param('slug') slug: string
  ): Promise<any> {
    const company: CompanyGet = await this.GetCompany(slug);

    return { company, success: true };
  }
  
}