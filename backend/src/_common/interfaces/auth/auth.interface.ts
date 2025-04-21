import * as jwt from 'jsonwebtoken';

export interface JWTPayload extends jwt.JwtPayload {
  user_id: string;
}
