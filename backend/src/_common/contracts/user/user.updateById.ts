import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UserUpdateByIdRequest {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  email?: string;

  @Expose()
  @IsString()
  @IsOptional()
  avatar?: string;
}
