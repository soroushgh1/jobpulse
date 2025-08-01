import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { TicketMakeDto } from './DTO/ticket.dto';
import { Ticket } from '@prisma/client';
import { AdminGuard } from 'src/Guards/admin.guard';
import * as docs from "src/docs/ticket.docs";
import { ApiResponse } from '@nestjs/swagger';

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
    ) {}

    @ApiResponse(docs.createTicketCreated)
    @ApiResponse(docs.createTicketBadRequest)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async CreateTicket(
        @Body() input: TicketMakeDto,
        @Req() req,
    ) {
        const result: Record<string, string> = await this.ticketService.CreateTicket(input, req);

        return { slug: result.slug, message: result.message, success: true };
    }

    @ApiResponse(docs.adminViewTicketsOK)
    @Post('alltickets')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, AdminGuard)
    async AdminViewTickets() {

        const result: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketService.AdminViewTickets();

        return { tickets: result, success: true };
    }

    @ApiResponse(docs.userViewTicketOK)
    @ApiResponse(docs.userViewTicketNotFound)
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