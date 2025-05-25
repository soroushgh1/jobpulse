import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class MakeRequestInput {

    @ApiProperty()
    @IsNotEmpty({ message: "resume can not be empty" })
    @IsString()
    @IsUrl({}, { message: "resume format is invalid" })
    resume: string;
    
}