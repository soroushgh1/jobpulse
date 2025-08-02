import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketRepo } from './ticket.repository';
import { prismaProvider } from 'src/prisma/prisma.provider';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { redisProvider } from 'src/redis/redis.provider';

@Module({
  imports: [AuthModule],
  providers: [TicketService, TicketRepo, prismaProvider, JwtService, redisProvider],
  controllers: [TicketController]
})
export class TicketModule {}