import { TargetType } from '../interfaces';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export interface IReaction {
  id: string;
  type: ReactionType;
  target_id: string;
  target_type: TargetType;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}
