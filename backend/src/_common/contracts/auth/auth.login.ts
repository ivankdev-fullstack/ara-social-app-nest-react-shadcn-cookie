import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class AuthLoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

@Exclude()
export class AuthLoginResponse {
  @Expose()
  @IsString()
  token: string;
}
