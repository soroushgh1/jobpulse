import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { CompanyRegisterInput, CompanyUpdateInput } from './DTO/company.dto';
import { Company } from '@prisma/client';
import { CompanyGet } from 'src/types/types';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async CreateCompany(
    inputcreate: CompanyRegisterInput,
    req: any,
  ): Promise<string> {
    try {
      const ownerid: any = req.user.id;

      const isExistEmail: Company | null = await this.companyRepo.FindOnEmail(
        inputcreate.email,
      );
      const isExistPhone: Company | null = await this.companyRepo.FindOnPhone(
        inputcreate.phone,
      );

      if (isExistEmail || isExistPhone)
        throw new HttpException('phone or email is used', 400);

      const createdCompany: Company | null =
        await this.companyRepo.CreateCompany(inputcreate, ownerid);

      if (!createdCompany)
        throw new HttpException('there is a problem in making company', 500);

      return "company created successfully";

    } catch (err: any) {
      throw new HttpException(err.message, 400);
    }

  }

  async UpdateCompany(companyInput: CompanyUpdateInput, company_slug: string, req): Promise<string> {

    try {
      
      const updateCompany: Company | null = await this.companyRepo.UpdateCompany(companyInput, company_slug, req.user.id);
      if (!updateCompany) throw new HttpException('there was a problem in updating company', 500);

      return "Company updated successfully";

    } catch (err: any) {
      throw new HttpException(err.message, 500);
    }
  }

  async ShowCompany(slug: string): Promise<CompanyGet | null> {

    try {
      
      const company: Company | null = await this.companyRepo.FindOnSlug(slug);

      if (!company) {
        throw new NotFoundException('company not found')
      }

      const { ownerId, ...finalCompany } = company;

      return finalCompany as CompanyGet | null;
    } catch (err: any) {
      throw new HttpException(err.message, 500)
    }
  }

  async DeleteCompany(slug: string, req): Promise<string> {

    const result: string = await this.companyRepo.DeleteCompany(slug, req.user.id);

    return result;
  }
}