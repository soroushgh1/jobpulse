import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtsevice: JwtService,
    private readonly dotenv: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      const request: any = context.switchToHttp().getRequest();

      const secrets = {
        jwtaccess: this.dotenv.get<string>('JWT_ACCESS'),
        jwtrefresh: this.dotenv.get<string>('JWT_REFRESH'),
      };
      
      const accessToken: string = request.cookies['accessToken'];

      if (!accessToken)
        throw new UnauthorizedException('no access token found');

      const payload: object = this.jwtsevice.verify(accessToken, {
        secret: secrets.jwtaccess,
      });

      request.user = payload;
      return true;
  }
}