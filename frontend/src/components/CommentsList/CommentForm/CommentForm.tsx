import { TargetType } from '@/_common/interfaces';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMutation } from '@/store/api/comment.api';
import { appendComments } from '@/store/slices/comment.slice';
import { incrementCountOfComments } from '@/store/slices/post.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const contentLength = 300;

const formSchema = z.object({
  content: z
    .string()
    .min(5, 'Content too short')
    .max(contentLength, 'Content too long')
    .transform((val) => val.trim()),
});

interface Props {
  target_id: string;
  target_type: TargetType;
}

export const CommentForm = ({ target_id, target_type }: Props) => {
  const dispatch = useDispatch();
  const [create] = useCreateMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await create({ ...data, target_id, target_type }).unwrap();
      if (!res) {
        throw new Error('Something went wrong while creating your comment.');
      }
      dispatch(appendComments({ target_id, data: [res] }));
      dispatch(incrementCountOfComments({ post_id: target_id }));
      form.reset();
    } catch (err) {
      toast.error('Something went wrong while updating your comment.');
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...field}
                    className="max-h-[300px] min-h-[100px] w-full"
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
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!form.formState.isValid}>
            Send Comment
          </Button>
        </div>
      </form>
    </Form>
  );
};
