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
import { selectCurrentUser } from '@/store/slices/auth.slice';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEmail } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email().min(5).max(50),
});

export const EmailForm = () => {
  const user = useSelector(selectCurrentUser)!;
  const [updateById] = useUpdateByIdMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.email === user.email) {
      form.setError('email', {
        type: 'manual',
        message: 'New email cannot be the same as current.',
      });
      return;
    }

    try {
      await updateEmail(auth.currentUser!, data.email);
      await updateById({ id: user.id, data }).unwrap();
      toast.success(
        'We sent a verification letter to your new email. Please check!',
      );
    } catch (err: any) {
      if (err?.data?.message?.includes('This email is already registered')) {
        form.setError('email', {
          type: 'manual',
          message: 'This email is already registered.',
        });
      } else {
        toast.error('Error while updating user email.');
        console.log('Error while updating user email: ', err);
      }
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
          name="email"
          render={({ field }) => (
            <FormItem className="w-[400px]">
              <span className="mb-2 text-sm text-gray-500">
                <span>Your current email is </span>
                <span className="font-bold text-gray-700">{user.email}</span>
              </span>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex gap-5">
                  <Input
                    type="email"
                    placeholder="newemail@example.com"
                    {...field}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!form.formState.isValid}
                  >
                    Change
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                We will send a verification letter on new email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
