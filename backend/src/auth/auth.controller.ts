import {
  AuthMeResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
} from '@common/contracts/auth';
import {
  CurrentUser,
  CurrentUserType,
} from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/is-public.decorator';
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
    return this.authService.me(user?.uid);
  }

  @Public()
  @Post('register')
  @Serialize(AuthRegisterResponse)
  public async register(
    @Body() body: AuthRegisterRequest,
  ): Promise<AuthRegisterResponse> {
    const token = await this.authService.register(body);
    return { token };
  }

  @Public()
  @Post('register/google')
  @Serialize(AuthRegisterResponse)
  public async googleAuth(
    @Body() body: AuthRegisterRequest & { idToken: string },
  ): Promise<AuthRegisterResponse> {
    const token = await this.authService.googleAuth(body);
    return { token };
  }
}
