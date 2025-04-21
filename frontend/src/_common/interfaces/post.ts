import { ReactionType } from './reaction';
import { IUser } from './user';

export interface IPost {
  id: string;
  title: string;
  content: string;
  user: Pick<IUser, 'id' | 'name' | 'avatar'>;
  countOf: {
    likes: number;
    dislikes: number;
    comments: number;
  };
  current_reaction?: ReactionType;
  cover_img: string | null;
  createdAt: string;
  updatedAt: string;
}
