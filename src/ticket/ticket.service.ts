import { Injectable } from '@nestjs/common';
import { TicketRepo } from './ticket.repository';
import { MessageDTO, TicketMakeDto } from './DTO/ticket.dto';
import { Ticket } from '@prisma/client';

@Injectable()
export class TicketService {

    constructor(
        private readonly ticketRepo: TicketRepo,
    ) {}

    async CreateTicket(input: TicketMakeDto, req): Promise<Record<string, string>> {

        const result: Record<string, string> = await this.ticketRepo.CreateTicket(input, req);

        return result;
    }

    async UserViewTicket(slug: string, req): Promise<Omit<Ticket, "userId" | "adminUserId">> {

        const ticket: Omit<Ticket, "userId" | "adminUserId"> = await this.ticketRepo.UserViewTicket(slug, req);

        return ticket;
    }

    async AdminViewTickets(): Promise<Omit<Ticket, "userId" | "adminUserId">[]> {
        const tickets: Omit<Ticket, "userId" | "adminUserId">[] = await this.ticketRepo.AdminViewTickets();

        return tickets;
    }

    async AdminAttach(req, ticket_slug: string): Promise<string> {
        const result: string = await this.ticketRepo.AdminAttach(req, ticket_slug);

        return result;
    }

    async SendMessage(input: MessageDTO, ticket_slug: string, req): Promise<string> {
        const result: string = await this.ticketRepo.SendMessage(input, ticket_slug, req);

        return result;
    }
    
}