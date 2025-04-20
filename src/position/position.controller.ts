import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/Guards/auth.guard';
import { CompanyGuard } from 'src/Guards/company.guard';
import { CreatePositionInput } from './DTO/CreatePositionInput.dto';
import { PositionService } from './position.service';
import { Position } from '@prisma/client';
import { PositionGet } from 'src/types/types';

@Controller('position')
export class PositionController {
    constructor(
        private readonly positionService: PositionService,
    ){}

    @Post('create')
    @UseGuards(AuthGuard, CompanyGuard)
    async CreatePosition(@Body() input: CreatePositionInput, @Req() req): Promise<any> {
        
        const result: string = await this.positionService.CreatePosition(input, req)

        return { message: result, success: true };
    }

    @Get(':slug')
    async ShowOne(@Param('slug') slug: string): Promise<any> {
        
        const position: PositionGet | null = await this.positionService.ShowOne(slug);

        return { position: position, success: true };
    }
}