import styles from '../asset/css/ContractCard.module.css';
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

function ContractCard({ contratto, onEdit, onDelete }) {
  const isExpired = new Date(contratto.data_scadenza) < new Date();

  const formattedData = (dataISO) => {
    const data = new Date(dataISO);
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(data);
  };

  return (
    <div className={styles.card}>
      <h3>{contratto.nome} {contratto.cognome}</h3>
      <p>Scade il: {formattedData(contratto.data_scadenza)}</p>
      {isExpired && <p className={styles.isExpired}>⚠️ Scaduto!</p>}

      <div className={styles.actions}>
        <FaPencilAlt className={styles.edit} onClick={() => onEdit(contratto)}/>
        <FaRegTrashAlt className={styles.delete} onClick={() => onDelete(contratto)}/>
      </div>
    </div>
  );
}

export default ContractCard;

