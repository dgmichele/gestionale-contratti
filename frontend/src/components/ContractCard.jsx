// ContractCard.jsx
import styles from '../asset/css/ContractCard.module.css';

function ContractCard({ contratto, onEdit, onDelete }) {
  const isExpired = new Date(contratto.data_scadenza) < new Date();

  const formattedData = (dataISO) => {
    const data = new Date(dataISO);
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className={styles.card}>
      <h3>{contratto.nome} {contratto.cognome}</h3>
      <p>
        Scade il: {formattedData(contratto.data_scadenza)}
        {isExpired && <p style={{ color: 'red', marginLeft: '5px' }}>🚨 Contratto scaduto!</p>}
      </p>

      <div className={styles.actions}>
        <button onClick={() => onEdit(contratto)}>✏️</button>
        <button onClick={() => onDelete(contratto)}>🗑️</button>
      </div>
    </div>
  );
}

export default ContractCard;

