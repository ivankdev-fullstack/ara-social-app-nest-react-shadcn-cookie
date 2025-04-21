import { JWTPayload } from '@interfaces/auth/auth.interface';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(
    req: Request & { user: { id: string } },
    res: Response,
    next: NextFunction,
  ) {
    const token = req?.cookies['token'];
    if (!token) {
      throw new UnauthorizedException('User token not found');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const decoded = jwt.verify(token, secret!) as JWTPayload;
      req.user = {
        id: decoded.user_id,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    next();
  }
}
