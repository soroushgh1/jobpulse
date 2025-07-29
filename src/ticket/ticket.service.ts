import { Injectable } from '@nestjs/common';
import { TicketRepo } from './ticket.repository';
import { TicketMakeDto } from './DTO/ticket.dto';

@Injectable()
export class TicketService {

    constructor(
        private readonly ticketRepo: TicketRepo,
    ) {}

    async CreateTicket(input: TicketMakeDto, req): Promise<Record<string, string>> {

        const result: Record<string, string> = await this.ticketRepo.CreateTicket(input, req);

        return result;
    }

}