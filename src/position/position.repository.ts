import { Injectable, NotFoundException } from "@nestjs/common";
import { Company, Position, User } from "@prisma/client";
import PrismaService from "prisma/prisma.service";
import { CreatePositionInput } from "./DTO/CreatePositionInput.dto";
import slugify from "slugify";

@Injectable()
export class PositionRepo{
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async FindOnSlug(slug: string): Promise<Position | null> {

        const position: Position | null = await this.prismaService.position.findUnique({ where: { slug: slug }});
        if (!position) throw new NotFoundException('position not found');

        return position;

    }

    async CreatePosition(input: CreatePositionInput, user_id: number): Promise<Position | null> {

        const baseSlug: string = await slugify(input.name, { lower: true });

        let slug: string = baseSlug;
        let counter: number = 1;
      
        while (await this.prismaService.position.findUnique({ where: { slug: slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const company: Company | null = await this.prismaService.company.findUnique({
            where: { ownerId: user_id }
        });

        if (!company) throw new NotFoundException('company not found');

        const position: Position | null = await this.prismaService.position.create({
            data:{
                name: input.name,
                description: input.description,
                degree: input.degree,
                salary: input.salary,
                slug: slug,
                companyId: company.id
            }
        })

        return position;
    }
}