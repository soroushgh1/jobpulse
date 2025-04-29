import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Company, Position, Request } from '@prisma/client';
import PrismaService from 'prisma/prisma.service';
import { CompanyRegisterInput, CompanyUpdateInput } from './DTO/company.dto';
import slugify from 'slugify';
import { CompanyGet } from 'src/types/types';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
            pictures: input.pictures,
            slug: slug,
            ownerId: owner_id,
        },
    });

    return company;

  }

  async UpdateCompany(input: CompanyUpdateInput, company_slug: string, user_id: number): Promise<Company> {

    const isCompanyExist: Company | null = await this.prismaService.company.findUnique({ where: { slug: company_slug }});

    if (!isCompanyExist) throw new HttpException('Company not found', 404);

    if (isCompanyExist.ownerId != user_id) throw new HttpException('You are not the owner', 400);

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

  async DeleteCompany(slug: string, user_id: number): Promise<string> {

    const findCompany: Company | null = await this.prismaService.company.findUnique({ where: { slug: slug }});

    if (!findCompany) {
      throw new NotFoundException('company not found')
    }

    if (findCompany.ownerId != user_id) {
      throw new HttpException('you are not the owner', 400)
    }
    
    await this.prismaService.company.delete({ where: { slug: slug }});

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

  async IsRequestAccepted(status: boolean, request_id: number,req, deny_reason?: string): Promise<string> {

    if (status !== true && !deny_reason) throw new HttpException('internal error', 500);

    const isRequestExist: Request | null = await this.prismaService.request.findUnique({
      where: {
        id: request_id
      }
    });

    const position: Position | null = await this.prismaService.position.findUnique({
      where: {
        id: isRequestExist?.positionId
      }
    })

    const company: Company | null = await this.prismaService.company.findUnique({
      where: {
        id: position?.companyId
      }
    })

    if (!isRequestExist) throw new NotFoundException('request not found');
    if (!position) throw new NotFoundException('position not found');
    if (!company) throw new NotFoundException('company not found');

    if (req.user.id != company.ownerId) throw new UnauthorizedException('you do not have access to answer this request');

    const updateData: any = {};

    if (status == true) updateData.isAccept = true;

    if (status == false) {
      updateData.isAccept = false,
      updateData.denyReason = deny_reason
    };

    await this.prismaService.request.update({
      where: {
        id: request_id
      },
      data: updateData
    })

    return "request answered";
  }

}