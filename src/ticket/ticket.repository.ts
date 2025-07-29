import { HttpException, Inject, Injectable } from "@nestjs/common";
import { PrismaClient, Ticket } from "@prisma/client";
import { TicketMakeDto } from "./DTO/ticket.dto";
import slugify from "slugify";

@Injectable()
export class TicketRepo {
    constructor(
        @Inject("PRISMA_CLIENT") private readonly prismaClient: PrismaClient,
    ) {}

    async CreateTicket(input: TicketMakeDto, req): Promise<Record<string, string>> {
        
        const baseSlug: string = slugify(input.subject, { lower: true });
        let slug: string = baseSlug;
        let counter: number = 0;

        while (await this.prismaClient.ticket.findUnique({ where: { slug: slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++
        }

        const ticket: Ticket | null = await this.prismaClient.ticket.create({
            data: {
                slug: slug,
                subject: input.subject,
                description: input.description,
                isAnswered: false,
                userId: req.user.id
            }
        });

        if (!ticket) throw new HttpException('there was a problem while creating your ticket.', 400);

        return { message: "your ticket created successfully.", slug: ticket.slug };
    }
}