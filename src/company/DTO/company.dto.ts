import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator";

export class CompanyRegisterInput {

    @ApiProperty()
    @IsNotEmpty({ message: "name can not be empty" })
    @IsString()
    @MinLength(5, { message: "name min length is 5" })
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "description can not be empty" })
    description: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty({ message: "pictures can not be empty" })
    pictures: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "address can not be empty" })
    address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "phone can not be empty" })
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "email can not be empty" })
    @IsEmail({}, { message: "email format is invalid" })
    email: string;

} 
export class CompanyUpdateInput {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsArray()
    pictures: string[];

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    @IsEmail({}, { message: "email format is invalid" })
    email: string;
}

export class DenyRequestInput {

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "deny_reason can not be empty" })
    deny_reason: string;
}