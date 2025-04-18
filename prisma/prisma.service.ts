import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
class PrismaService extends PrismaClient {
    constructor() {
        super();
    }
}

export default PrismaService;