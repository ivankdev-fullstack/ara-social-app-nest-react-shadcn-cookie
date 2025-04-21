import { TargetType } from '@/_common/interfaces';
import { useComments } from '@/hooks/useComments';
import { CommentItem } from '../CommentItem/CommentItem';
import { Button } from '../ui/button';
import { CommentForm } from './CommentForm/CommentForm';

interface Props {
  target_id: string;
  target_type: TargetType;
}

export const CommentsList = ({ target_id, target_type }: Props) => {
  const { comments, isFetching, hasMore, loadMore, isLoading } = useComments(
    target_id,
    target_type,
  );

  return (
    <div className="px-4 py-3">
      <CommentForm target_id={target_id} target_type={target_type} />
      <div className="mx-3 mt-5 flex flex-col gap-0">
        {comments[target_id]?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <Button onClick={loadMore} disabled={isFetching || isLoading}>
            {isFetching || isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};
