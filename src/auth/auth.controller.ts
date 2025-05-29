import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserLoginInput, UserRegisterInput } from './DTO/auth.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @ApiResponse({
    status: 201,
    example: {
      message: 'user created successfully.',
      success: 'true',
    },
  })
  @ApiResponse({
    status: 400,
    example: {
      message: [
        'minimum length of phone is 12',
        'phone can not be empty',
        'phone must be a string',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post('register')
  @HttpCode(201)
  async Register(@Body() userinput: UserRegisterInput): Promise<any> {
    const result: string = await this.authservice.Register(userinput);
    return { message: result, success: true };
  }

  @ApiResponse({
    status: 200,
    example: {
      message: 'login successfull',
      success: 'true',
    },
  })
  @ApiResponse({
    status: 500,
    example: {
      statusCode: 500,
      message: 'user not found',
    },
  })
  @Post('login')
  async Login(
    @Body() userinput: UserLoginInput,
    @Res() res: Response,
  ): Promise<any> {
    const result: string = await this.authservice.Login(userinput, res);
    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse({
    status: 200,
    example: {
      message: 'access token attached successfully.',
      success: 'true',
    },
  })
  @ApiResponse({
    status: 500,
    example: {
      statusCode: 500,
      message: 'no refresh token found',
    },
  })
  @HttpCode(200)
  @Post('refresh')
  async RefreshJWT(@Req() req, @Res() res): Promise<any> {
    const result: string = await this.authservice.GetRefreshJWT(req, res);

    res.status(200).json({ message: result, success: true });
  }

  @ApiResponse({
    status: 200,
    example: {
        access_token: "<token>",
        refresh_token: "<token>"
    }
  })
  @ApiResponse({
    status: 500,
    example: {
      statusCode: 500,
      message: 'no refresh token found',
    },
  })
  @HttpCode(200)
  @Post('status')
  async AuthStatus(@Req() req): Promise<any> {
    return this.authservice.GetAuthStatus(req);
  }
}