import { HttpException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Company, Position, PrismaClient, Request, User } from '@prisma/client';
import { CompanyRegisterInput, CompanyUpdateInput } from './DTO/company.dto';
import slugify from 'slugify';
import { CompanyGet } from 'src/types/types';
import Redis from 'ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { promises as fs } from 'fs'
import * as path from 'path';

@Injectable()
export class CompanyRepository {
  constructor(
    @Inject("PRISMA_CLIENT") private readonly prismaService: PrismaClient,
    @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    private readonly mailService: MailerService,
  ) {}

  async FindOnEmail(email: string): Promise<Company | null> {
    const company: Company | null = await this.prismaService.company.findUnique(
      {
        where: { email: email },
      },
    );

    return company;
  }

  async FindOnPhone(phone: string): Promise<Company | null> {
    const company: Company | null = await this.prismaService.company.findUnique(
      {
        where: { phone: phone },
      },
    );

    return company;
  }

  async FindOnSlug(slug: string): Promise<CompanyGet | null> {

    const company: CompanyGet | null = await this.prismaService.company.findUnique({
      where: { slug: slug },
      select : {
        name: true,
        email: true,
        address: true,
        description: true,
        phone: true,
        pictures: true,
        slug: true,
        positions: true,
        id: true,
      }
    })

    if (!company) throw new NotFoundException('company not found');

    return company;

  }

