import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Verifica autenticazione in corso...</p>; // evitiamo redirect durante il check
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
