import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthMeResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from '@common/contracts/auth';
import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import { Serialize } from '@common/decorators/serialize.decorator';
import { clearAuthCookie, setAuthCookie } from '@common/utils';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @Serialize(AuthMeResponse)
  public async me(
    @CurrentUser() user: CurrentUserType,
  ): Promise<AuthMeResponse> {
    return this.authService.me(user.id);
  }

  @Get('logout')
  public async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    clearAuthCookie(res);
    return true;
  }

  @Post('login')
  @Serialize(AuthLoginResponse)
  public async login(
    @Body() body: AuthLoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthLoginResponse> {
    const token = await this.authService.login(body);
    setAuthCookie(res, token);
    return { token };
  }

  @Post('register')
  @Serialize(AuthRegisterResponse)
  public async register(
    @Body() body: AuthRegisterRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthRegisterResponse> {
    const token = await this.authService.register(body);
    setAuthCookie(res, token);
    return { token };
  }
}
