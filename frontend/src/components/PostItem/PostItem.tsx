import { IPost } from '@/_common/interfaces/post';
import { getTimeAgoShort } from '@/_common/utils/getTimeAgo';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommentsList } from '../CommentsList/CommentsList';
import { PostActions } from './components/PostActions/PostActions';
import { PostEditForm } from './components/PostEditForm/PostEditForm';
import { PostOptions } from './components/PostOptions/PostOptions';

interface Props {
  post: IPost;
}

export const PostItem = ({ post }: Props) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);
  const [isCommentsListOpen, setIsCommentsListOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const redirectToAuthorsPage = () => {
    navigate(`/profile/${post.user.id}`);
  };

  return (
    <Card className="relative gap-0 overflow-hidden rounded-2xl border border-gray-200 p-0 shadow-sm">
      {!isEditFormOpen && (
        <PostOptions post={post} setIsEditFormOpen={setIsEditFormOpen} />
      )}
      <CardHeader className="p-4 pb-2">
        <div
          className="flex items-center justify-between hover:cursor-pointer"
          onClick={redirectToAuthorsPage}
        >
          <div className="flex items-center gap-3">
            <div className="h-[40px] w-[40px]">
              <img
                src={post.user.avatar}
                className="h-full w-full rounded-full object-cover"
                alt="avatar"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{post.user.name}</span>
              <span className="text-muted-foreground text-xs">
                {getTimeAgoShort(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        {isEditFormOpen ? (
          <PostEditForm
            id={post.id}
            title={post.title}
            content={post.content}
            setIsEditFormOpen={setIsEditFormOpen}
          />
        ) : (
          <>
            <p className="mb-1 text-2xl font-semibold">{post.title}</p>
            <p className="text-sm text-gray-800">{post.content}</p>
          </>
        )}
      </CardContent>

      <CardFooter className="text-muted-foreground border-y px-4 py-3 text-sm [.border-t]:pt-3">
        <PostActions
          post={post}
          isCommentsListOpen={isCommentsListOpen}
          setIsCommentsListOpen={setIsCommentsListOpen}
        />
      </CardFooter>
      {isCommentsListOpen && (
        <CommentsList target_id={post.id} target_type="post" />
      )}
    </Card>
  );
};
