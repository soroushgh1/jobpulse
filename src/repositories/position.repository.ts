import { HttpException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Company, Position, PrismaClient, User } from "@prisma/client";
import { prismaProvider } from "src/prisma/prisma.provider";
import slugify from "slugify";
import { PositionGet } from "src/types/types";
import { CreatePositionInput, UpdatePositionInput } from "../dtos/position.dto";

@Injectable()
export class PositionRepo {
    constructor(
        @Inject("PRISMA_CLIENT") private readonly prismaService: PrismaClient,
    ) {}

    async findBySlug(slug: string): Promise<Position | null> {

        const position: Position | null = await this.prismaService.position.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                degree: true,
                description: true,
                salary: true,
                slug: true,
                companyId: true,
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                        ownerId: true
                    }
                }
            }
        });
        if (!position) throw new NotFoundException('position not found');

        return position;
    }

    async createPosition(input: CreatePositionInput, userId: number): Promise<Position | null> {

        const baseSlug: string = slugify(input.name, { lower: true });

        let slug: string = baseSlug;
        let counter: number = 1;

        while (await this.prismaService.position.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const company: Company | null = await this.prismaService.company.findUnique({
            where: { ownerId: userId }
        });

        if (!company) throw new NotFoundException('company not found');

        const position: Position | null = await this.prismaService.position.create({
            data: {
                name: input.name,
                description: input.description,
                degree: input.degree,
                salary: input.salary,
                slug,
                companyId: company.id
            }
        });

        return position;
    }

    async showOne(slug: string): Promise<PositionGet | null> {

        const position: PositionGet | null = await this.prismaService.position.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                degree: true,
                description: true,
                salary: true,
                slug: true,
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                    }
                }
            }
        });

        if (!position) throw new NotFoundException('position not found');

        return position;
    }

    async updatePosition(input: UpdatePositionInput, positionSlug: string, userId: number, isAdmin: boolean): Promise<PositionGet | null> {

        const position: Position | null = await this.findBySlug(positionSlug);
        if (!position) throw new NotFoundException('position not found for update');

        const company: Company | null = await this.prismaService.company.findUnique({ where: { id: position.companyId } });
        if (!company) throw new NotFoundException('company for position not found to update');

        if (company.ownerId !== userId && isAdmin !== true) throw new HttpException('you are not the owner of this position to update it', 400);

        if (input.name && position.name !== input.name) {

            const baseSlug: string = slugify(input.name, { lower: true });

            let slug: string = baseSlug;
            let counter: number = 1;

            while (await this.prismaService.position.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }

            (input as any).slug = slug;
        }

        const updatedPosition: PositionGet | null = await this.prismaService.position.update({
            where: {
                slug: positionSlug
            },
            data: input,
            select: {
                id: true,
                name: true,
                degree: true,
                description: true,
                salary: true,
                slug: true,
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                    }
                }
            }
        });

        return updatedPosition;
    }

    async deletePosition(slug: string, userId: number, isAdmin: boolean): Promise<string> {

        const foundPosition: Position | null = await this.prismaService.position.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                degree: true,
                description: true,
                salary: true,
                slug: true,
                companyId: true,
                company: {
                    select: {
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
                    }
                }
            }
        });

        if (!foundPosition) {
            throw new NotFoundException('position not found');
        }

        if ((foundPosition as any).company.ownerId !== userId && isAdmin !== true) {
            throw new HttpException('you are not the owner', 400);
        }

        await this.prismaService.position.delete({ where: { slug } });

        return "position deleted successfully";
    }

    async showMyCompanyPositions(req): Promise<PositionGet[] | null> {

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
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                    }
                }
            }
        });

        return positions;
    }

    async allPositionsOfCompany(companySlug: string): Promise<PositionGet[] | null> {

        const company: Company | null = await this.prismaService.company.findUnique({
            where: {
                slug: companySlug
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
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                    }
                }
            }
        });

        return positions;
    }

    async searchPositions(query: string): Promise<PositionGet[] | null | string> {

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
                company: {
                    select: {
                        address: true,
                        email: true,
                        id: true,
                        slug: true,
                        description: true,
                        phone: true,
                        name: true,
                        pictures: true,
                    }
                }
            }
        });

        if (!positions) throw new HttpException('there is a problem in searching', 500);

        if (positions.length === 0) return "No position found based on your query";

        return positions;
    }
}