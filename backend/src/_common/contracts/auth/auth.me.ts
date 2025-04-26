import { IUser } from '@common/interfaces/user/user.interface';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class AuthMeResponse implements Omit<IUser, 'password'> {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  email: string;

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
