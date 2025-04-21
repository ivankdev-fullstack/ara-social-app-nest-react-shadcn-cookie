import AraWhiteIcon from '@/assets/ara_white.svg';
import PopoverArrow from '@/assets/popover-arrow.svg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutMutation } from '@/store/api/auth.api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const redirectToUserPage = () => {
    navigate(`/profile/${user.id}`);
  };

  const redirectToPreferencesPage = () => {
    navigate(`/preferences`);
  };

  const handleLogout = async () => {
    await logout().unwrap();
    navigate('/auth');
  };

  return (
    <div className="flex h-[70px] items-center justify-center bg-sky-600">
      <div className="small-container flex items-center">
        <div
          className="flex flex-1 items-center gap-2 hover:cursor-pointer"
          onClick={() => navigate('/feed')}
        >
          <img src={AraWhiteIcon} className="max-w-[40px]" />
          <span className="text-xl font-medium text-white">Ara</span>
        </div>
        <div className="flex flex-1 justify-center">
          <Input
            placeholder="Search posts..."
            className="w-[300px] rounded-full border-none bg-blue-400 text-white shadow-none placeholder:text-white"
          />
        </div>

        <div className="flex flex-1 justify-end">
          <Popover>
            <PopoverTrigger>
              <div className="flex items-center justify-center gap-3">
                <div className="h-[40px] w-[40px]">
                  <img
                    src={user.avatar}
                    className="h-full w-full rounded-full object-cover"
                    alt="avatar"
                  />
                </div>
                <img src={PopoverArrow} className="max-w-[8px]" alt="arrow" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full font-normal"
                  size="sm"
                  variant="ghost"
                  onClick={redirectToUserPage}
                >
                  My profile
                </Button>
                <Button
                  className="w-full font-normal"
                  size="sm"
                  variant="ghost"
                  onClick={redirectToPreferencesPage}
                >
                  Preferences
                </Button>
                <Button
                  className="w-full font-normal"
                  size="sm"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
