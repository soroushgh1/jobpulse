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
  async register(@Body() userinput: UserRegisterInput): Promise<any> {
    const result: string = await this.authservice.register(userinput);
    return { message: result, success: true };
  }

  @ApiResponse(docs.loginOK)
  @ApiResponse(docs.loginBAD)
  @Post('login')
  async login(
    @Body() userinput: UserLoginInput,
    @Res() res: Response,
  ): Promise<any> {
    const result: string = await this.authservice.login(userinput, res);
    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse(docs.refreshOK)
  @ApiResponse(docs.refreshBAD)
  @HttpCode(200)
  @Post('refresh')
  async refreshJWT(@Req() req, @Res() res): Promise<any> {
    const result: string = await this.authservice.getRefreshJWT(req, res);

    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse(docs.authStatusOK)
  @ApiResponse(docs.authStatusBAD)
  @HttpCode(200)
  @Post('status')
  async authStatus(@Req() req): Promise<any> {
    return this.authservice.getAuthStatus(req);
  }

  @HttpCode(200)
  @Post('logout')
  logOut(
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
  async registerAdmin(@Body() admininput: AdminRegisterInput): Promise<any> {
    const result: string = await this.authservice.RegisterAdmin(admininput);
    return { message: result, success: true };
  }

  @ApiResponse(docs.adminLoginOK)
  @ApiResponse(docs.adminLoginBAD)
  @Post('masterkeyin')
  async loginAdmin(
    @Body() admininput: AdminLoginInput,
    @Res() res: Response,
  ): Promise<any> {
    const result: string = await this.authservice.loginAdmin(admininput, res);
    res.status(200).json({ message: result, success: true });
  }
}