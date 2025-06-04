import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRegisterInput, CompanyUpdateInput, DenyRequestInput } from './DTO/company.dto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { CompanyGet } from 'src/types/types';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiResponse({
    status: 201,
    example: {
      message: 'company created successfully.',
      success: 'true',
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'phone or email is used',
      statusCode: 400,
    },
  })
  @Post('create')
  @HttpCode(201)
  @UseGuards(AuthGuard, CompanyGuard)
  async CreateCompany(
    @Body() input: CompanyRegisterInput,
    @Req() req,
  ): Promise<any> {
    const result: string = await this.companyService.CreateCompany(input, req);
    return { message: result, success: true };
  }

  @Put('update/:slug')
  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for update',
    example: 'my-good-company-2',
  })
  @ApiResponse({
    status: 200,
    example: {
      message: 'company updated successfully',
      success: 'true',
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: 'there was a problem in updating company',
      statusCode: 400,
    },
  })
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async UpdateCompany(
    @Body() input: CompanyUpdateInput,
    @Req() req,
    @Param('slug') company_slug: string,
  ): Promise<any> {
    const result: string = await this.companyService.UpdateCompany(
      input,
      company_slug,
      req,
    );
    return { message: result, success: true };
  }

  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for fetching information',
  })
  @ApiResponse({
    status: 200,
    example: {
      company: {
        id: 101,
        name: 'my good company',
        slug: 'my-good-company',
        description: 'A tech company specializing in innovative solutions.',
        pictures: [
          'https://www.example.com/image1.jpg',
          'https://www.example.com/image2.jpg',
        ],
        address: 'random address',
        phone: '091111111111111',
        email: 'example@gmail.com',
      },
      success: true,
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      statusCode: 404,
      message: 'company not found',
    },
  })
  @Get('get/:slug')
  @HttpCode(200)
  async ShowCompany(@Param('slug') company_slug: string): Promise<any> {
    const company: CompanyGet | null =
      await this.companyService.ShowCompany(company_slug);
    return { company, success: true };
  }

  @ApiParam({
    name: 'slug',
    type: 'string',
    description: 'Company slug needed for deleting',
    example: 'my-company-1521',
  })
  @ApiResponse({
    status: 200,
    example: {
      success: 'true',
      message: 'company deleted successfully',
    },
  })
  @ApiResponse({
    status: 404,
    example: {
      statusCode: 404,
      message: 'company not found',
    },
  })
  @Delete('delete/:slug')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async DeleteCompany(
    @Param('slug') company_slug: string,
    @Req() req,
  ): Promise<any> {
    const result: string = await this.companyService.DeleteCompany(
      company_slug,
      req,
    );

    return { success: true, message: result };
  }

  @Get('')
  @ApiResponse({
    status: 200,
    description: "Fetching all companies",
    example: {
      companies: ['<company_object1>', '<company_object2>', '<company_object3'],
      success: "true"
    },
  })
  @ApiResponse({
    status: 500,
    example: {
      statusCode: 500,
      message: 'internal error',
    },
  })
  @HttpCode(200)
  async ViewAll(): Promise<any> {
    return { companies: await this.companyService.ViewAll(), success: true };
  }

  @ApiParam({
    name: 'request_id',
    type: 'number',
    description: 'Request ID for denying a request',
  })
  @ApiResponse({
    status: 200,
    description: 'Request denied successfully',
    example: {
      message: 'request denied successfully',
      success: true,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid deny request input',
    example: {
      statusCode: 400,
      message: 'invalid deny request input',
    },
  })
  @Post('denyrequest/:request_id')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async DenyRequest(
    @Body() input: DenyRequestInput,
    @Param('request_id') request_id: number,
    @Req() req,
  ): Promise<any> {
    const result: string = await this.companyService.DenyRequest(
      input,
      request_id,
      req,
    );

    return { message: result, success: true };
  }

  @ApiParam({
    name: 'request_id',
    type: 'number',
    description: 'Request ID for accepting a request',
  })
  @ApiResponse({
    status: 200,
    description: 'Request accepted successfully',
    example: {
      message: 'request accepted successfully',
      success: true,
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Request not found',
    example: {
      statusCode: 404,
      message: 'request not found',
    },
  })
  @Post('acceptrequest/:request_id')
  @HttpCode(200)
  @UseGuards(AuthGuard, CompanyGuard)
  async AcceptRequest(
    @Body() input: DenyRequestInput,
    @Param('request_id') request_id: number,
    @Req() req,
  ): Promise<any> {
    const result: string = await this.companyService.AcceptRequest(
      request_id,
      req,
    );

    return { message: result, success: true };
  }

  @Get('search')
  @HttpCode(200)
  async SearchCompanies(@Query('q') query: string): Promise<any> {

    const result: CompanyGet[] | null | string = await this.companyService.SearchCompanies(query);

    return { result: result, success: true }
  }
}