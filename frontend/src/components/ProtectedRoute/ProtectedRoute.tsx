import { useAuth } from '@/hooks/useAuth';
import { ReactNode, useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user && location.pathname !== '/') {
        window.location.href = '/';
      }
      if (user && location.pathname === '/') {
        window.location.href = '/feed';
      }
    }
  }, [user, isLoading, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!children) {
    window.location.href = '/feed';
  }

  return children;
};
