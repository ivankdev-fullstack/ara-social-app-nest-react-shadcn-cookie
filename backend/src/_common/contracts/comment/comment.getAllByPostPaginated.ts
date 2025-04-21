import { TargetType } from '@common/interfaces/interfaces';
import { IComment } from '@interfaces/comment/comment.interface';
import { Optional } from '@nestjs/common';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

@Exclude()
export class CommentGetAllByTargetPaginatedRequest {
  @Expose()
  @IsEnum(TargetType)
  target_type: TargetType;

  @Expose()
  @IsString()
  target_id: string;

  @Expose()
  @IsNumber()
  @Optional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  limit: number;

  @Expose()
  @IsString()
  @Optional()
  cursor?: string;
}

@Exclude()
export class CommentGetAllByTargetPaginatedResponse {
  @Expose()
  @IsArray()
  data: IComment[];

  @Expose()
  nextCursor: string | null;
}
