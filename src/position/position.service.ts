import { HttpException, Injectable } from '@nestjs/common';
import { PositionRepo } from './position.repository';
import { Position } from '@prisma/client';
import { PositionGet } from 'src/types/types';
import { CreatePositionInput, UpdatePositionInput } from './DTO/position.dto';

@Injectable()
export class PositionService {
    constructor(
        private readonly positionRepo: PositionRepo,
    ){}

    async createPosition(input: CreatePositionInput, req): Promise<string> {
         
        const position: Position | null = await this.positionRepo.createPosition(input, req.user.id);
        if (!position) throw new HttpException('there is a problem in creating position', 500);

        return "position created successfully";
    }

    async showOne(slug: string): Promise<PositionGet | null> {   
        const position: PositionGet | null = await this.positionRepo.showOne(slug);
        return position;
    }
    
    async updatePosition(input: UpdatePositionInput, userId: number, isAdmin: boolean, positionSlug: string): Promise<string> {
        const updatedPosition: PositionGet | null = await this.positionRepo.updatePosition(input, positionSlug, userId, isAdmin);
        if (!updatedPosition) throw new HttpException('there is an error in updating position', 400);
        return "position updated successfully";          
    }

    async deletePosition(slug: string, req): Promise<string> {
        const result: string = await this.positionRepo.deletePosition(slug, req.user.id, req.user.isAdmin);
        return result;
    }

    async showMyCompanyPositions(req): Promise<PositionGet[] | null> {
        const positions: PositionGet[] | null = await this.positionRepo.showMyCompanyPositions(req);
        return positions;
    }

    async allPositionsOfCompany(companySlug: string): Promise<PositionGet[] | null> {
        const positions: PositionGet[] | null = await this.positionRepo.allPositionsOfCompany(companySlug);
        return positions;
    }
    
    async searchPositions(query: string): Promise<PositionGet[] | null | string> {
        const result: PositionGet[] | null | string = await this.positionRepo.searchPositions(query);
        return result;
    }
}