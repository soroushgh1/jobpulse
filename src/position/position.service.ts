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

        try {
         
            const position: Position | null = await this.positionRepo.CreatePosition(input, req.user.id);
            if (!position) throw new HttpException('there is a problem in creating position', 500);
    
            return "position created successfully";
            
        } catch (err) {
            console.log(err)
            throw new HttpException(err.message, 500);
        }
    }

    async ShowOne(slug: string): Promise<PositionGet | null> {

        try {
            
            const position: PositionGet | null = await this.positionRepo.ShowOne(slug);

            return position;

        } catch (err: any) {
            throw new HttpException(err.message, 500);
        }

    }
    
    async UpdatePosition(input: UpdatePositionInput, user_id, isAdmin: boolean, position_slug): Promise<string> {

        try {
         
            const updatedPosition: PositionGet | null = await this.positionRepo.UpdatePosition(input, position_slug, user_id, isAdmin);

            if (!updatedPosition) throw new HttpException('there is an error in updating position', 400);
    
            return "position updated successfully";          
        } catch (err: any) {
            throw new HttpException(err.message, 400);
        }

    }

    async DeletePosition(slug: string, req): Promise<string> {

        const result: string = await this.positionRepo.DeletePosition(slug, req.user.id, req.user.isAdmin);
    
        return result;
    }

    async ShowMyCompanyPositions(req): Promise<PositionGet[] | null> {

        try {
            
            const positions: PositionGet[] | null = await this.positionRepo.ShowMyCompanyPositions(req);

            return positions;

        } catch (err: any) {
            throw new HttpException(err.message, 400);
        }
    }

    async AllPositionsOfCompany(company_slug: string): Promise<PositionGet[] | null> {

        try {
            
            const positions: PositionGet[] | null = await this.positionRepo.AllPositionOfCompany(company_slug);

            return positions;

        } catch (err: any) {
            throw new HttpException(err.message, 500);
        }
    }
    
    async SearchPositions(query:string): Promise<PositionGet[] | null | string> {
        
        try {
            
            const result: PositionGet[] | null | string = await this.positionRepo.SearchPositions(query);
            
            return result;

        } catch (err) {
            throw err
        }
    }
}