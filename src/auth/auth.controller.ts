import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserLoginInput, UserRegisterInput } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authservice: AuthService,
    ) {}

    @Post('register')
    async Register(@Body() userinput: UserRegisterInput): Promise<any> {

        const result: string = await this.authservice.Register(userinput);
        return { message: result, success: true };
    }

    @Post('login')
    async Login(@Body() userinput: UserLoginInput, @Res() res: Response ): Promise<any> {

        const result: string = await this.authservice.Login(userinput, res);
        res.status(200).json({ message: result, success: true });
    }

    @Post('refresh')
    async RefreshJWT(@Req() req, @Res() res): Promise<any> {

        const result: string = await this.authservice.GetRefreshJWT(req, res);

        res.status(200).json({ message: result, success: true });
    }

    @Post('status')
    async AuthStatus(@Req() req): Promise<any> {
        return this.authservice.GetAuthStatus(req);
    }
}