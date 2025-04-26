import { useAuth } from '@/hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user && location.pathname !== '/') {
        window.location.href = '/';
      }
      if (user && location.pathname === '/') {
        window.location.href = '/feed';
      }
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};
