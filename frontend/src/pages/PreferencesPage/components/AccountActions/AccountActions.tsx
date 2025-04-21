import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/store/api/auth.api';
import { useDeleteByIdMutation } from '@/store/api/user.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  user_id: string;
}

export const AccountActions = ({ user_id }: Props) => {
  const navigate = useNavigate();
  const [deleteById] = useDeleteByIdMutation();
  const [logout] = useLogoutMutation();

  const handleDeleteAccount = async () => {
    try {
      await deleteById({ id: user_id }).unwrap();
      navigate('/');
      console.log('deleted');
    } catch (err) {
      console.log('Error while updating user name: ', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/');
      console.log('logged out');
    } catch (err) {
      console.log('Error while updating user name: ', err);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600"
              onClick={async (e) => {
                e.preventDefault();
                await handleDeleteAccount();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button className="bg-neutral-800 text-white" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};
