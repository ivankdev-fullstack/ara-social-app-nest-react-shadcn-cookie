import { ReactionType, TargetType } from '@/_common/interfaces';

export interface ReactionToggleData {
  type: ReactionType;
  target_id: string;
  target_type: TargetType;
}

export interface ReactionToggleResponse {
  result: 'created' | 'updated' | 'deleted';
}
