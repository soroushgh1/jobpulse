import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CompanyGuard } from 'src/guards/company.guard';
import { PositionService } from '../services/position.service';
import { PositionGet } from 'src/types/types';
import { CreatePositionInput, UpdatePositionInput } from '../dtos/position.dto';
import * as docs from 'src/docs/position.docs';
import { ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('position')
export class PositionController {
    constructor(
        private readonly positionService: PositionService,
    ){}

    @Throttle({ medium: {} }) 
    @Post('create')
    @HttpCode(201)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.createPositionOK)
    @ApiResponse(docs.createPositionBAD)
    async createPosition(@Body() input: CreatePositionInput, @Req() req): Promise<any> {
        const result: string = await this.positionService.createPosition(input, req);
        return { message: result, success: true };
    }

    @Throttle({ long: {} })
    @Get('get/:slug')
    @HttpCode(200)
    @ApiResponse(docs.showOneOK)
    @ApiResponse(docs.showOneNotFound)
    async showOne(@Param('slug') slug: string): Promise<any> {
        const position: PositionGet | null = await this.positionService.showOne(slug);
        return { position, success: true };
    }

    @Throttle({ medium: {} })
    @Put('update/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.updatePositionOK)
    @ApiResponse(docs.updatePositionBAD)
    async updatePosition(@Body() input: UpdatePositionInput, @Param('slug') slug: string, @Req() req): Promise<any> {
        const result: string = await this.positionService.updatePosition(input, req.user.id, req.user.isAdmin, slug);
        return { message: result, success: true };
    }

    @Throttle({ medium: {} })
    @Delete('delete/:slug')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.deletePositionOK)
    @ApiResponse(docs.deletePositionNotFound)
    async deletePosition(@Param('slug') positionSlug: string, @Req() req): Promise<any> {
        const result: string = await this.positionService.deletePosition(positionSlug, req);
        return { success: true, message: result };
    }

    @Throttle({ long: {} })
    @Post('mypositions')
    @HttpCode(200)
    @UseGuards(AuthGuard, CompanyGuard)
    @ApiResponse(docs.showMyCompanyPositionsOK)
    async showMyCompanyPositions(@Req() req): Promise<any> {
        const positions: PositionGet[] | null = await this.positionService.showMyCompanyPositions(req);
        return { positions, success: true };
    }

    @Throttle({ long: {} })
    @Get('company/:slug')
    @HttpCode(200)
    @ApiResponse(docs.allPositionsOfCompanyOK)
    async allPositionsOfCompany(@Param('slug') companySlug: string): Promise<any> {
        const positions: PositionGet[] | null = await this.positionService.allPositionsOfCompany(companySlug);
        return { positions, success: true };
    }

    @Throttle({ long: {} })
    @Get('search')
    @HttpCode(200)
    @ApiResponse(docs.searchPositionsOK)
    async searchPositions(@Query('query') query: string): Promise<any> {
        const result: PositionGet[] | null | string = await this.positionService.searchPositions(query);
        return { result, success: true };
    }

    @Throttle({ long: {} })
    @Get('allpositions')
    @HttpCode(200)
    @ApiResponse(docs.searchPositionsOK)
    async allPositions(): Promise<any> {
        const result: PositionGet[] = await this.positionService.allPositions();
        return { result, success: true };
    }
}