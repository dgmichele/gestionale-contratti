import { useEffect } from 'react';
import styles from '../asset/css/Toast.module.css'; 

export default function Toast({ type, visible, contractId, onClose }) {

  useEffect(() => {
    if (visible) {
      // Quando il toast diventa visibile, avviamo un timer per nasconderlo dopo 3 secondi (3000ms)
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
    // Se visible diventa false o il componente si smonta, puliamo il timer
  }, [visible, onClose]);

  // Funzione che scrolla alla card del contratto, se passiamo un contractId valido
  const handleScrollToContract = () => {
    if (!contractId) return;
    // Recuperiamo l'id della nuova contract card
    const element = document.getElementById(`contract-${contractId}`);
    if (element) {
      // Scroll fino all’elemento, con un piccolo offset se serve
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Dopo lo scroll, possiamo chiudere subito il toast
    onClose();
  };

  if (!visible) return null; // Se non vogliamo mostrare il toast, ritorniamo null e React non renderizza nulla

  // Decidiamo il contenuto del toast in base al tipo
  let message = '';
  let showLink = false;
  if (type === 'new') {
    message = 'Contratto creato con successo!';
    showLink = true; // nel caso new mostriamo anche il bottone “Visualizzalo!”
  } else if (type === 'edited') {
    message = 'Contratto modificato con successo!';
  } else if (type === 'deleted') {
    message = 'Contratto eliminato con successo!';
  }

  return (
    <div className={styles.toastContainer}>
      <div className={styles.text}>
        {/* Il messaggio principale */}
        <span className={styles.toastMessage}>{message}</span>

        {/* Se è una creazione, mostriamo il link “Visualizzalo!” */}
        {showLink && (
          <button
            className={styles.toastLink}
            onClick={handleScrollToContract}
          >
            Visualizzalo!
          </button>
        )}
      </div>

        {/* “×” per chiudere manualmente il toast */}
        <div className={styles.closeContainer}>
            <button className={styles.toastClose} onClick={onClose}>
            &times;
            </button>
        </div>
    </div>
  );
}