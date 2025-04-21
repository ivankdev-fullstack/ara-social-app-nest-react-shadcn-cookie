import { TargetType } from '@common/interfaces/interfaces';
import { IUser } from '@common/interfaces/user/user.interface';
import { IComment } from '@interfaces/comment/comment.interface';
import { v4 as uuidv4 } from 'uuid';

type ConstructorProps = Pick<
  IComment,
  'content' | 'user' | 'target_id' | 'target_type'
>;

export class Comment implements IComment {
  static collectionName = 'comments';

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

  constructor({ content, target_id, target_type, user }: ConstructorProps) {
    const now = new Date().toISOString();

    this.id = uuidv4();
    this.content = content;
    this.target_id = target_id;
    this.target_type = target_type;
    this.countOf = {
      likes: 0,
      dislikes: 0,
      comments: 0,
    };
    this.user = user;
    this.createdAt = now;
    this.updatedAt = now;
  }
}
