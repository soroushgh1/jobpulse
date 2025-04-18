import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserLoginInput, UserRegisterInput } from './DTO/auth.dto';
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

  async Register(userinput: UserRegisterInput): Promise<string> {
    try {
      const isEmailExist: User | null = await this.authrepo.FindOnEmail(
        userinput.email,
      );
      const isPhoneExist: User | null = await this.authrepo.FindOnPhone(
        userinput.phone,
      );

      if (isEmailExist || isPhoneExist)
        throw new HttpException('email or phone is used', 400);

      this.authrepo.CreateUser(userinput);

      return 'user created successfully';
    } catch (err: any) {
      throw new HttpException(err.message, 500);
    }
  }

  async Login(userinput: UserLoginInput, res: Response): Promise<string> {
    try {
      const isExist: User | null = await this.authrepo.FindOnEmail(
        userinput.email,
      );

      if (!isExist) throw new NotFoundException('user not found');

      const isPassMatch: boolean = await bcrypt.compare(
        userinput.password,
        isExist.password,
      );
      if (!isPassMatch)
        throw new UnauthorizedException('password or email is wrong');

      const payload: object = { id: isExist.id, email: isExist.email };

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
    } catch (err: any) {
      throw new HttpException(err.message, 500);
    }
  }

  async GetRefreshJWT(req: any, res: any): Promise<string> {
    try {
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
    } catch (err: any) {
      throw new HttpException(err.message, 500);
    }
  }

  async GetAuthStatus(req: any): Promise<any> {
    try {
      const statusObject: any = { access_token: false, refresh_token: false };

      const accessToken: string = req.cookies['accessToken'];
      const refreshToken: string = req.cookies['refreshToken'];

      if(accessToken) statusObject.access_token = true;
      if(refreshToken) statusObject.refresh_token = true;

      return statusObject;

    } catch (err: any) {
      throw new HttpException(err.message, 400);
    }
  }
}