import { IUser } from '@common/interfaces/user/user.interface';
import { IPost } from '@interfaces/post/post.interface';
import { v4 as uuidv4 } from 'uuid';

type ConstructorProps = Pick<IPost, 'title' | 'content' | 'user'> & {
  cover_img?: string;
};

export class Post implements IPost {
  static collectionName = 'posts';

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

  constructor({ title, content, user, cover_img }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = uuidv4();
    this.title = title;
    this.content = content;
    this.user = user;
    this.countOf = {
      likes: 0,
      dislikes: 0,
      comments: 0,
    };
    this.cover_img = cover_img ?? null;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
