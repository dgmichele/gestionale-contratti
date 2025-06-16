import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import styles from '../asset/css/ProtectedRoute.module.css'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  const [showServerStartMessage, setShowServerStartMessage] = useState(false);  // gestione server dormiente Render
  const [timeoutMessage, setTimeoutMessage] = useState(false); // gestione server irraggiungibile

  // Gestiamo i tempi di attesa per il messaggio di server in avvio e irraggiungibile
  useEffect(() => {
    let startTimeout;
    let unreachableTimeout;

    if (loading) {
      // Dopo 3.5sec mostriamo il messaggio di "server in avvio"
      startTimeout = setTimeout(() => {
        setShowServerStartMessage(true);
      }, 3500);

      // Dopo 90sec consideriamo il server non raggiungibile
      unreachableTimeout = setTimeout(() => {
        setTimeoutMessage(true);
      }, 90000);
    } else {
      setShowServerStartMessage(false);
      setTimeoutMessage(false);
    }

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(unreachableTimeout);
    };
  }, [loading]);

  if (loading) {
    if (showServerStartMessage && !timeoutMessage) {
      return <p className={styles.status}>Attendi 50 secondi, sto avviando il server...</p>;
    }
    if (timeoutMessage) {
      return <p className={styles.status}>È passato troppo tempo... sembra che il server non stia rispondendo. Riprova più tardi.</p>;
    }
    return <p className={styles.status}>🔁 Recupero i dati...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
