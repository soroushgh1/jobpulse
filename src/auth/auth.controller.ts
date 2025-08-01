import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminLoginInput, AdminRegisterInput, UserLoginInput, UserRegisterInput } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import * as docs from 'src/docs/auth.docs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @ApiResponse(docs.registerOK)
  @ApiResponse(docs.registerBAD)
  @Post('register')
  @HttpCode(201)
  async Register(@Body() userinput: UserRegisterInput): Promise<any> {
    const result: string = await this.authservice.Register(userinput);
    return { message: result, success: true };
  }

  @ApiResponse(docs.loginOK)
  @ApiResponse(docs.loginBAD)
  @Post('login')
  async Login(
    @Body() userinput: UserLoginInput,
    @Res() res: Response,
  ): Promise<any> {
    const result: string = await this.authservice.Login(userinput, res);
    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse(docs.refreshOK)
  @ApiResponse(docs.refreshBAD)
  @HttpCode(200)
  @Post('refresh')
  async RefreshJWT(@Req() req, @Res() res): Promise<any> {
    const result: string = await this.authservice.GetRefreshJWT(req, res);

    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse(docs.authStatusOK)
  @ApiResponse(docs.authStatusBAD)
  @HttpCode(200)
  @Post('status')
  async AuthStatus(@Req() req): Promise<any> {
    return this.authservice.GetAuthStatus(req);
  }

  @HttpCode(200)
  @Post('logout')
  LogOut(
    @Res() res: Response
  ): any {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "logout successful", success: true });
  } 

  @ApiResponse(docs.adminRegisterOK)
  @ApiResponse(docs.adminRegisterBAD)
  @Post('masterkeyup')
  @HttpCode(201)
  async RegisterAdmin(@Body() admininput: AdminRegisterInput): Promise<any> {
    const result: string = await this.authservice.RegisterAdmin(admininput);
    return { message: result, success: true };
  }

  @ApiResponse(docs.adminLoginOK)
  @ApiResponse(docs.adminLoginBAD)
  @Post('masterkeyin')
  async LoginAdmin(
    @Body() admininput: AdminLoginInput,
    @Res() res: Response,
  ): Promise<any> {
    const result: string = await this.authservice.LoginAdmin(admininput, res);
    res.status(200).json({ message: result, success: true });
  }
}