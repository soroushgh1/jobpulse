import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Degree } from "src/enums/enums";

export class CreatePositionInput {

    @ApiProperty()
    @IsNotEmpty({ message: 'position name can not be empty' })
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description can not be empty' })
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "salary can not be empty" })
    salary: string;

    @ApiProperty()
    @IsEnum(Degree, { message: "wrong degree" })
    @IsNotEmpty({ message: "degree can not be empty" })
    degree: string

}

export class UpdatePositionInput {

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    salary: string;

    @ApiProperty()
    degree: string;
}