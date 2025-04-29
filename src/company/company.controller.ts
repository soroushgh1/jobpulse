import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRegisterInput, CompanyUpdateInput, DenyRequestInput } from './DTO/company.dto';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { Company } from '@prisma/client';
import { CompanyGet } from 'src/types/types';

@Controller('company')
export class CompanyController {
    constructor(
        private readonly companyService: CompanyService,
    ) {}
    
    @Post('create')
    @UseGuards(AuthGuard, CompanyGuard)
    async CreateCompany(@Body() input: CompanyRegisterInput, @Req() req): Promise<any> {

        const result: string = await this.companyService.CreateCompany(input, req);
        return { message: result, success: true };
    }

    @Put('update/:id')
    @UseGuards(AuthGuard, CompanyGuard)
    async UpdateCompany(@Body() input: CompanyUpdateInput, @Req() req, @Param('id') company_id: string): Promise<any> {

        const result: string = await this.companyService.UpdateCompany(input, company_id, req);
        return { message: result, success: true };
    }

    @Get(':id')
    async ShowCompany(@Param('id') company_id: string): Promise<any> {

        const company: CompanyGet | null = await this.companyService.ShowCompany(company_id);
        return { company, success: true };
    } 

    @Delete('delete/:id')
    @UseGuards(AuthGuard, CompanyGuard)
    async DeleteCompany(@Param('id') company_id: string, @Req() req): Promise<any> {

        const result: string = await this.companyService.DeleteCompany(company_id, req);

        return { success: true, message: result };
    }

    @Get('')
    async ViewAll(): Promise<any> {
        return { companies: await this.companyService.ViewAll(), success: true };
    }

    @Post('denyrequest/:request_id')
    @UseGuards(AuthGuard, CompanyGuard)
    async DenyRequest(@Body() input: DenyRequestInput, @Param('request_id') request_id: number, @Req() req): Promise<any> {

        const result: string = await this.companyService.DenyRequest(input, request_id, req);

        return { message: result, success: true };
    }

    @Post('acceptrequest/:request_id')
    @UseGuards(AuthGuard, CompanyGuard)
    async AcceptRequest(@Body() input: DenyRequestInput, @Param('request_id') request_id: number, @Req() req): Promise<any> {

        const result: string = await this.companyService.DenyRequest(input, request_id, req);

        return { message: result, success: true };
    }
}