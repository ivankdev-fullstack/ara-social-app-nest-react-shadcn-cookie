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
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { GoogleSignInButton } from '../GoogleSignBtn/GoogleSignBtn';

const formSchema = z.object({
  email: z.string().email().min(5).max(50),
  password: z.string().min(6).max(50),
});

interface Props {
  setIsSignIn: Dispatch<SetStateAction<boolean>>;
}

export const SignInForm = ({ setIsSignIn }: Props) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignIn = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem('token', idToken);
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setLoading(false);
      toast.error('Something went wrong while loggin in.');
      console.log('Error while logging: ', err);
    }
  };

  const onRecoverPassword = () => {
    console.log('recover handler');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignIn)}
        className="shadow-accent flex max-w-[500px] flex-col justify-center space-y-4 rounded-lg border-1 p-6 shadow-md"
      >
        <div className="mb-8 text-center text-2xl font-medium">
          Log in to your account
        </div>
        <GoogleSignInButton />
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
        <div className="space-x-1 text-right">
          <span>Forgot password?</span>
          {/* TODO: Recover handler */}
          <span
            className="text-blue-400 hover:cursor-pointer hover:underline"
            onClick={onRecoverPassword}
          >
            Recover it!
          </span>
        </div>
        <Button
          type="submit"
          className="mx-auto my-1 w-full max-w-[200px]"
          disabled={isLoading}
        >
          Sign in
        </Button>
        <div className="mt-6 space-x-1 text-center">
          <span>Do not have an account?</span>
          <span
            className="text-blue-400 hover:cursor-pointer hover:underline"
            onClick={() => setIsSignIn(false)}
          >
            Create a new one!
          </span>
        </div>
      </form>
    </Form>
  );
};
