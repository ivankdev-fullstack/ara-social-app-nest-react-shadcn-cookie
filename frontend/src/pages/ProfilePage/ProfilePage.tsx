import { Navbar } from '@/components/Navbar/Navbar';
import { PostForm } from '@/components/PostForm/PostForm';
import { PostsList } from '@/components/PostsList/PostsList';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useGetByIdQuery } from '@/store/api/user.api';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user: curUser } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetByIdQuery({ id: params.id! });
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    navigate(-1);
    toast.error('User not found.');
    return;
  }

  return (
    <>
      <Navbar />
      <div className="post-container">
        <div className="mt-5 flex flex-col">
          <div className="mx-3 flex flex-col items-center justify-center rounded-md border-1 border-gray-200 p-4">
            <div className="h-[80px] w-[80px]">
              <img
                src={user.avatar}
                className="h-full w-full rounded-full object-cover"
                alt="avatar"
              />
            </div>
            <span className="my-1 mb-3 text-lg font-medium">{user.name}</span>
            <div>
              <span>Contact Information:</span>
              <div className="gap-.5 flex flex-col items-center text-sm text-gray-600 italic">
                <span>Email: {user.email}</span>
              </div>
            </div>
          </div>
          <div className="mx-4 mt-5 flex items-center justify-between">
            {curUser?.id === user.id ? (
              <>
                <span className="text-2xl font-bold">My posts:</span>
                <Button onClick={() => setIsFormOpen(true)}>Add Post</Button>
              </>
            ) : (
              <span className="text-2xl font-bold">{user.name}'s posts</span>
            )}
          </div>

          {isFormOpen && <PostForm setIsFormOpen={setIsFormOpen} />}
          <PostsList user_id={user.id} />
        </div>
      </div>
    </>
  );
};
