import { useState, useEffect } from 'react';
import AddContractForm from './AddContractForm';
import { useContracts } from '../hooks/useContracts';
import styles from '../asset/css/PopupAddAndChangeContract.module.css';

export default function PopupAddAndChangeContract({ mode, initialData, onClose }) {
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { addContract, updateContract } = useContracts();

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

  const handleSubmit = async (formData) => {
    try {
      setErrorMsg('');
      if (mode === 'edit') {
        await updateContract.mutateAsync({ id: initialData.id, ...formData });
      } else {
        await addContract.mutateAsync(formData);
      }
      handleClose();
    } catch (err) {
      console.error('Errore nel salvataggio contratto:', err);
      setErrorMsg('Errore durante il salvataggio. Riprova.');
    }
  };

  return (
    <div className={`${styles.overlay} ${visible ? styles.fadeIn : styles.fadeOut}`}>
      <div className={`${styles.popup} ${visible ? styles.slideIn : styles.slideOut}`}>
        <AddContractForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
        {errorMsg && <p style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</p>}
      </div>
    </div>
  );
}
