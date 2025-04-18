import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/enums/enums';

export class UserRegisterInput {
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  @MinLength(8, { message: 'minimum length of username is 8' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'phone can not be empty' })
  @MinLength(12, { message: 'minimum length of phone is 12' })
  phone: string;

  @IsEnum(UserRole, { message: "wrong role, role does not exist" })
  @IsNotEmpty({ message: 'role can not be empty' })
  role: UserRole;
}

export class UserLoginInput {
  @IsString()
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({}, { message: 'email format is invalid' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(8, { message: 'minimum length of password is 8' })
  password: string;
}