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
      <h2>{mode === 'edit' ? 'Modifica Contratto' : 'Aggiungi Contratto'}</h2>

      <label>
        Nome:
        <input name="nome" value={formData.nome} onChange={handleChange} required />
      </label>

      <label>
        Cognome:
        <input name="cognome" value={formData.cognome} onChange={handleChange} required />
      </label>

      <label>
        Data Scadenza:
        <input type="date" name="data_scadenza" value={formData.data_scadenza} onChange={handleChange} required />
      </label>

      <div className={styles.buttons}>
        <button type="submit">Salva</button>
        <button type="button" onClick={onCancel}>Annulla</button>
      </div>
    </form>
  );
}
