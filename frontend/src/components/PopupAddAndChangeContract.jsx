import { useState, useEffect } from 'react';
import AddContractForm from './AddContractForm';
import { useContracts } from '../hooks/useContracts';
import styles from '../asset/css/PopupAddAndChangeContract.module.css';

export default function PopupAddAndChangeContract({mode,initialData, onClose, onSuccess}) {
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

  // _IMPORTANTE_: gestiamo il submit del form
  const handleSubmit = async (formData) => {
    try {
      setErrorMsg('');
      if (mode === 'edit') {
        // Se sono in modifica, chiamo updateContract.mutateAsync
        const updated = await updateContract.mutateAsync({
          id: initialData.id,
          ...formData
        });
        // AL SUCCESS: restituisco a Homepage l'id e il tipo "edited"
        onSuccess(initialData.id, 'edited');
      } else {
        // Se sono in creazione, chiamo addContract.mutateAsync
        const created = await addContract.mutateAsync(formData);
        // Di solito il backend ritorna l'oggetto con { id: ..., nome: ..., ... }
        // Quindi prendo created.id
        onSuccess(created.id, 'new');
      }
      // Dopo aver chiamato onSuccess, chiudo il popup
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
          onSubmit={handleSubmit}  // passo la nuova logica con onSuccess
          onCancel={handleClose}
        />
        {errorMsg && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
