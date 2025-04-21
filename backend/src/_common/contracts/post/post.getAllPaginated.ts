import { IPost } from '@interfaces/post/post.interface';
import { Exclude, Expose } from 'class-transformer';
import { IsArray } from 'class-validator';

@Exclude()
export class PostGetAllPaginatedResponse {
  @Expose()
  @IsArray()
  data: IPost[];

  @Expose()
  nextCursor: string | null;
}
