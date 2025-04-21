import { TargetType } from '@/_common/interfaces';
import { useLazyGetAllPaginatedQuery } from '@/store/api/comment.api';
import {
  appendComments,
  setCursor,
  setHasMore,
  setLoading,
} from '@/store/slices/comment.slice';
import { RootState } from '@/store/store';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useComments = (target_id: string, target_type: TargetType) => {
  const dispatch = useDispatch();
  const [trigger, { isFetching }] = useLazyGetAllPaginatedQuery();
  const comments = useSelector((state: RootState) => state.comments.comments);
  const { cursor, hasMore, isLoading } = useSelector(
    (state: RootState) =>
      state.comments.meta[target_id] || {
        cursor: null,
        hasMore: true,
        isLoading: false,
      },
  );

  const loadMore = useCallback(async () => {
    dispatch(setLoading({ target_id, isLoading: true }));

    const { data } = await trigger({
      params: { target_id, target_type },
      query: { limit: 1, cursor },
    });

    if (data) {
      dispatch(appendComments({ target_id, data: data.data }));
      dispatch(setCursor({ target_id, cursor: data.nextCursor }));
      dispatch(setHasMore({ target_id, hasMore: !!data.nextCursor }));
    }

    dispatch(setLoading({ target_id, isLoading: false }));
  }, [trigger, target_id, target_type, cursor, dispatch]);

  useEffect(() => {
    if (!comments[target_id]?.length && !isLoading) {
      loadMore();
    }
  }, [target_id, comments, isLoading, loadMore]);

  return {
    comments,
    isFetching,
    hasMore,
    loadMore,
    isLoading,
  };
};
