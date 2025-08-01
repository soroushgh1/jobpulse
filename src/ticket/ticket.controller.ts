import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { MessageDTO, TicketMakeDto } from './DTO/ticket.dto';
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

    @ApiResponse(docs.attachTicketOK)
    @ApiResponse(docs.attachTicketBAD)
    @HttpCode(HttpStatus.OK)
    @Post('attach/:slug')
    @UseGuards(AuthGuard, AdminGuard)
    async AdminAttach(
        @Param('slug') ticket_slug: string,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.AdminAttach(req, ticket_slug);

        return { message: result, success: true };
    }

    @ApiResponse(docs.messageOK)
    @ApiResponse(docs.messageBAD)
    @HttpCode(HttpStatus.OK)
    @Post('message/:slug')
    @UseGuards(AuthGuard)
    async SendMessage(
        @Body() input: MessageDTO,
        @Param('slug') ticket_slug: string,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.SendMessage(input, ticket_slug, req);

        return { message: result, success: true };
    }

    @ApiResponse(docs.myTicketsOK)
    @Post('mytickets')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async MyTickets(
        @Req() req
    ): Promise<any> {
        const tickets: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketService.MyTickets(req);

        return { tickets, success: true };
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