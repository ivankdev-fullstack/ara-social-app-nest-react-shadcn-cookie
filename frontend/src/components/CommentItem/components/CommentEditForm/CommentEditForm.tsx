import { IComment } from '@/_common/interfaces/comment';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateByIdMutation } from '@/store/api/comment.api';
import { updateComment } from '@/store/slices/comment.slice';
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
  comment: IComment;
  setIsEditFormOpen: (arg: boolean) => void;
}

export const CommentEditForm = ({ comment, setIsEditFormOpen }: Props) => {
  const [updateById] = useUpdateByIdMutation();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      content: comment.content,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const res = await updateById({ id: comment.id, body: data }).unwrap();
      if (!res) {
        throw new Error('Something went wrong while updating your comment.');
      }
      dispatch(
        updateComment({
          target_id: comment.target_id,
          data: { id: comment.id, ...data },
        }),
      );
      setIsEditFormOpen(false);
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
