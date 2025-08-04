import { HttpCode, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { DenyRequestInput, CompanyRegisterInput, CompanyUpdateInput } from './DTO/company.dto';
import { Company } from '@prisma/client';
import { CompanyGet } from 'src/types/types';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async CreateCompany(
    inputcreate: CompanyRegisterInput,
    req: any
  ): Promise<string> {
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

  }

  async AttachPicture(files: Array<Express.Multer.File>, company_slug: string, req): Promise<string> {
      
      const result: string = await this.companyRepo.AttachPicture(files, company_slug, req)

      return result;

  }

  async UpdateCompany(companyInput: CompanyUpdateInput, company_slug: string, req): Promise<string> {
      
      const updateCompany: Company | null = await this.companyRepo.UpdateCompany(companyInput, company_slug, req.user.id, req.user.isAdmin);
      if (!updateCompany) throw new HttpException('there was a problem in updating company', 500);

      return "Company updated successfully";

  }

  async ShowCompany(slug: string): Promise<CompanyGet | null> {
      
      const company: CompanyGet | null = await this.companyRepo.FindOnSlug(slug);

      if (!company) {
        throw new NotFoundException('company not found')
      }

      return company;
  }

  async DeleteCompany(slug: string, req): Promise<string> {

    const result: string = await this.companyRepo.DeleteCompany(slug, req.user.id, req.user.isAdmin);

    return result;
  }

  async ViewAll(): Promise<CompanyGet[] | null> {
      return this.companyRepo.ViewAll()
  }

  async DenyRequest(input: DenyRequestInput, request_id: number, req): Promise<string> {
      
      const result: string = await this.companyRepo.IsRequestAccepted("rejected", request_id, req, input.deny_reason);

      return result;
  }

  async AcceptRequest(request_id: number, req): Promise<string> {

      const result: string = await this.companyRepo.IsRequestAccepted("accepted", request_id, req);

      return result;
  }

  async SearchCompanies(query: string): Promise<CompanyGet[] | null | string> {

      const result: CompanyGet[] | null | string = await this.companyRepo.SearchCompanies(query);

      return result;
  }

  async ShowMyCompany(req): Promise<CompanyGet | null> {
      
      const myCompany: CompanyGet = await this.companyRepo.ShowMyCompany(req);

      return myCompany;
  }
  
  async GetCompany(slug: string): Promise<any> {
      const company: CompanyGet | null = await this.companyRepo.FindOnSlug(slug);

      if (!company) throw new NotFoundException('company not found');

      return company;
  }
  
}