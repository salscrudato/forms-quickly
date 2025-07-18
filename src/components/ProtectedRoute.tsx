import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  return user ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;
