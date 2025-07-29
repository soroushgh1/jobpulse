import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AuthGuard } from 'src/Guards/auth.guard';
import { TicketMakeDto } from './DTO/ticket.dto';

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
}