import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/store/api/auth.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().email().min(5).max(50),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .regex(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number format' }),
  password: z.string().min(6).max(50),
});

interface Props {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export const SignUpForm = ({ setIsSignIn }: Props) => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSignIn = async (data: z.infer<typeof formSchema>) => {
    try {
      await register(data).unwrap();
      navigate('/feed');
      window.location.reload();
    } catch (err) {
      form.setError('email', {
        type: 'manual',
        message: 'This email is already registered.',
      });
      console.error('Register error:', err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignIn)}
        className="shadow-accent flex max-w-[500px] flex-col justify-center space-y-4 rounded-lg border-1 p-6 shadow-md"
      >
        <div className="mb-8 text-center text-2xl font-medium">
          Create new account
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="( ___ ) ___ __ __" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mx-auto my-1 w-full max-w-[200px]"
          disabled={isLoading}
        >
          Sign up
        </Button>
        <div className="mt-6 space-x-1 text-center">
          <span>Already have an account?</span>
          <span
            className="text-blue-400 hover:cursor-pointer hover:underline"
            onClick={() => setIsSignIn(true)}
          >
            Log in!
          </span>
        </div>
      </form>
    </Form>
  );
};
