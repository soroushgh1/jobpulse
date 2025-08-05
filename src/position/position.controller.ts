import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { PositionService } from './position.service';
import { PositionGet } from 'src/types/types';
import { CreatePositionInput, UpdatePositionInput } from './DTO/position.dto';
import * as docs from 'src/docs/position.docs';
import { ApiResponse } from '@nestjs/swagger';

@Controller('position')
export class PositionController {
    constructor(
        private readonly positionService: PositionService,
    ){}

    @Post('create')
    @HttpCode(201)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.createPositionOK)
    @ApiResponse(docs.createPositionBAD)
    async createPosition(@Body() input: CreatePositionInput, @Req() req): Promise<any> {
        const result: string = await this.positionService.createPosition(input, req);
        return { message: result, success: true };
    }

    @Get('get/:slug')
    @HttpCode(200)
    @ApiResponse(docs.showOneOK)
    @ApiResponse(docs.showOneNotFound)
    async showOne(@Param('slug') slug: string): Promise<any> {
        const position: PositionGet | null = await this.positionService.showOne(slug);
        return { position, success: true };
    }

    @Put('update/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.updatePositionOK)
    @ApiResponse(docs.updatePositionBAD)
    async updatePosition(@Body() input: UpdatePositionInput, @Param('slug') slug: string, @Req() req): Promise<any> {
        const result: string = await this.positionService.updatePosition(input, req.user.id, req.user.isAdmin, slug);
        return { message: result, success: true };
    }

    @Delete('delete/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.deletePositionOK)
    @ApiResponse(docs.deletePositionNotFound)
    async deletePosition(@Param('slug') positionSlug: string, @Req() req): Promise<any> {
        const result: string = await this.positionService.deletePosition(positionSlug, req);
        return { success: true, message: result };
    }

    @Post('mypositions')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.showMyCompanyPositionsOK)
    async showMyCompanyPositions(@Req() req): Promise<any> {
        const positions: PositionGet[] | null = await this.positionService.showMyCompanyPositions(req);
        return { positions, success: true };
    }

    @Get('company/:slug')
    @HttpCode(200)
    @ApiResponse(docs.allPositionsOfCompanyOK)
    async allPositionsOfCompany(@Param('slug') companySlug: string): Promise<any> {
        const positions: PositionGet[] | null = await this.positionService.allPositionsOfCompany(companySlug);
        return { positions, success: true };
    }

    @Get('search')
    @HttpCode(200)
    @ApiResponse(docs.searchPositionsOK)
    async searchPositions(@Query('query') query: string): Promise<any> {
        const result: PositionGet[] | null | string = await this.positionService.searchPositions(query);
        return { result, success: true };
    }
}