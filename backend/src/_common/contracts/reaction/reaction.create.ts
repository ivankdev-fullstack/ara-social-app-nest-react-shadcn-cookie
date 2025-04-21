import { TargetType } from '@common/interfaces/interfaces';
import { ReactionType } from '@common/interfaces/reaction/reaction.interface';
import { IsEnum, IsString } from 'class-validator';

export class ReactionCreateRequest {
  @IsEnum(ReactionType)
  type: ReactionType;

  @IsString()
  target_id: string;

  @IsEnum(TargetType)
  target_type: TargetType;
}

export type ReactionCreateResponse = 'created' | 'updated' | 'deleted';
