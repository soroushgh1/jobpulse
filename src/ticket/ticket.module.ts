import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketRepo } from './ticket.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TicketService, TicketRepo, prismaProvider, JwtService],
  controllers: [TicketController]
})
export class TicketModule {}
