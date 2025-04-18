import { Company } from "@prisma/client";

export type CompanyGet = Omit<Company, 'ownerId'>