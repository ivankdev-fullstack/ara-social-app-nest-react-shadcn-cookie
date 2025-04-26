import { auth, googleProvider } from '@/_common/config/firebase';
import { useRegisterByGoogleMutation } from '@/store/api/auth.api';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export const GoogleSignInButton = () => {
  const [registerByGoogle] = useRegisterByGoogleMutation();

  const handleGoogleSignIn = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (!res.user) {
        throw new Error('No user returned from Google');
      }

      const user = res.user;
      const idToken = await user.getIdToken();
      if (!idToken) {
        throw new Error('No ID token received');
      }

      await registerByGoogle({
        name: user.displayName!,
        email: user.email!,
        idToken,
      });

      localStorage.setItem('token', idToken);
      toast.success('Signed in successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Google sign in error:', err);
      toast.error('Failed to sign in with Google.');
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} className="rounded-md" type="button">
      Sign in with Google
    </Button>
  );
};
