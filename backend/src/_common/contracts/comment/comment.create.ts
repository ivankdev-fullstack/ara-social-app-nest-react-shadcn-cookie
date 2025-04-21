import { TargetType } from '@common/interfaces/interfaces';
import { IsEnum, IsString } from 'class-validator';

export class CommentCreateRequest {
  @IsString()
  content: string;

  @IsString()
  target_id: string;

  @IsEnum(TargetType)
  target_type: TargetType;
}