  async CreateCompany(input: CompanyRegisterInput, owner_id): Promise<Company | null> {

    const baseSlug: string = await slugify(input.name, { lower: true });
    let slug: string = baseSlug;
    let counter = 1;

    while (await this.prismaService.company.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    
    const company: Company | null = await this.prismaService.company.create({
        data: {
            name: input.name,
            email: input.email,
            address: input.address,
            description: input.description,
            phone: input.phone,
            pictures: [],
            slug: slug,
            ownerId: owner_id,
        },
    });

    return company;

  }

  async AttachPicture(files: Array<Express.Multer.File>, company_slug: string, req): Promise<string> {

    const company: Company | null = await this.prismaService.company.findUnique({ where: { slug: company_slug } });

    if (!company) throw new NotFoundException('Company not found');

    if (company.ownerId != req.user.id) throw new UnauthorizedException('you are not the company owner');

    let pictures = new Array;

    files.forEach((file) => { pictures.push("http://localhost:3000/"+file.path) })

    await this.prismaService.company.update({
      where: {
        slug: company_slug
      },
      data: {
        pictures: pictures
      }
    })

    return "Pictures attached successfully";
    
  }

  async UpdateCompany(input: CompanyUpdateInput, company_slug: string, user_id: number, isAdmin: boolean): Promise<Company> {

    const isCompanyExist: Company | null = await this.prismaService.company.findUnique({ where: { slug: company_slug }});

    if (!isCompanyExist) throw new HttpException('Company not found', 404);

    if (isCompanyExist.ownerId != user_id && isAdmin !== true) throw new HttpException('You are not the owner', 400);

    let updateData: any = {
      ...input,
    }

    if (input.name && isCompanyExist.name != input.name) {

      const baseSlug: string = await slugify(input.name, { lower: true });
      let slug: string = baseSlug;
      let counter = 1;
  
      while (await this.prismaService.company.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
      }

      updateData.slug = slug
    }

    let updatedCompany: Company | null = await this.prismaService.company.update({
      where: { slug: company_slug },
      data: updateData
    })

    return updatedCompany;

  }

  async DeleteCompany(slug: string, user_id: number, isAdmin: boolean): Promise<string> {

    const findCompany: Company | null = await this.prismaService.company.findUnique({ where: { slug: slug }});

    if (!findCompany) {
      throw new NotFoundException('company not found')
    }

    if (findCompany.ownerId != user_id && isAdmin !== true) {
      throw new HttpException('you are not the owner', 400)
    }
    
    await this.prismaService.company.delete({ where: { slug: slug }});

    for (let picture of findCompany.pictures) {
      let noPrefixPicture: string[] = picture.split("http://localhost:3000/");
      const filePath = path.resolve(__dirname, '..', "..", noPrefixPicture[1]);
      await fs.unlink(filePath);
    }
    return "company deleted successfuly";

  }

  async ViewAll(): Promise<CompanyGet[] | null> {

    const allCompanies: CompanyGet[] | null = await this.prismaService.company.findMany({
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
    });

    return allCompanies;   

  } 

  async IsRequestAccepted(status: string, request_id: number,req, deny_reason?: string): Promise<string> {

    if (status !== "accepted" && !deny_reason) throw new HttpException('internal error', 500);

    const isRequestExist: Request | null = await this.prismaService.request.findUnique({
      where: {
        id: request_id
      }
    });

    const user: User | null = await this.prismaService.user.findUnique({ where: {
      id: isRequestExist?.id
    }});

    if (!isRequestExist) throw new NotFoundException('request not found');

    const position: Position | null = await this.prismaService.position.findUnique({
      where: {
        id: isRequestExist.positionId
      }
    })

    if (!position) throw new NotFoundException('position not found');

    const company: Company | null = await this.prismaService.company.findUnique({
      where: {
        id: position.companyId
      }
    })

    if (!company) throw new NotFoundException('company not found');

    if (req.user.id != company.ownerId && req.user.isAdmin !== true) throw new UnauthorizedException('you do not have access to answer this request');

    const updateData: any = {};

    if (status == "accepted") { 
      updateData.isAccept = "accepted";
      let userNoteJson: string | null = await this.redisClient.get(`user-${isRequestExist.userId}-note`);

      if (userNoteJson === null) {
        throw new HttpException('there is a problem in sending notification for user', 500);
      }

      let userNote: string[];

      userNote = JSON.parse(userNoteJson);
      
      const notification: string = `your request for ${position.name} has been accepted !`;

      userNote.push(notification);

      const emailMessage: string = `
      <h1> Dear ${user?.username} </h1>
      <br>
      <h2> Your request for ${company.name} has been accepted ! </h2>
      `;

      await this.mailService.sendMail({
        from: 'jobPulse',
        to: user?.email,
        subject: 'Request accepted !',
        text: emailMessage
      });
      
      await this.redisClient.set(`user-${isRequestExist.userId}-note`, JSON.stringify(userNote));
    };

    if (status == "rejected") {
      updateData.isAccept = "rejected",
      updateData.denyReason = deny_reason

      let userNoteJson: string | null = await this.redisClient.get(`user-${isRequestExist.userId}-note`);

      if (userNoteJson === null) {
        throw new HttpException('there is a problem in sending notification for user', 500);
      }

      let userNote: string[];

      userNote = JSON.parse(userNoteJson);
      
      const notification: string = `your request for ${position.name} has been rejected, here is why: ${isRequestExist.denyReason}`;

      userNote.push(notification);

      const emailMessage: string = `
      <h1> Dear ${user?.username} </h1>
      <br>
      <h2> Unfortunately Your request for ${company.name} has been denied. </h2>
      <br>
      <h2> Reason : ${deny_reason} <h1>
      `;

      await this.mailService.sendMail({
        from: 'jobPulse',
        to: user?.email,
        subject: 'Request denied',
        text: emailMessage
      });

      await this.redisClient.set(`user-${isRequestExist.userId}-note`, JSON.stringify(userNote));
    };

    await this.prismaService.request.update({
      where: {
        id: request_id
      },
      data: updateData
    })

    return "request answered";
  }
  async SearchCompanies(query: string): Promise<CompanyGet[] | null | string> {
  
    const companies: CompanyGet[] | null =
      await this.prismaService.company.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: {
          address: true,
          email: true,
          id: true,
          slug: true,
          description: true,
          phone: true,
          name: true,
          pictures: true,
        },
      });

    if (!companies)
      throw new HttpException('there is a problem in searching', 500);

    if (companies.length == 0) return 'No company found based on your query';

    return companies;
  }
  
}