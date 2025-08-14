import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaClient, Ticket } from "@prisma/client";
import { MessageDTO, TicketMakeDto, TicketUpdateDto } from "../dtos/ticket.dto";
import slugify from "slugify";
import Redis from "ioredis";
import { throwError } from "rxjs";

@Injectable()
export class TicketRepo {
    constructor(
        @Inject("PRISMA_CLIENT") private readonly prismaClient: PrismaClient,
        @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    ) {}

    async createTicket(input: TicketMakeDto, req): Promise<Record<string, string>> {
        
        const baseSlug: string = slugify(input.subject, { lower: true });
        let slug: string = baseSlug;
        let counter: number = 0;

        while (await this.prismaClient.ticket.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const ticket: Ticket | null = await this.prismaClient.ticket.create({
            data: {
                slug,
                subject: input.subject,
                description: input.description,
                isAnswered: false,
                userId: req.user.id
            }
        });

        if (!ticket) throw new HttpException('there was a problem while creating your ticket.', 400);

        return { message: "your ticket created successfully.", slug: ticket.slug };
    }

    async userViewTicket(slug: string, req): Promise<Omit<Ticket, "userId" | "adminUserId">> {

        const ticket: Ticket | null = await this.prismaClient.ticket.findUnique({ where: { slug },
        select: {
            slug: true,
            subject: true,
            description: true,
            isAnswered: true,
            id: true,
            messages: {
                select:{
                    reply_to_id: true,
                    text: true,
                    created_at: true,
                    user_id: true,
                    id: true
                }
            },
            userId: true,
            adminUserId: true
        } });

        if (!ticket) throw new NotFoundException('ticket not found');
        if (ticket.userId !== req.user.id && req.user.isAdmin === false) throw new UnauthorizedException('you can not access other people tickets');
        
        return ticket;
    }

    async adminViewTickets(): Promise<Omit<Ticket, "userId" | "adminUserId">[]> {

        const tickets: Omit<Ticket, "userId" | "adminUserId">[] | null = await this.prismaClient.ticket.findMany({
            select: {
                slug: true,
                subject: true,
                description: true,
                isAnswered: true,
                id: true,
                messages: {
                    select:{
                        reply_to_id: true,
                        text: true,
                        created_at: true,
                        user_id: true,
                        id: true
                    }
                },
                adminUserId: true,
                userId: true
            }
        });

        if (!tickets) return [];

        return tickets;
    }

    async adminAttach(req, ticketSlug: string): Promise<string> {

        const findTicket: Ticket | null = await this.prismaClient.ticket.findUnique({ where: { slug: ticketSlug } });

        if (!findTicket) throw new NotFoundException('ticket not found');

        await this.prismaClient.ticket.update({
            where: { slug: ticketSlug },
            data: {
                isAnswered: true,
                adminUserId: req.user.id
            }
        });

        return "ticket attached";
    }

    async sendMessage(input: MessageDTO, ticketSlug: string, req): Promise<string> {

        const findTicket: Ticket | null = await this.prismaClient.ticket.findUnique({ where: { slug: ticketSlug } });

        if (!findTicket) throw new NotFoundException('ticket not found');
        if (findTicket.adminUserId == null) throw new BadRequestException('admins still did not answered this, you cant send a message.')
        if (req.user.id !== findTicket.adminUserId && req.user.id !== findTicket.userId) {
            throw new UnauthorizedException('you are not a part of this conversation');
        }

        let repliedMessage;

        if (input.reply_to_id) {
            repliedMessage = await this.prismaClient.message.findUnique({
                where: { id: input.reply_to_id }
            });

            if (!repliedMessage) throw new NotFoundException('replied message not found');
        }

        await this.prismaClient.$transaction(async (tx) => {

            const message = await tx.message.create({
                data: {
                    ...input,
                    ticket_id: findTicket.id,
                    user_id: req.user.id,
                    created_at: new Date().toISOString(),
                }
            });
            await tx.ticket.update({
                where: { slug: ticketSlug },
                data: {
                    messages: { connect: { id: message.id } }
                }
            });

            if (req.user.id === findTicket.adminUserId) {
                const userNotifsJson: string | null = await this.redisClient.get(`user-${findTicket.userId}-note`);
                if (!userNotifsJson) throw new InternalServerErrorException('there is a problem sending notification, be patient.');

                const userNotes = JSON.parse(userNotifsJson);
                userNotes.push(`new message from admin in the ticket: ${findTicket.subject}`);
                await this.redisClient.set(`user-${findTicket.userId}-note`, JSON.stringify(userNotes));

            } else {
                const adminNotifsJson: string | null = await this.redisClient.get(`user-${findTicket.adminUserId}-note`);
                if (!adminNotifsJson) throw new InternalServerErrorException('there is a problem sending notification, be patient.');

                const adminNotes = JSON.parse(adminNotifsJson);
                adminNotes.push(`new message from user in the ticket: ${findTicket.subject}`);
                await this.redisClient.set(`user-${findTicket.adminUserId}-note`, JSON.stringify(adminNotes));
            }

        });
        return "message sent";
    }

    async myTickets(req): Promise<Omit<Ticket, "userId" | "adminUserId">[]> {

        const tickets: Omit<Ticket, "userId" | "adminUserId">[] | null = await this.prismaClient.ticket.findMany({
            where: {
                OR: [
                    { userId: req.user.id },
                    { adminUserId: req.user.id }
                ]
            },
            select: {
                slug: true,
                subject: true,
                description: true,
                isAnswered: true,
                id: true,
                messages: {
                    select:{
                        reply_to_id: true,
                        text: true,
                        created_at: true,
                        user_id: true,
                        id: true
                    }
                },
            }
        });

        return tickets;
    }

    async deleteTicket(ticketSlug: string, req): Promise<string> {

        const findTicket: Ticket | null = await this.prismaClient.ticket.findUnique({ where: { slug: ticketSlug } });

        if (!findTicket) throw new NotFoundException('ticket not found');
        if (req.user.id !== findTicket.adminUserId && req.user.id !== findTicket.userId) throw new UnauthorizedException('you are not part of this ticket');
        
        await this.prismaClient.ticket.delete({ where: { slug: ticketSlug } });

        return "ticket deleted";
    }

    async updateTicket(input: TicketUpdateDto, ticketSlug: string, req): Promise<string> {

        const findTicket: Ticket | null = await this.prismaClient.ticket.findUnique({ where: { slug: ticketSlug } });

        if (!findTicket) throw new NotFoundException('ticket not found');
        if (req.user.id !== findTicket.adminUserId && req.user.id !== findTicket.userId) throw new UnauthorizedException('you are not part of this ticket');
        if (findTicket.isAnswered === true) throw new BadRequestException('you can not change a ticket when it is already answered');

        await this.prismaClient.ticket.update({
            where: { slug: ticketSlug },
            data: input
        });

        return "ticket updated";
    }

}