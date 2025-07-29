import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { TicketMakeDto } from './DTO/ticket.dto';
import { JobSeekerGuard } from 'src/Guards/job_seeker.guard';
import { Ticket } from '@prisma/client';

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly tickerService: TicketService,
    ) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async CreateTicket(
        @Body() input: TicketMakeDto,
        @Req() req,
    ) {
        const result: Record<string, string> = await this.tickerService.CreateTicket(input, req);

        return { slug: result.slug, message: result.message };
    }

    @Post(':slug')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, JobSeekerGuard)
    async SeekerViewTicket(
        @Param('slug') slug: string,
        @Req() req,
    ) {

        const result: Omit<Ticket, "userId" | "adminUserId"> = await this.tickerService.SeekerViewTicket(slug, req);

        return { ticket: result, success: true };
    }
    
}