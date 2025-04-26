import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type CurrentUserType = DecodedIdToken;

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const req = ctx.switchToHttp().getRequest();
    const user = req?.user;

    if (!user.uid) {
      throw new UnauthorizedException('User not found in request');
    }

    return user;
  },
);
