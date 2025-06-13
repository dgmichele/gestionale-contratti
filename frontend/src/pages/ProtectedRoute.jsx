import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from '../asset/css/ProtectedRoute.module.css'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Stato per decidere quale messaggio mostrare
  const [showServerStartMessage, setShowServerStartMessage] = useState(false);

  useEffect(() => {
    let timer;

    if (loading) {
      // Se il loading dura più di 5 secondi, mostra messaggio server
      timer = setTimeout(() => {
        setShowServerStartMessage(true);
      }, 3500);
    } else {
      // Reset se loading finisce
      setShowServerStartMessage(false);
    }

    // Cleanup timer quando loading cambia o componente smonta
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    if (showServerStartMessage) {
      return <p className={styles.status}>🕛 Attendi 50 secondi, sto avviando il server...</p>;
    }
    return <p className={styles.status}>🔁 Recupero i dati...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
