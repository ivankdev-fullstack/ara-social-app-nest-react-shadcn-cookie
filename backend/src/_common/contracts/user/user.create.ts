import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UserCreateRequest {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @Expose()
  @IsString()
  @IsOptional()
  phone?: string;
}
