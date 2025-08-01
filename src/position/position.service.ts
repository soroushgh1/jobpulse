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

    async CreatePosition(input: CreatePositionInput, req): Promise<string> {
         
            const position: Position | null = await this.positionRepo.CreatePosition(input, req.user.id);
            if (!position) throw new HttpException('there is a problem in creating position', 500);
    
            return "position created successfully";
    }

    async ShowOne(slug: string): Promise<PositionGet | null> {   
            const position: PositionGet | null = await this.positionRepo.ShowOne(slug);

            return position;
    }
    
    async UpdatePosition(input: UpdatePositionInput, user_id, isAdmin: boolean, position_slug): Promise<string> {

            const updatedPosition: PositionGet | null = await this.positionRepo.UpdatePosition(input, position_slug, user_id, isAdmin);

            if (!updatedPosition) throw new HttpException('there is an error in updating position', 400);
    
            return "position updated successfully";          

    }

    async DeletePosition(slug: string, req): Promise<string> {

        const result: string = await this.positionRepo.DeletePosition(slug, req.user.id, req.user.isAdmin);
    
        return result;
    }

    async ShowMyCompanyPositions(req): Promise<PositionGet[] | null> {

            const positions: PositionGet[] | null = await this.positionRepo.ShowMyCompanyPositions(req);

            return positions;
    }

    async AllPositionsOfCompany(company_slug: string): Promise<PositionGet[] | null> {

            const positions: PositionGet[] | null = await this.positionRepo.AllPositionOfCompany(company_slug);

            return positions;
    }
    
    async SearchPositions(query:string): Promise<PositionGet[] | null | string> {
        
            const result: PositionGet[] | null | string = await this.positionRepo.SearchPositions(query);
            
            return result;
    }
}