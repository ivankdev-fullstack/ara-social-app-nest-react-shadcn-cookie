import { IPost } from '@/_common/interfaces/post';

export interface UpdateByIdData {
  id: string;
  body: Pick<IPost, 'title' | 'content'>;
}

export type UpdateByIdResponse = IPost;
