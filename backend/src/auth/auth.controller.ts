import {
  AuthMeResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from '@common/contracts/auth';
import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import { Serialize } from '@common/decorators/serialize.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('register')
  @Serialize(AuthRegisterResponse)
  public async register(
    @Body() body: AuthRegisterRequest,
  ): Promise<AuthRegisterResponse> {
    const token = await this.authService.register(body);
    return { token };
  }
}
