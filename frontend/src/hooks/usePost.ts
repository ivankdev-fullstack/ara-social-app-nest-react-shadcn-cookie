import { useGetByIdQuery } from '@/store/api/post.api';
import { setCursor, setHasMore, setPosts } from '@/store/slices/post.slice';
import { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const usePost = (post_id: string) => {
  const dispatch = useDispatch();
  const { posts, cursor, hasMore, isLoading } = useSelector(
    (state: RootState) => state.posts,
  );

  const { data, isFetching } = useGetByIdQuery({ id: post_id });

  useEffect(() => {
    if (!data) return;

    dispatch(setPosts([data]));
    dispatch(setCursor(null));
    dispatch(setHasMore(false));
  }, [data]);

  return {
    post: posts[0],
    isLoading,
    isFetching,
    hasMore,
    cursor,
  };
};
