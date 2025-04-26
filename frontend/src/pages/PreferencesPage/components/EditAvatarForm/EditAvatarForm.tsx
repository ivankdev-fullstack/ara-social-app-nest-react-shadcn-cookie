import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUploadAvatarMutation } from '@/store/api/user.api';
import { updateUser } from '@/store/slices/auth.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const schema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File || file?.[0] instanceof File, {
      message: 'Please select a file',
    }),
});

type FormData = z.infer<typeof schema>;

interface Props {
  user_id: string;
  user_avatar: string;
}

export const EditAvatarForm = ({ user_id, user_avatar }: Props) => {
  const [preview, setPreview] = useState(user_avatar);
  const [uploadAvatar] = useUploadAvatarMutation();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const file = data.file[0];

    try {
      // await updateProfile(auth.currentUser!, {photoURL: })
      const res = await uploadAvatar({ id: user_id, file });
      dispatch(updateUser({ avatar: res.data!.url! }));
      toast.success(
        'You have successfully uploaded new avatar for your profile!',
      );
    } catch (err) {
      console.log(err);
      toast.error(
        'Something went wrong while uploading new avatar to your profile.',
      );
    }
  };

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-2"
    >
      <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
        <img
          src={preview}
          alt="avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <Input
        type="file"
        accept="image/*"
        {...register('file')}
        onChange={(e) => {
          handlePreview(e);
          register('file').onChange(e);
        }}
        className="hover:cursor-pointer"
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Uploading...' : 'Save'}
      </Button>
    </form>
  );
};
