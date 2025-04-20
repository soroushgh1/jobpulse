import { IsNotEmpty, IsString } from "class-validator";

export class CreatePositionInput {

    @IsNotEmpty({ message: 'position can not be empty' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'description can not be empty' })
    @IsString()
    description: string;
}