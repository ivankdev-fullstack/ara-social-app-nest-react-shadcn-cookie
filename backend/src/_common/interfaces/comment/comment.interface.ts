import { TargetType } from '../interfaces';
import { IUser } from '../user/user.interface';

export interface IComment {
  id: string;
  content: string;
  user: Pick<IUser, 'id' | 'name' | 'avatar'>;
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
