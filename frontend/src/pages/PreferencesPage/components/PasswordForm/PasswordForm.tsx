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
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    password: z.string().min(5).max(50),
    password_repeat: z.string().min(5).max(50),
  })
  .refine((data) => data.password === data.password_repeat, {
    path: ['password_repeat'],
    message: 'Passwords do not match',
  });

export const PasswordForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      password_repeat: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await updatePassword(auth.currentUser!, data.password);
      toast.success('Your password has been successfully updated!');
    } catch (err) {
      toast.error('Error while updating user password.');
      console.log('Error while updating user password: ', err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-5"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder="*********" type="password" {...field} />
              </FormControl>
              <FormDescription>Enter your new password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_repeat"
          render={({ field }) => (
            <FormItem className="w-[400px]">
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <div className="flex gap-5">
                  <Input placeholder="*********" type="password" {...field} />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!form.formState.isValid}
                  >
                    Change
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Repeat it to check if correct.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
