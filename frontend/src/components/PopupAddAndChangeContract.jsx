import { useState, useEffect } from 'react';
import AddContractForm from './AddContractForm';
import { useContracts } from '../hooks/useContracts';
import { Link } from 'react-router-dom';
import styles from '../asset/css/PopupAddAndChangeContract.module.css';

export default function PopupAddAndChangeContract({mode, initialData, onClose, onSuccess}) {
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { addContract, updateContract } = useContracts();

  // Fa partire la transizione di apertura (fadeIn + slideIn)
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  // Chiude il popup con transizione
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setErrorMsg('');
      onClose(); // chiudo popup vero e proprio
    }, 300);
  };

const handleSubmit = async (formData) => {
  try {
    setErrorMsg('');
    if (mode === 'edit') {
      await updateContract.mutateAsync({ id: initialData.id, ...formData });
      onSuccess(initialData.id, 'edited');
    } else {
      const created = await addContract.mutateAsync(formData);
      onSuccess(created.id, 'new');
    }
    handleClose();
  } catch (err) {
    console.error('Errore nel salvataggio contratto:', err);

    // Controllo se l'errore indica sessione scaduta
    if (err.response?.status === 401 || err.response?.status === 403) {
      setErrorMsg('La tua sessione è scaduta. Effettua di nuovo l\'accesso cliccando qui in basso.');
    } else {
      setErrorMsg('Errore durante il salvataggio. Riprova.');
    }
  }
};


  return (
    <div className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}>
      <div className={`${styles.popup} ${visible ? styles.slideIn : styles.slideOut}`}>
        <AddContractForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}  // passo la nuova logica con onSuccess
          onCancel={handleClose}
        />
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
