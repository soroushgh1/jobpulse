import { Injectable } from '@nestjs/common';
import { TicketRepo } from '../repositories/ticket.repository';
import { MessageDTO, TicketMakeDto, TicketUpdateDto } from '../dtos/ticket.dto';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketService {

    constructor(
        private readonly ticketRepo: TicketRepo,
    ) {}

    async createTicket(input: TicketMakeDto, req): Promise<Record<string, string>> {
        const result: Record<string, string> = await this.ticketRepo.createTicket(input, req);
        return result;
    }

    async userViewTicket(slug: string, req): Promise<Omit<Ticket, "userId" | "adminUserId">> {
        const ticket: Omit<Ticket, "userId" | "adminUserId"> = await this.ticketRepo.userViewTicket(slug, req);
        return ticket;
    }

    async adminViewTickets(): Promise<Omit<Ticket, "userId" | "adminUserId">[]> {
        const tickets: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketRepo.adminViewTickets();
        return tickets;
    }

    async adminAttach(req, ticketSlug: string): Promise<string> {
        const result: string = await this.ticketRepo.adminAttach(req, ticketSlug);
        return result;
    }

    async sendMessage(input: MessageDTO, ticketSlug: string, req): Promise<string> {
        const result: string = await this.ticketRepo.sendMessage(input, ticketSlug, req);
        return result;
    }

    async myTickets(req): Promise<Omit<Ticket, "userId" | "adminUserId">[]> {
        const tickets: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketRepo.myTickets(req);
        return tickets;
    }

    async deleteTicket(ticketSlug: string, req): Promise<string> {
        const result: string = await this.ticketRepo.deleteTicket(ticketSlug, req);
        return result;
    }

    async updateTicket(input: TicketUpdateDto, ticketSlug: string, req): Promise<string> {
        const result: string = await this.ticketRepo.updateTicket(input, ticketSlug, req);
        return result;
    }
}