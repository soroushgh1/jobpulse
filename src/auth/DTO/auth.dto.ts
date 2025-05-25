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
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  @MinLength(8, { message: 'minimum length of username is 8' })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'phone can not be empty' })
  @MinLength(12, { message: 'minimum length of phone is 12' })
  phone: string;

  @ApiProperty()
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