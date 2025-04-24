import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { Company, Position, User } from "@prisma/client";
import PrismaService from "prisma/prisma.service";
import slugify from "slugify";
import { PositionGet } from "src/types/types";
import { CreatePositionInput, UpdatePositionInput } from "./DTO/position.dto";

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

    async ShowOne(slug: string): Promise<PositionGet | null> {

        const position: PositionGet | null = await this.prismaService.position.findUnique({ where: {slug: slug}, select: {
            id: true,
            name: true,
            degree: true,
            description: true,
            salary: true,
            slug: true,
            company: { select: { 
                address: true,
                email: true,
                id: true, 
                slug: true, 
                description: true, 
                phone: true,
                name: true,
                pictures: true,
            }}

        } })

        if (!position) throw new NotFoundException('position not found');

        return position;
    }

    async UpdatePosition(input: UpdatePositionInput, position_slug: string, user_id: number): Promise<PositionGet | null> {

        const position: Position | null = await this.FindOnSlug(position_slug);
        if (!position) throw new NotFoundException('position not found for update');

        const company: Company | null = await this.prismaService.company.findUnique({ where: { id: position.id } });
        if (!company) throw new NotFoundException('company for position not found to update');

        if (company.ownerId != user_id) throw new HttpException('you are not the owner of this position to update it', 400);

        if (input.name && position.name != input.name) {

            const baseSlug: string = await slugify(input.name, { lower: true });

            let slug: string = baseSlug;
            let counter: number = 1;
          
            while (await this.prismaService.position.findUnique({ where: { slug: slug } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            (input as any).slug = slug
        }

        const updatedPosition: PositionGet | null = await this.prismaService.position.update({
            where: {
                slug: position_slug
            },
            data: input,
            select: {
            id: true,
            name: true,
            degree: true,
            description: true,
            salary: true,
            slug: true,
            company: { select: { 
                address: true,
                email: true,
                id: true, 
                slug: true, 
                description: true, 
                phone: true,
                name: true,
                pictures: true,
            }}
            }
        });

        return updatedPosition;
    }

    async DeletePosition(slug: string, user_id: number): Promise<string> {

        const findPosition: Position | null = await this.prismaService.position.findUnique({ where: { slug: slug }, 
        select: { 
            id: true,
            name: true,
            degree: true,
            description: true,
            salary: true,
            slug: true,
            companyId: true,
            company: { select: { 
                address: true,
                email: true,
                id: true, 
                slug: true, 
                description: true, 
                phone: true,
                name: true,
                pictures: true,
                ownerId: true,
                owner: true
            }}
        }});
    
        if (!findPosition) {
          throw new NotFoundException('position not found')
        }
    
        if ((findPosition as any).company.ownerId != user_id) {
          throw new HttpException('you are not the owner', 400)
        }
        
        await this.prismaService.position.delete({ where: { slug: slug }});
    
        return "position deleted successfuly";
    
      }
}