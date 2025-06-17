import { useAuth } from '../hooks/useAuth';
import { useAuthUI } from '../hooks/useAuthUI';
import { Navigate } from 'react-router-dom';
import styles from '../asset/css/ProtectedRoute.module.css'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { 
    showServerStartMessage, 
    timeoutMessage, 
    getStatusMessage 
  } = useAuthUI(loading); // Passiamo il loading esterno dall'hook useAuth

  if (loading) {
    if (showServerStartMessage && !timeoutMessage) {
      return <p className={styles.status}>{getStatusMessage('protected')}</p>;
    }
    if (timeoutMessage) {
      return <p className={styles.status}>{getStatusMessage('protected')}</p>;
    }
    return <p className={styles.status}>{getStatusMessage('protected')}</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}