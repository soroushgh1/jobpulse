import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AdminLoginInput, AdminRegisterInput, UserLoginInput, UserRegisterInput } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import * as docs from 'src/docs/auth.docs';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

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

  @ApiResponse(docs.findAllOK)
  @HttpCode(200)
  @Post("allusers")
  @UseGuards(AuthGuard, AdminGuard)
  async findAll(): Promise<any> {
    const users: Omit<User, "password">[] = await this.authservice.findAll();

    return { users, success: true };
  }

  @ApiResponse(docs.banUserOK)
  @ApiResponse(docs.banUserBAD)
  @Post("ban/:email")
  @HttpCode(200)
  @UseGuards(AuthGuard, AdminGuard)
  async banUser(@Param('email') email: string): Promise<any> {
    const result: string = await this.authservice.banUser(email);

    return { message: result, success: true };
  }

}