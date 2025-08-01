import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

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

export class MessageDTO {

    @ApiProperty()
    @IsNotEmpty({ message: 'text can not be empty' })
    @IsString()
    @Length(10, 1000)
    text: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    reply_to_id?: number;
}