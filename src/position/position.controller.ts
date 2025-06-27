import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { PositionService } from './position.service';
import { PositionGet } from 'src/types/types';
import { CreatePositionInput, UpdatePositionInput } from './DTO/position.dto';

@Controller('position')
export class PositionController {
    constructor(
        private readonly positionService: PositionService,
    ){}

    @Post('create')
    @HttpCode(201)
    @UseGuards(AuthGuard, CompanyGuard)
    async CreatePosition(@Body() input: CreatePositionInput, @Req() req): Promise<any> {
        
        const result: string = await this.positionService.CreatePosition(input, req)

        return { message: result, success: true };
    }

    @Get('get/:slug')
    @HttpCode(200)
    async ShowOne(@Param('slug') slug: string): Promise<any> {
        
        const position: PositionGet | null = await this.positionService.ShowOne(slug);

        return { position: position, success: true };
    }

    @Put('update/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    async UpdatePosition(@Body() input: UpdatePositionInput, @Param('slug') slug: string, @Req() req): Promise<any> {

        const result: string = await this.positionService.UpdatePosition(input, req.user.id, req.user.isAdmin, slug);

        return { message: result, success: true }
    }

    @Delete('delete/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    async DeleteCompany(@Param('id') position_id: string, @Req() req): Promise<any> {
    
        const result: string = await this.positionService.DeletePosition(position_id, req);
    
        return { success: true, message: result };
    }

    @Post('mypositions')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    async ShowMyCompanyPositions(@Req() req): Promise<any> {

        const positions: PositionGet[] | null = await this.positionService.ShowMyCompanyPositions(req);

        return { positions, success: true };
    }

    @Get('company/:slug')
    @HttpCode(200)
    async AllPositionsOfCompany(@Param('slug') company_slug: string): Promise<any> {

        const positions: PositionGet[] | null = await this.positionService.AllPositionsOfCompany(company_slug);

        return { positions, success: true };
    }
    @Get('search')
    @HttpCode(200)
    async SearchPositions(@Query('query') query: string): Promise<any> {
        const result: PositionGet[] | null | string = await this.positionService.SearchPositions(query);

        return { result: result, success: true };
    }
}