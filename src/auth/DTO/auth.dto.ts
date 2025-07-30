import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/enums/enums';

export class UserRegisterInput {
  @ApiProperty({
    example: "example@gmail.com"
  })
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @ApiProperty({
    example: "example1234"
  })
  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  @MinLength(8, { message: 'minimum length of username is 8' })
  username: string;

  @ApiProperty({
    description: `minimum length of password is 8`,
    example: "@#Example11232#@%$"
  })
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;

  @ApiProperty({
    description: `minimum length of phone is 11`,
    example: "09123456789"
  })
  @IsString()
  @IsNotEmpty({ message: 'phone can not be empty' })
  @MinLength(12, { message: 'minimum length of phone is 12' })
  phone: string;

  @ApiProperty({
    description: `the role is an enum:
    job_seeker or company,`,
    example: "job_seeker"
  })
  @IsEnum(UserRole, { message: "wrong role, role does not exist" })
  @IsNotEmpty({ message: 'role can not be empty' })
  role: UserRole;
}

export class UserLoginInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;
}

export class AdminRegisterInput {
  @ApiProperty({
    example: "example@gmail.com"
  })
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @ApiProperty({
    example: "example1234"
  })
  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  @MinLength(8, { message: 'minimum length of username is 8' })
  username: string;

  @ApiProperty({
    description: `minimum length of password is 8`,
    example: "@#Example11232#@%$"
  })
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;

  @ApiProperty({
    description: `minimum length of phone is 11`,
    example: "09123456789"
  })
  @IsString()
  @IsNotEmpty({ message: 'phone can not be empty' })
  @MinLength(12, { message: 'minimum length of phone is 12' })
  phone: string;

  @ApiProperty({
    description: `the role is an enum:
    job_seeker or company,`,
    example: "job_seeker"
  })
  @IsEnum(UserRole, { message: "wrong role, role does not exist" })
  @IsNotEmpty({ message: 'role can not be empty' })
  role: UserRole;

  @ApiProperty({
    description: `required secret for admin route`
  })
  @IsString()
  @IsNotEmpty({ message: 'admin secret cannot be empty' })
  adminsecret: string;
}

export class AdminLoginInput {

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;

  @ApiProperty({
    description: `required secret for admin route`
  })
  @IsString()
  @IsNotEmpty({ message: 'admin secret cannot be empty' })
  adminsecret: string;
  
}