import { IsArray, IsEmail, IsNotEmpty, IsString, IsUrl, MinLength } from "class-validator";

export class CompanyRegisterInput {

    @IsNotEmpty({ message: "name can not be empty" })
    @IsString()
    @MinLength(5, { message: "name min length is 5" })
    name: string;

    @IsString()
    @IsNotEmpty({ message: "description can not be empty" })
    description: string;

    @IsArray()
    @IsNotEmpty({ message: "pictures can not be empty" })
    pictures: string[];

    @IsString()
    @IsNotEmpty({ message: "address can not be empty" })
    address: string;

    @IsString()
    @IsNotEmpty({ message: "phone can not be empty" })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: "email can not be empty" })
    @IsEmail({}, { message: "email format is invalid" })
    email: string;

} 
export class CompanyUpdateInput {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsArray()
    pictures: string[];

    @IsString()
    address: string;

    @IsString()
    phone: string;

    @IsString()
    @IsEmail({}, { message: "email format is invalid" })
    email: string;
}