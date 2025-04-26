import { auth } from '@/_common/config/firebase';
import { Button } from '@/components/ui/button';
import { logout } from '@/store/slices/auth.slice';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';

export const AccountActions = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      dispatch(logout());
      window.location.reload();
    } catch (err) {
      console.log('Error while updating user name: ', err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <Button className="bg-neutral-800 text-white" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};
