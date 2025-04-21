import { TargetType } from '@/_common/interfaces';
import { IComment } from '@/_common/interfaces/comment';

export interface CommentGetAllByTargetData {
  params: {
    target_id: string;
    target_type: TargetType;
  };
  query: {
    cursor?: string | null;
    limit?: number;
  };
}

export interface CommentGetAllByTargetResponse {
  data: IComment[];
  nextCursor: string | null;
}
