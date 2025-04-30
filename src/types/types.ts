import { Company, Position } from "@prisma/client";

export type CompanyGet = Omit<Company, "ownerId">

export type PositionGet = Omit<Position, "companyId">