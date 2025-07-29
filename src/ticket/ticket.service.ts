import { Injectable } from '@nestjs/common';
import { TicketRepo } from './ticket.repository';
import { TicketMakeDto } from './DTO/ticket.dto';
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
}