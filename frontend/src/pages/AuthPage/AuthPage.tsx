import AraIcon from '@/assets/ara_primary.svg';
import { SignInForm } from '@/components/SignInForm/SignInForm';
import { SignUpForm } from '@/components/SignUpForm/SignUpForm';
import { useState } from 'react';

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  const renderSignForm = () => {
    if (isSignIn) {
      return <SignInForm setIsSignIn={setIsSignIn} />;
    }
    return <SignUpForm setIsSignIn={setIsSignIn} />;
  };

  return (
    <div className="container flex h-screen items-center justify-center gap-2">
      <div className="flex flex-3 items-center">
        <img src={AraIcon} className="max-w-[400px]" />
        <div className="flex flex-col text-blue-500">
          <span className="text-8xl font-extrabold">Ara.</span>
          <span className="text-4xl font-extralight text-sky-600">
            Social Place for Social People.
          </span>
        </div>
      </div>
      <div className="w-full flex-2">{renderSignForm()}</div>
    </div>
  );
};
