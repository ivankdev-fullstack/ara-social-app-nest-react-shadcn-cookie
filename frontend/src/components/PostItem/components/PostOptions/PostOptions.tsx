import { IPost } from '@/_common/interfaces/post';
import { OptionBtn } from '@/components/OptionBtn/OptionBtn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useDeleteByIdMutation } from '@/store/api/post.api';
import { removePost } from '@/store/slices/post.slice';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  post: IPost;
  setIsEditFormOpen: (arg: boolean) => any;
}

export const PostOptions = ({ post, setIsEditFormOpen }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteById] = useDeleteByIdMutation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleRedirectToAuthorsPage = () => {
    navigate(`/users/${post.user.id}`);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteById({ id: post.id }).unwrap();
      if (!res) {
        throw new Error('Something went wrong');
      }
      dispatch(removePost(post.id));
      setOpen(false);
      toast.success('Post has been successfully deleted!');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  const renderOptions = () => {
    if (user?.id === post.user.id) {
      return [
        {
          name: 'Edit',
          action: () => {
            setIsEditFormOpen(true);
            setOpen(false);
          },
        },
        {
          name: 'Delete',
          action: handleDelete,
        },
      ];
    }

    return [
      {
        name: "Go to author's page",
        action: () => {
          handleRedirectToAuthorsPage();
          setOpen(false);
        },
      },
    ];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-0 right-0 m-2 rounded-md p-1 transition-colors hover:bg-gray-200"
      >
        <EllipsisVertical
          size={20}
          color="black"
          className="text-gray-600 transition-colors hover:text-black"
        />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-full max-w-[200px] min-w-[120px] flex-col gap-1 p-2"
      >
        {renderOptions().map(({ name, action }) => (
          <OptionBtn key={name} value={name} action={action} />
        ))}
      </PopoverContent>
    </Popover>
  );
};
