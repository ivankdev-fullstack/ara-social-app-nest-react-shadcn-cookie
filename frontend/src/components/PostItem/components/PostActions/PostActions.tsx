import { IPost, ReactionType } from '@/_common/interfaces';
import { useToggleMutation } from '@/store/api/reaction.api';
import { toggleCurrentReaction } from '@/store/slices/post.slice';
import { applyReaction } from '@/store/slices/reaction.slice';
import { MessageCircle, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { PostAction } from './PostAction/PostAction';

interface Props {
  post: IPost;
  isCommentsListOpen: boolean;
  setIsCommentsListOpen: (arg: boolean) => void;
}

export const PostActions = ({
  post,
  isCommentsListOpen,
  setIsCommentsListOpen,
}: Props) => {
  const [toggleReaction] = useToggleMutation();
  const dispatch = useDispatch();

  const handleReaction = async (type: ReactionType) => {
    try {
      const res = await toggleReaction({
        target_id: post.id,
        target_type: 'post',
        type,
      }).unwrap();

      dispatch(
        applyReaction({
          target_id: post.id,
          target_type: 'post',
          type,
          result: res.result,
        }),
      );
      dispatch(
        toggleCurrentReaction({ post_id: post.id, reaction_type: type }),
      );
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while setting the reaction');
    }
  };

  const postActions = [
    {
      name: 'Like',
      icon: <ThumbsUpIcon size={16} />,
      count: post.countOf.likes,
      action: () => handleReaction('like'),
      active: post?.current_reaction === 'like',
    },
    {
      name: 'Comment',
      icon: <MessageCircle size={16} />,
      count: post.countOf.comments,
      action: () => setIsCommentsListOpen(!isCommentsListOpen),
      active: isCommentsListOpen,
    },
    {
      name: 'Dislike',
      icon: <ThumbsDownIcon size={16} />,
      count: post.countOf.dislikes,
      action: () => handleReaction('dislike'),
      active: post?.current_reaction === 'dislike',
    },
  ];

  return postActions.map((action, idx) => (
    <div className="flex w-full justify-between" key={action.name}>
      <PostAction
        icon={action.icon}
        count={action.count}
        action={action.action}
        active={action.active}
      />
      {idx < postActions.length - 1 ? (
        <div className="h-[20px] w-[1px] bg-gray-300"></div>
      ) : null}
    </div>
  ));
};
