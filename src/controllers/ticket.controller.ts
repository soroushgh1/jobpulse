import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { MessageDTO, TicketMakeDto, TicketUpdateDto } from '../dtos/ticket.dto';
import { Ticket } from '@prisma/client';
import { AdminGuard } from 'src/guards/admin.guard';
import * as docs from "src/docs/ticket.docs";
import { ApiResponse } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('ticket')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
    ) {}

    @Throttle({ medium: {} })
    @ApiResponse(docs.createTicketCreated)
    @ApiResponse(docs.createTicketBadRequest)
    @Post('create')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async createTicket(
        @Body() input: TicketMakeDto,
        @Req() req,
    ) {
        const result: Record<string, string> = await this.ticketService.createTicket(input, req);
        return { slug: result.slug, message: result.message, success: true };
    }

    @SkipThrottle({ short: true, medium: true, long: true })
    @ApiResponse(docs.adminViewTicketsOK)
    @Post('alltickets')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, AdminGuard)
    async adminViewTickets() {
        const result: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketService.adminViewTickets();
        return { tickets: result, success: true };
    }

    @SkipThrottle({ short: true, medium: true, long: true })
    @ApiResponse(docs.attachTicketOK)
    @ApiResponse(docs.attachTicketBAD)
    @HttpCode(HttpStatus.OK)
    @Post('attach/:slug')
    @UseGuards(AuthGuard, AdminGuard)
    async adminAttach(
        @Param('slug') ticketSlug: string,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.adminAttach(req, ticketSlug);
        return { message: result, success: true };
    }

    @Throttle({ long: {} }) 
    @ApiResponse(docs.messageOK)
    @ApiResponse(docs.messageBAD)
    @HttpCode(HttpStatus.OK)
    @Post('message/:slug')
    @UseGuards(AuthGuard)
    async sendMessage(
        @Body() input: MessageDTO,
        @Param('slug') ticketSlug: string,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.sendMessage(input, ticketSlug, req);
        return { message: result, success: true };
    }

    @Throttle({ long: {} }) 
    @Post('mytickets')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async myTickets(
        @Req() req
    ): Promise<any> {
        const tickets: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketService.myTickets(req);
        return { tickets, success: true };
    }

    @Throttle({ medium: {} }) 
    @ApiResponse(docs.deleteTicketOK)
    @ApiResponse(docs.deleteTicketBAD)
    @Post('delete/:slug')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async deleteTicket(
        @Param('slug') ticketSlug: string,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.deleteTicket(ticketSlug, req);
        return { success: true, message: result };
    }

    @Throttle({ medium: {} }) 
    @ApiResponse(docs.updateTicketOK)
    @ApiResponse(docs.updateTicketBAD)
    @Put('update/:slug')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async updateTicket(
        @Param('slug') ticketSlug: string,
        @Body() input: TicketUpdateDto,
        @Req() req
    ): Promise<any> {
        const result: string = await this.ticketService.updateTicket(input, ticketSlug, req);
        return { success: true, message: result };
    }

    @Throttle({ long: {} }) 
    @ApiResponse(docs.userViewTicketOK)
    @ApiResponse(docs.userViewTicketNotFound)
    @Post(':slug')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async userViewTicket(
        @Param('slug') slug: string,
        @Req() req,
    ) {
        const result: Omit<Ticket, "userId" | "adminUserId"> = await this.ticketService.userViewTicket(slug, req);
        return { ticket: result, success: true };
    }
}