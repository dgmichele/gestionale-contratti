import { useState, useEffect } from 'react';
import styles from '../asset/css/AddContractForm.module.css';

export default function AddContractForm({ mode, initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    data_scadenza: '',
  });

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        nome: initialData.nome,
        cognome: initialData.cognome,
        data_scadenza: new Date(initialData.data_scadenza).toISOString().split('T')[0]
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Passa i dati al padre
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{mode === 'edit' ? 'Modifica contratto:' : 'Aggiungi contratto:'}</h2>

        <input name="nome" placeholder='Nome' value={formData.nome} onChange={handleChange} required />
        <input name="cognome" placeholder='Cognome' value={formData.cognome} onChange={handleChange} required />
        <input
          type={mode === 'edit' ? 'date' : 'text'}
          name="data_scadenza"
          placeholder={mode === 'edit' ? '' : 'Data di scadenza'}
          value={formData.data_scadenza}
          onChange={handleChange}
          onFocus={(e) => {
            if (mode !== 'edit') e.target.type = 'date';
          }}
          onBlur={(e) => {
            if (mode !== 'edit' && !e.target.value) e.target.type = 'text';
          }}
          required
        />

      <div className={styles.buttons}>
        <button className={styles.save} type="submit">Salva</button>
        <button className={styles.cancel} type="button" onClick={onCancel}>Annulla</button>
      </div>
    </form>
  );
}
