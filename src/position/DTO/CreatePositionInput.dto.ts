import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Degree } from "src/enums/enums";

export class CreatePositionInput {

    @IsNotEmpty({ message: 'position can not be empty' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'description can not be empty' })
    @IsString()
    description: string;

    @IsString()
    @IsNotEmpty({ message: "salary can not be empty" })
    salary: string;

    @IsEnum(Degree, { message: "wrong degree" })
    @IsNotEmpty({ message: "degree can not be empty" })
    degree: string

}