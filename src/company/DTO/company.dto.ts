import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator";

export class CompanyRegisterInput {

    @ApiProperty({
        description: "name of company, minimum is 5",
        example: "MyCompany"
    })
    @IsNotEmpty({ message: "name can not be empty" })
    @IsString()
    @MinLength(5, { message: "name min length is 5" })
    name: string;

    @ApiProperty({
        description: "description of company",
        example: "our company is new and good."
    })
    @IsString()
    @IsNotEmpty({ message: "description can not be empty" })
    description: string;

    @ApiProperty({
        description: "array that includes pictures of the company, it should be array, even if there is only one picture",
        example: `["www.google.com/randompicture1", "www.google.com/randompicture2"]`
    })
    @IsArray()
    @IsNotEmpty({ message: "pictures can not be empty" })
    pictures: string[];

    @ApiProperty({
        description: "real address of company",
        example: "iran, tehran, <random street>"
    })
    @IsString()
    @IsNotEmpty({ message: "address can not be empty" })
    address: string;

    @ApiProperty({
        description: "offical phone number of company",
        example: "02112345678"
    })
    @IsString()
    @IsNotEmpty({ message: "phone can not be empty" })
    phone: string;

    @ApiProperty({
        description: "offical email of company",
        example: "example@gmail.com"
    })
    @IsString()
    @IsNotEmpty({ message: "email can not be empty" })
    @IsEmail({}, { message: "email format is invalid" })
    email: string;

} 
export class CompanyUpdateInput {

    @ApiProperty({
        description: "name of company, minimum is 5",
        example: "MyCompany"
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: "description of company",
        example: "our company is new and good."
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "array that includes pictures of the company, it should be array, even if there is only one picture",
        example: `["www.google.com/randompicture1", "www.google.com/randompicture2"]`
    })
    @IsArray()
    pictures: string[];

    @ApiProperty({
        description: "real address of company",
        example: "iran, tehran, <random street>"
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: "offical phone number of company",
        example: "02112345678"
    })
    @IsString()
    phone: string;

    @ApiProperty({
        description: "offical email of company",
        example: "example@gmail.com"
    })
    @IsString()
    @IsEmail({}, { message: "email format is invalid" })
    email: string;
}

export class DenyRequestInput {

    @ApiProperty({
        description: "the reason company rejected job seeker",
        example: "Not enough knowledge"
    })
    @IsString()
    @IsNotEmpty({ message: "deny_reason can not be empty" })
    deny_reason: string;
}