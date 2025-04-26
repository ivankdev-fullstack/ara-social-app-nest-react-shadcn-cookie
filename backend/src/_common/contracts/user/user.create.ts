import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UserCreateRequest {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
