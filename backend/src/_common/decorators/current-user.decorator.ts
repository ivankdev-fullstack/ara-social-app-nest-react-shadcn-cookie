import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export type CurrentUserType = { id: string };

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const req = ctx.switchToHttp().getRequest();
    const user = req?.user;

    console.log(user);

    if (!user?.id) {
      throw new UnauthorizedException('User not found in request');
    }

    return user;
  },
);
