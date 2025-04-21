import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) return null;

  if (!user && location.pathname !== '/') {
    navigate('/', { replace: true });
    return null;
  }
  if (user && location.pathname === '/') {
    navigate('/feed', { replace: true });
    return null;
  }

  return children;
};
