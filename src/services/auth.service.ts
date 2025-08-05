import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import { AdminLoginInput, AdminRegisterInput, UserLoginInput, UserRegisterInput } from '../dtos/auth.dto';
import { User } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authrepo: AuthRepository,
    private readonly jwtservice: JwtService,
    private readonly dotenv: ConfigService,
  ) {}

  async register(userinput: UserRegisterInput): Promise<string> {
      const isEmailExist: User | null = await this.authrepo.findOnEmail(
        userinput.email,
      );
      const isPhoneExist: User | null = await this.authrepo.findOnPhone(
        userinput.phone,
      );

      if (isEmailExist || isPhoneExist)
        throw new HttpException('email or phone is used', 400);

      this.authrepo.createUser(userinput);

      return 'user created successfully';
  }

  async login(userinput: UserLoginInput, res: Response): Promise<string> {

      const isExist: User | null = await this.authrepo.findOnEmail(
        userinput.email,
      );

      if (!isExist) throw new NotFoundException('user not found');

      const isPassMatch: boolean = await bcrypt.compare(
        userinput.password,
        isExist.password,
      );
      if (!isPassMatch)
        throw new UnauthorizedException('password or email is wrong');

      const payload: object = { id: isExist.id, email: isExist.email, isAdmin: false };

      const secrets = {
        jwtaccess: this.dotenv.get<string>('JWT_ACCESS'),
        jwtrefresh: this.dotenv.get<string>('JWT_REFRESH'),
      };

      const accessToken: string = this.jwtservice.sign(payload, {
        secret: secrets.jwtaccess,
        expiresIn: '1h',
      });
      const refreshToken: string = this.jwtservice.sign(payload, {
        secret: secrets.jwtrefresh,
        expiresIn: '90d',
      });

      res.cookie('accessToken', accessToken, {
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 7776000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return 'Login was successful';
  }

  async getRefreshJWT(req: any, res: any): Promise<string> {

      const refreshToken: string = req.cookies['refreshToken'];
      if (!refreshToken)
        throw new UnauthorizedException('no refresh token found');

      const secrets = {
        jwtaccess: this.dotenv.get<string>('JWT_ACCESS'),
        jwtrefresh: this.dotenv.get<string>('JWT_REFRESH'),
      };

      const payload = this.jwtservice.verify(refreshToken, {
        secret: secrets.jwtrefresh,
      });

      const newAccessToken: string = this.jwtservice.sign(
        { email: payload.email, id: payload.id },
        { secret: secrets.jwtaccess, expiresIn: '1h' },
      );

      res.cookie('accessToken', newAccessToken, {
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return 'access token attached successfully';
    
  }

  async getAuthStatus(req: any): Promise<any> {
    
      const statusObject: any = { access_token: false, refresh_token: false };

      const accessToken: string = req.cookies['accessToken'];
      const refreshToken: string = req.cookies['refreshToken'];

      if(accessToken) statusObject.access_token = true;
      if(refreshToken) statusObject.refresh_token = true;

      return statusObject;
  }

  async RegisterAdmin(userinput: AdminRegisterInput): Promise<string> {
      
      const isEmailExist: User | null = await this.authrepo.findOnEmail(
        userinput.email,
      );
      const isPhoneExist: User | null = await this.authrepo.findOnPhone(
        userinput.phone,
      );

      if (isEmailExist || isPhoneExist)
        throw new HttpException('email or phone is used', 400);

      if (userinput.adminsecret != process.env.ADMIN_SECRET) 
        throw new HttpException('admin secret wrong', 400);

      this.authrepo.createUser(userinput);

      return "admin created successfully."
  }

  async loginAdmin(input: AdminLoginInput, res: Response): Promise<string> {

      const isEmailExist: User | null = await this.authrepo.findOnEmail(
        input.email,
      );

      if (!isEmailExist)
        throw new NotFoundException('user not found');

      if (input.adminsecret != process.env.ADMIN_SECRET) 
        throw new HttpException('admin secret wrong', 400);

      const isPassMatch: boolean = await bcrypt.compare(
        input.password,
        isEmailExist.password,
      );

      if (!isPassMatch)
        throw new UnauthorizedException('password or email is wrong');

      const payload: object = { id: isEmailExist.id, email: isEmailExist.email, isAdmin: true };

      const secrets = {
        jwtaccess: this.dotenv.get<string>('JWT_ACCESS'),
        jwtrefresh: this.dotenv.get<string>('JWT_REFRESH'),
      };

      const accessToken: string = this.jwtservice.sign(payload, {
        secret: secrets.jwtaccess,
        expiresIn: '1h',
      });
      const refreshToken: string = this.jwtservice.sign(payload, {
        secret: secrets.jwtrefresh,
        expiresIn: '90d',
      });

      res.cookie('accessToken', accessToken, {
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 7776000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return 'Login was successful';
  }
  
}