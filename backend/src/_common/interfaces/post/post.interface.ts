import { IUser } from '../user/user.interface';

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
  cover_img: string | null;
  createdAt: string;
  updatedAt: string;
}
