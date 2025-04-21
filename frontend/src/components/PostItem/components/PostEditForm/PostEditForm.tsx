import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateByIdMutation } from '@/store/api/post.api';
import { updatePost } from '@/store/slices/post.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const titleLength = 30;
const contentLength = 300;

const formSchema = z.object({
  title: z
    .string()
    .min(4, 'Title too short')
    .max(titleLength, 'Title too long')
    .transform((val) => val.trim()),
  content: z
    .string()
    .min(5, 'Content too short')
    .max(contentLength, 'Content too long')
    .transform((val) => val.trim()),
});

interface Props {
  id: string;
  title: string;
  content: string;
  setIsEditFormOpen: (arg: boolean) => void;
}

export const PostEditForm = ({
  id,
  title,
  content,
  setIsEditFormOpen,
}: Props) => {
  const [updateById] = useUpdateByIdMutation();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title,
      content,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await updateById({ id, body: data }).unwrap();
      if (!res) {
        throw new Error('Something went wrong while updating your post.');
      }
      dispatch(updatePost({ id, ...data }));
      setIsEditFormOpen(false);
    } catch (err) {
      toast.error('Something went wrong while updating your post.');
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input {...field} />
                  <div className="text-muted-foreground absolute right-0 -bottom-5 text-xs">
                    {field.value.trim().length}/{titleLength}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="p-0" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...field}
                    className="max-h-[300px] min-h-[100px]"
                  />
                  <div className="text-muted-foreground absolute right-0 -bottom-5 text-xs">
                    {field.value.trim().length}/{contentLength}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditFormOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!form.formState.isValid}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
