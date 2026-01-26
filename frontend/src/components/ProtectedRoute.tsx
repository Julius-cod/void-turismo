import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/ApiAuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // ou spinner global se quiseres
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
