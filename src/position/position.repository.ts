import { HttpException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Company, Position, PrismaClient, User } from "@prisma/client";
import { prismaProvider } from "src/prisma/prisma.provider";
import slugify from "slugify";
import { PositionGet } from "src/types/types";
import { CreatePositionInput, UpdatePositionInput } from "./DTO/position.dto";

@Injectable()
export class PositionRepo{
    constructor(
        @Inject("PRISMA_CLIENT") private readonly prismaService: PrismaClient,
    ) {}

    async FindOnSlug(slug: string): Promise<Position | null> {

        const position: Position | null = await this.prismaService.position.findUnique({ where: { slug: slug }, 
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
                ownerId: true
            }}
        }});
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

    async UpdatePosition(input: UpdatePositionInput, position_slug: string, user_id: number, isAdmin: boolean): Promise<PositionGet | null> {

        const position: Position | null = await this.FindOnSlug(position_slug);
        if (!position) throw new NotFoundException('position not found for update');

        const company: Company | null = await this.prismaService.company.findUnique({ where: { id: position.id } });
        if (!company) throw new NotFoundException('company for position not found to update');

        if (company.ownerId != user_id && isAdmin !== true) throw new HttpException('you are not the owner of this position to update it', 400);

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

    async DeletePosition(slug: string, user_id: number, isAdmin: boolean): Promise<string> {

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
    
        if ((findPosition as any).company.ownerId != user_id && isAdmin !== true) {
          throw new HttpException('you are not the owner', 400)
        }
        
        await this.prismaService.position.delete({ where: { slug: slug }});
    
        return "position deleted successfuly";
    
      }

    async ShowMyCompanyPositions(req): Promise<PositionGet[] | null> {

        const company: Company | null = await this.prismaService.company.findUnique({
            where: {
                ownerId: req.user.id
            }
        });

        if (!company) throw new NotFoundException('company not found');

        const positions: PositionGet[] | null = await this.prismaService.position.findMany({
            where: {
                companyId: company.id
            },
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

        return positions;

    }

    async AllPositionOfCompany(company_slug: string): Promise<PositionGet[] | null> {

        const company: Company | null = await this.prismaService.company.findUnique({
            where: {
                slug: company_slug
            }
        })

        if (!company) throw new NotFoundException('company not found');

        const positions: PositionGet[] | null = await this.prismaService.position.findMany({
            where: {
                companyId: company.id
            },
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
        })

        return positions;
    }

    async SearchPositions(query: string): Promise<PositionGet[] | null | string> {

        const positions: PositionGet[] | null = await this.prismaService.position.findMany({
            where: {
                name: { contains: query, mode: "insensitive" },
            },
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
        if (!positions) throw new HttpException('there is a problem in searching', 500)

        if (positions.length == 0) return "No position found based on your query";

        return positions
    }
}