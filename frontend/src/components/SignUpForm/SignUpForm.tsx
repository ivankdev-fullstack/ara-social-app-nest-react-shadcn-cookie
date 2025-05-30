import { auth } from '@/_common/config/firebase';
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
import { signInWithCustomToken } from 'firebase/auth';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { GoogleSignInButton } from '../GoogleSignBtn/GoogleSignBtn';

const formSchema = z.object({
  name: z.string().min(5).max(50),
  email: z.string().email().min(5).max(50),
  password: z.string().min(6).max(50),
});

interface Props {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export const SignUpForm = ({ setIsSignIn }: Props) => {
  const [register, { isLoading }] = useRegisterMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSignUp = async (data: z.infer<typeof formSchema>) => {
    try {
      const { token } = await register(data).unwrap();
      const userCredential = await signInWithCustomToken(auth, token);
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);
      window.location.reload();
    } catch (err) {
      toast.error('Something went wrong while loggin in.');
      console.error('Register error:', err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignUp)}
        className="shadow-accent flex max-w-[500px] flex-col justify-center space-y-4 rounded-lg border-1 p-6 shadow-md"
      >
        <div className="mb-8 text-center text-2xl font-medium">
          Create new account
        </div>
        <GoogleSignInButton />
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
