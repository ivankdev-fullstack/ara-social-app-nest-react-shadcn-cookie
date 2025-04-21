import { IUser } from '@common/interfaces/user/user.interface';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class AuthMeResponse implements Omit<IUser, 'password'> {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  @IsOptional()
  phone?: string | null;

  @Expose()
  @IsString()
  avatar: string;

  @Expose()
  @IsString()
  createdAt: string;

  @Expose()
  @IsString()
  updatedAt: string;
}
