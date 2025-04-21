import { IComment } from '@/_common/interfaces/comment';
import { getTimeAgoShort } from '@/_common/utils/getTimeAgo';
import { useState } from 'react';
import { CommentEditForm } from './components/CommentEditForm/CommentEditForm';
import { CommentOptions } from './components/CommentOptions/CommentOptions';

interface Props {
  comment: IComment;
}

export const CommentItem = ({ comment }: Props) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);

  return (
    <div className="relative border-y-1 border-gray-100 py-3">
      {!isEditFormOpen && (
        <CommentOptions
          comment={comment}
          setIsEditFormOpen={setIsEditFormOpen}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-[40px] w-[40px]">
            <img
              src={comment.user.avatar}
              className="h-full w-full rounded-full object-cover"
              alt="avatar"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{comment.user.name}</span>
            <span className="text-muted-foreground text-xs">
              {getTimeAgoShort(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="my-3 mt-4 ml-5">
        {isEditFormOpen ? (
          <CommentEditForm
            comment={comment}
            setIsEditFormOpen={setIsEditFormOpen}
          />
        ) : (
          <>
            <p className="text-sm text-gray-800">{comment.content}</p>
          </>
        )}
      </div>
    </div>
  );
};
