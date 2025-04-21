import { useGetAllPaginatedQuery } from '@/store/api/post.api';
import {
  appendPosts,
  setCursor,
  setHasMore,
  setLoading,
} from '@/store/slices/post.slice';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePosts = (user_id?: string) => {
  const dispatch = useDispatch();
  const { posts, cursor, hasMore, isLoading } = useSelector(
    (state: RootState) => state.posts,
  );

  const { data, isFetching } = useGetAllPaginatedQuery(
    { limit: 1, cursor, user_id },
    { skip: !hasMore },
  );

  useEffect(() => {
    dispatch(setLoading(isFetching));
  }, [isFetching]);

  useEffect(() => {
    if (!data?.data) return;

    dispatch(appendPosts(data.data));
    dispatch(setCursor(data.nextCursor));
    dispatch(setHasMore(data.nextCursor !== null));
  }, [data]);

  return {
    posts,
    isLoading,
    isFetching,
    hasMore,
    cursor,
  };
};
