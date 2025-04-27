import { Navbar } from '@/components/Navbar/Navbar';
import { PostItem } from '@/components/PostItem/PostItem';
import { usePost } from '@/hooks/usePost';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const PostPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { post, isLoading } = usePost(params.id!);

  useEffect(() => {
    if (!isLoading && !post) {
      toast.error(
        <>
          Post you are looking for is not found.
          <br />
          Redirecting to the previous page...
        </>,
      );
      const timer = setTimeout(() => {
        navigate(-1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, post, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return null;

  return (
    <>
      <Navbar />
      <div className="post-container">
        <PostItem post={post!} />
      </div>
    </>
  );
};
