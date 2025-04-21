import { IPost } from '@/_common/interfaces/post';

export interface getAllPaginatedData {
  limit?: number;
  cursor?: string | null;
  user_id?: string;
}

export interface getAllPaginatedResponse {
  data: IPost[];
  nextCursor: string | null;
}
