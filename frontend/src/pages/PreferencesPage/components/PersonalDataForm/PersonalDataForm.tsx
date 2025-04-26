import { auth } from '@/_common/config/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUpdateByIdMutation } from '@/store/api/user.api';
import { selectCurrentUser, updateUser } from '@/store/slices/auth.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(5).max(50),
});

export const PersonalDataForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser)!;
  const [updateById] = useUpdateByIdMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updateProfile(auth.currentUser!, { displayName: data.name });
      await updateById({ id: user.id, data }).unwrap();
      dispatch(updateUser(data));
      toast.success('Your name has been successfully updated!');
    } catch (err) {
      toast.error('Error while updating user name.');
      console.log('Error while updating user name: ', err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[400px] space-y-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[400px]">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="flex gap-5">
                  <Input {...field} />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={user.name === form.getValues('name')}
                  >
                    Save
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
