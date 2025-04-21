import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class PostUpdateByIdRequest {
  @Expose()
  @IsString()
  @IsOptional()
  title?: string;

  @Expose()
  @IsString()
  @IsOptional()
  content?: string;

  @Expose()
  @IsString()
  @IsOptional()
  cover_img?: string;
}
