import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class MakeRequestInput {

    @IsNotEmpty({ message: "resume can not be empty" })
    @IsString()
    @IsUrl({}, { message: "resume format is invalid" })
    resume: string;
    
}