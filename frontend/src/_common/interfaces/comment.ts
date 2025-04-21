import { ReactionType, TargetType } from './reaction';
import { IUser } from './user';

export interface IComment {
  id: string;
  content: string;
  user: Pick<IUser, 'id' | 'name' | 'avatar'>;
  current_reaction?: ReactionType;
  target_id: string;
  target_type: TargetType;
  countOf: {
    likes: number;
    dislikes: number;
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}
