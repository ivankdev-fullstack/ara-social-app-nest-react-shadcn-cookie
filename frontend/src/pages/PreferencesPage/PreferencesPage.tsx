import LeftArrowIcon from '@/assets/left-arrow.png';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PreferencesSection } from '@/pages/PreferencesPage/components/PreferencesSection/PreferencesSection';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountActions } from './components/AccountActions/AccountActions';
import { EditAvatarForm } from './components/EditAvatarForm/EditAvatarForm';
import { EmailForm } from './components/EmailForm/EmailForm';
import { PasswordForm } from './components/PasswordForm/PasswordForm';
import { PersonalDataForm } from './components/PersonalDataForm/PersonalDataForm';

export const PreferencesPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  const handleRedirectToPrevPage = () => {
    navigate(-1);
  };

  return (
    <div className="small-container">
      <Card className="mt-10">
        <CardHeader className="relative flex justify-center">
          <div
            className="absolute top-0 left-5 p-2 hover:cursor-pointer"
            onClick={handleRedirectToPrevPage}
          >
            <img src={LeftArrowIcon} className="max-w-[20px]" />
          </div>

          <EditAvatarForm user_id={user.id} user_avatar={user.avatar} />
        </CardHeader>
        <CardContent>
          <PreferencesSection title="Personal Information">
            <PersonalDataForm />
          </PreferencesSection>
          <PreferencesSection title="Change Email">
            <EmailForm />
          </PreferencesSection>
          <PreferencesSection title="Change Password">
            <PasswordForm user_id={user.id} />
          </PreferencesSection>
          <PreferencesSection title="Account actions">
            <AccountActions />
          </PreferencesSection>
        </CardContent>
      </Card>
    </div>
  );
};
