import { useState, useEffect } from 'react';
import { useContracts } from '../hooks/useContracts';
import { Link } from 'react-router-dom';
import styles from '../asset/css/PopupDeleteContract.module.css';

export default function PopupDeleteContract({ contractId, onClose, onSuccess }) {
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
      await deleteContract.mutateAsync(contractId);
      // Dopo la cancellazione, avviso Homepage di mostrare toast “deleted”
      onSuccess(contractId); 
      handleClose();
    } catch (err) {
      console.error('Errore durante l\'eliminazione:', err);
      
      // Controllo se l'errore indica sessione scaduta
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorMsg('La tua sessione è scaduta. Effettua di nuovo l\'accesso cliccando qui in basso.');
      } else {
        setErrorMsg('Errore durante l\'eliminazione. Riprova.');
      }
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
          <>
            <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>
              {errorMsg}
            </p>
            {errorMsg.includes('sessione') && (
              <Link className={styles.newAccess} to="/login">
                Rifai l'accesso
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
