import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/ApiAuthContext';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
