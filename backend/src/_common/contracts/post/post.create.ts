import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class PostCreateRequest {
  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsString()
  @IsOptional()
  cover_img?: string;
}
