import { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import styles from '../asset/css/PopupDeleteContract.module.css';

export default function PopupDeleteContract({ contrattoId, onClose, onSuccess }) {
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { deleteContract } = useContracts();

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setErrorMsg('');
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    try {
      setErrorMsg('');
      await deleteContract.mutateAsync(contrattoId);
      // Dopo la cancellazione, avviso Homepage di mostrare toast “deleted”
      onSuccess(contrattoId); 
      handleClose();
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
      setErrorMsg('Errore durante l’eliminazione. Riprova.');
    }
  };

  return (
    <div className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}>
      <div className={`${styles.popup} ${visible ? styles.slideIn : styles.slideOut}`}>
        <h2 className={styles.title}>Confermi l'eliminazione?</h2>
        <p className={styles.subtitle}>
          L'azione sarà irreversibile e dovrai ricreare il contratto.
        </p>
        <div className={styles.buttons}>
          <button className={styles.confirm} onClick={handleConfirm}>
            Conferma
          </button>
          <button className={styles.cancel} onClick={handleClose}>
            Annulla
          </button>
        </div>
        {errorMsg && (
          <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
