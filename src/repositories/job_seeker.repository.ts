import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PositionRepo } from 'src/repositories/position.repository';
import { Company, Position, PrismaClient, Request, User } from '@prisma/client';
import Redis from 'ioredis';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class JobSeekerRepo {
  constructor(
    private readonly positionRepo: PositionRepo,
    @Inject('PRISMA_CLIENT') private readonly prismaService: PrismaClient,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async makeRequest(
    resumeFile: Express.Multer.File,
    positionSlug: string,
    req,
  ): Promise<Request | null> {
    const findPosition: Position | null = await this.positionRepo.findBySlug(positionSlug);

    const isRequestExist: Request | null = await this.prismaService.request.findFirst({
      where: {
        positionId: findPosition?.id,
        userId: req.user.id,
      },
    });

    if (isRequestExist) throw new HttpException('you already sent a request for this position', 400);

    const makeRequest: Request | null = await this.prismaService.request.create({
      data: {
        resume: 'http://localhost:3000/' + resumeFile.path,
        userId: req.user.id,
        positionId: findPosition?.id as number,
      },
    });

    if (!makeRequest) throw new HttpException('there is a problem in requesting for position', 500);

    return makeRequest;
  }

  async deleteRequest(positionSlug: string, req): Promise<string> {
    const findPosition: Position | null = await this.positionRepo.findBySlug(positionSlug);

    if (!findPosition) throw new NotFoundException('position not found');

    const isRequestExist: Request | null = await this.prismaService.request.findFirst({
      where: {
        positionId: findPosition?.id,
        userId: req.user.id,
      },
    });

    if (!isRequestExist) throw new HttpException('you did not sent a request to this position', 400);

    const noPrefixFile: string[] = isRequestExist.resume.split('http://localhost:3000/');
    const filePath = path.resolve(__dirname, '..', '..', noPrefixFile[1]);
    await fs.unlink(filePath);

    await this.prismaService.request.delete({
      where: {
        id: isRequestExist.id,
      },
    });

    return 'request deleted successfully';
  }

  async showMyRequests(req): Promise<any> {
    const requests: any = await this.prismaService.request.findMany({
      where: {
        userId: req.user.id,
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
            slug: true,
          },
        },
      },
    });

    return requests;
  }

  async showAllRequestsForPosition(positionSlug: string, req): Promise<any> {
    const findPosition: Position | null = await this.positionRepo.findBySlug(positionSlug);

    if (!findPosition) throw new NotFoundException('position not found');

    const findCompany: Company | null = await this.prismaService.company.findUnique({
      where: {
        id: findPosition.companyId,
      },
    });

    if (findCompany?.ownerId !== req.user.id && req.user.isAdmin !== true) {
      throw new UnauthorizedException('you are not the owner of the company for checking the requests');
    }

    const requests: any = await this.prismaService.request.findMany({
      where: {
        positionId: findPosition.id,
        isAccept: 'pending'
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
            slug: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
            phone: true
          }
        }
      },
    });

    return requests;
  }

  async showAllRequests(req): Promise<any> {

    const findCompany: Company | null = await this.prismaService.company.findUnique({
      where: {
        ownerId: req.user.id
      },
    });

    if (!findCompany) throw new NotFoundException('company not found');

    if (findCompany.ownerId !== req.user.id && req.user.isAdmin !== true) {
      throw new UnauthorizedException('you are not the owner of the company for checking the requests');
    }

    const requests: any = await this.prismaService.request.findMany({
      where: {
        position: {
          companyId: findCompany.id
        },
        isAccept: 'pending'
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
            slug: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
            phone: true
          }
        }
      },
    });

    return requests;
  }

  async showAllAcceptedsForPosition(positionSlug: string, req): Promise<any> {
    const findPosition: Position | null = await this.positionRepo.findBySlug(positionSlug);

    if (!findPosition) throw new NotFoundException('position not found');

    const findCompany: Company | null = await this.prismaService.company.findUnique({
      where: {
        id: findPosition?.companyId,
      },
    });

    if (findCompany?.ownerId !== req.user.id && req.user.isAdmin !== true) {
      throw new UnauthorizedException('you are not the owner of the company for checking the requests');
    }

    const requests: any = await this.prismaService.request.findMany({
      where: {
        positionId: findPosition?.id,
        isAccept: 'accepted',
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
            slug: true,
          },
        },
      },
    });

    return requests;
  }

  async showMyNotifications(userId: number): Promise<string[]> {
    const notificationJson: string | null = await this.redisClient.get(`user-${userId}-note`);

    if (!notificationJson) throw new HttpException('trouble in getting notification', 400);

    const notifications: string[] = JSON.parse(notificationJson);

    return notifications;
  }

  async getMe(userId: number, isAdmin: boolean) {

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        phone: true,
        role: true,
        is_banned: true,
        id: true,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    return { ...user, is_admin: isAdmin };
  }

  async deleteNotification(notification_id: number, req): Promise<string> {

    const userNotesJson: string | null = await this.redisClient.get(`user-${req.user.id}-note`);

    if (!userNotesJson) throw new BadRequestException('there is a problem in your notification');

    let userNote: {}[] = JSON.parse(userNotesJson);

    let doesNotifExists: boolean = false;

    userNote.forEach((note: any) => {
      if (note.id == notification_id) doesNotifExists = true
    })

    if (!doesNotifExists) throw new NotFoundException('notification does not exist');

    userNote.filter((note: any) => {
      return note.id != notification_id 
    })

    await this.redisClient.set(`user-${req.user.id}-note`, JSON.stringify(userNote));

    return "delete successful";
  }

}