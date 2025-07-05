import { BadRequestException, HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PositionRepo } from "src/position/position.repository";
import { Company, Position, PrismaClient, Request } from "@prisma/client";
import Redis from "ioredis";
import * as path from 'path';
import { promises as fs } from 'fs'

@Injectable()
export class JobSeekerRepo{
    constructor(
        private readonly positionRepo: PositionRepo,
        @Inject("PRISMA_CLIENT") private readonly prismaService: PrismaClient,
        @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    ){}

    async MakeRequest(resume_file: Express.Multer.File, position_slug: string, req): Promise<Request | null> {

        const findPosition: Position | null = await this.positionRepo.FindOnSlug(position_slug);

        const isRequestExist: Request | null = await this.prismaService.request.findFirst({
            where: {
                positionId: findPosition?.id,
                userId: req.user.id
            }
        })

        if (isRequestExist) throw new HttpException('you already sent a request for this position', 400);

        const makeRequest: Request | null = await this.prismaService.request.create({ 
            data: {
                resume: "http://localhost:3000/"+resume_file.path,
                userId: req.user.id,
                positionId: (findPosition?.id as number),
            }
        })

        if (!makeRequest) throw new HttpException('there is a problem in requesting for position', 500);

        return makeRequest;
    }
 
    async DeleteRequest(position_slug: string, req): Promise<string> {

        const findPosition: Position | null = await this.positionRepo.FindOnSlug(position_slug);

        const isRequestExist: Request | null = await this.prismaService.request.findFirst({
            where: {
                positionId: findPosition?.id,
                userId: req.user.id
            }
        })

        if (!isRequestExist) throw new HttpException('you did not sent a request to this position', 400);

        let noPrefixFile: string[] = isRequestExist.resume.split("http://localhost:3000/");
        const filePath = path.resolve(__dirname, '..', "..", noPrefixFile[1]);
        await fs.unlink(filePath);
        await this.prismaService.request.delete({ 
            where: {
                id: isRequestExist.id
            }
        })

        return "request deleted successfully";
    }
    
    async ShowMyRequests(req): Promise<any> {

        const requests: any = await this.prismaService.request.findMany({
            where: {
                userId: req.user.id
            },
            select: {
                id: true,
                resume: true,
                isAccept: true,
                denyReason: true,
                position: {
                    select: {
                        id: true,
                        name: true, 
                        slug: true
                    }
                }
            }
        });

        return requests;
    }

    async ShowAllRequestForPosition(position_slug: string, req): Promise<any> {

        const findPosition: Position | null = await this.positionRepo.FindOnSlug(position_slug);

        const findCompany: Company | null = await this.prismaService.company.findUnique({
            where: {
                id: findPosition?.companyId
            }
        })

        if (findCompany?.ownerId != req.user.id && req.user.isAdmin !== true) throw new UnauthorizedException('you are not the owner of the company for checking the requests');

        const requests: any = await this.prismaService.request.findMany({
            where: {
                positionId: findPosition?.id
            },
            select: {
                id: true,
                resume: true,
                isAccept: true,
                denyReason: true,
                position: {
                    select: {
                        id: true,
                        name: true, 
                        slug: true
                    }
                }
            }
        });

        return requests;
    }

    async ShowMyNotification(user_id: number): Promise<string[]> {

        const notificationJson: string | null = await this.redisClient.get(`user-${user_id}-note`);

        if (!notificationJson) throw new HttpException('trouble in getting notification', 400);
        
        const notifications: string[] = await JSON.parse(notificationJson);

        return notifications;
    } 

    async GetMe(userId: number) {
        return await this.prismaService.user.findUnique({
               where: { id: userId },
               select: {
               username: true,
               email: true,
               phone: true
               }
        });
    }
}
