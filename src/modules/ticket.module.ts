import { Module } from '@nestjs/common';
import { TicketService } from '../services/ticket.service';
import { TicketController } from '../controllers/ticket.controller';
import { TicketRepo } from '../repositories/ticket.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { JwtService } from '@nestjs/jwt';
import { redisProvider } from 'src/redis/redis.provider';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  providers: [TicketService, TicketRepo, prismaProvider, JwtService, redisProvider],
  controllers: [TicketController]
})
export class TicketModule {}