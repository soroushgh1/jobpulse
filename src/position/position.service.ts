import { HttpException, Injectable } from '@nestjs/common';
import { PositionRepo } from './position.repository';
import { CreatePositionInput } from './DTO/CreatePositionInput.dto';
import { Position } from '@prisma/client';
import { PositionGet } from 'src/types/types';

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
}