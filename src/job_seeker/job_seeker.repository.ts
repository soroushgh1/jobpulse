import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PositionRepo } from "src/position/position.repository";
import { MakeRequestInput } from "./DTO/job_seeker.dto";
import { Position, Request } from "@prisma/client";
import PrismaService from "prisma/prisma.service";

@Injectable()
export class JobSeekerRepo{
    constructor(
        private readonly positionRepo: PositionRepo,
        private readonly prismaService: PrismaService,
    ){}

    async MakeRequest(input: MakeRequestInput, position_slug: string, req): Promise<Request | null> {

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
                resume: input.resume,
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
}