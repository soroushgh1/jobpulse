import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { DenyRequestInput, CompanyRegisterInput, CompanyUpdateInput } from './DTO/company.dto';
import { Company } from '@prisma/client';
import { CompanyGet } from 'src/types/types';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async createCompany(
    inputcreate: CompanyRegisterInput,
    req: any
  ): Promise<string> {
      const ownerid: any = req.user.id;

      const isExistEmail: Company | null = await this.companyRepo.findOnEmail(
        inputcreate.email,
      );
      const isExistPhone: Company | null = await this.companyRepo.findOnPhone(
        inputcreate.phone,
      );

      if (isExistEmail || isExistPhone)
        throw new HttpException('phone or email is used', 400);

      const createdCompany: Company | null =
        await this.companyRepo.createCompany(inputcreate, ownerid);

      if (!createdCompany)
        throw new HttpException('there is a problem in making company', 500);

      return "company created successfully";

  }

  async attachPicture(files: Array<Express.Multer.File>, company_slug: string, req): Promise<string> {
      
      const result: string = await this.companyRepo.attachPicture(files, company_slug, req)

      return result;

  }

  async updateCompany(companyInput: CompanyUpdateInput, company_slug: string, req): Promise<string> {
      
      const updateCompany: Company | null = await this.companyRepo.updateCompany(companyInput, company_slug, req.user.id, req.user.isAdmin);
      if (!updateCompany) throw new HttpException('there was a problem in updating company', 500);

      return "Company updated successfully";

  }

  async deleteCompany(slug: string, req): Promise<string> {

    const result: string = await this.companyRepo.deleteCompany(slug, req.user.id, req.user.isAdmin);

    return result;
  }

  async viewAll(): Promise<CompanyGet[] | null> {
      return this.companyRepo.viewAll()
  }

  async denyRequest(input: DenyRequestInput, request_id: number, req): Promise<string> {
      
      const result: string = await this.companyRepo.isRequestAccepted("rejected", request_id, req, input.deny_reason);

      return result;
  }

  async acceptRequest(request_id: number, req): Promise<string> {

      const result: string = await this.companyRepo.isRequestAccepted("accepted", request_id, req);

      return result;
  }

  async searchCompanies(query: string): Promise<CompanyGet[] | null | string> {

      const result: CompanyGet[] | null | string = await this.companyRepo.searchCompanies(query);

      return result;
  }

  async showMyCompany(req): Promise<CompanyGet | null> {
      
      const myCompany: CompanyGet = await this.companyRepo.showMyCompany(req);

      return myCompany;
  }
  
  async getCompany(slug: string): Promise<any> {
      const company: CompanyGet | null = await this.companyRepo.findOnSlug(slug);

      if (!company) throw new NotFoundException('company not found');

      return company;
  }
  
}