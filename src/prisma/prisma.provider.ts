import { Provider } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

export const prismaProvider: Provider = {
    provide: "PRISMA_CLIENT",
    useFactory: () => {
        const prisma = new PrismaClient();
        return prisma;
    }
}