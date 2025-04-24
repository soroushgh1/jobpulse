import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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

    @Put('update/:slug')
    @UseGuards(AuthGuard, CompanyGuard)
    async UpdatePosition(@Body() input: UpdatePositionInput, @Param('slug') slug: string, @Req() req): Promise<any> {

        const result: string = await this.positionService.UpdatePosition(input, req.user.id, slug);

        return { message: result, success: true }
    }
}