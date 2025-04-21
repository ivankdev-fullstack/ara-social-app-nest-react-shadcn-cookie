import { usePosts } from '@/hooks/usePosts';
import { useCallback, useEffect, useRef } from 'react';
import { PostItem } from '../PostItem/PostItem';

interface Props {
  user_id?: string;
}

export const PostsList = ({ user_id }: Props) => {
  const { posts, isLoading, isFetching, hasMore } = usePosts(user_id);
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isFetching) {
        return;
      }
    },
    [hasMore, isFetching],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    const el = loaderRef.current;
    if (el) {
      observer.observe(el);
      return () => observer.unobserve(el);
    }

    return;
  }, [handleObserver]);

  return (
    <>
      <div className="post-container">
        <div className="mt-5 flex flex-col gap-3">
          {posts?.map((post) => <PostItem key={post.id} post={post} />)}
          {!posts?.length && <span className="text-center">No posts.</span>}
        </div>
      </div>
      {isLoading && <p className="mt-4 text-center">Loading...</p>}
      <div ref={loaderRef} className="h-10" />
    </>
  );
};
