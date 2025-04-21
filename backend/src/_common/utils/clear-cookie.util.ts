import { isProduction } from '@common/config/env';
import { Response } from 'express';

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};
