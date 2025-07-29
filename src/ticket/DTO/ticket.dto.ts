import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class TicketMakeDto {
    
    @ApiProperty()
    @IsNotEmpty({ message: 'subject can not be empty' })
    @IsString()
    @Length(10, 100)
    subject: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description can not be empty' })
    @IsString()
    @Length(10, 500)
    description: string;
}