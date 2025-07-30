import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { TicketMakeDto } from './DTO/ticket.dto';
import { Ticket } from '@prisma/client';
import { AdminGuard } from 'src/Guards/admin.guard';

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
    ) {}

    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async CreateTicket(
        @Body() input: TicketMakeDto,
        @Req() req,
    ) {
        const result: Record<string, string> = await this.ticketService.CreateTicket(input, req);

        return { slug: result.slug, message: result.message };
    }

    @Post('alltickets')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, AdminGuard)
    async AdminViewTickets() {

        const result: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketService.AdminViewTickets();

        return { tickets: result, success: true };
    }

    @Post(':slug')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async UserViewTicket(
        @Param('slug') slug: string,
        @Req() req,
    ) {

        const result: Omit<Ticket, "userId" | "adminUserId"> = await this.ticketService.UserViewTicket(slug, req);

        return { ticket: result, success: true };
    }
}