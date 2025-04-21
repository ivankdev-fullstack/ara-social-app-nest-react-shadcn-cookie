import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@Exclude()
export class AuthRegisterRequest {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsString()
  @IsOptional()
  phone?: string;
}

@Exclude()
export class AuthRegisterResponse {
  @Expose()
  @IsString()
  token: string;
}
