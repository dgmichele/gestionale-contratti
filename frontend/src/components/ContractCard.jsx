import styles from '../asset/css/ContractCard.module.css';
import { FaPencilAlt } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";

function ContractCard({ contract, onEdit, onDelete, highlightType }) { // highlightType: 'new' | 'edited' | undefined

  const today = new Date();
  const contractDate = new Date(contract.data_scadenza);

  // Imposta l'ora a 00:00:00 per entrambe le date per evitare problemi con l'ora del giorno
  today.setHours(0, 0, 0, 0);
  contractDate.setHours(0, 0, 0, 0);

  const isExpired = contractDate < today;
  const isExpiredToday = contractDate.getTime() === today.getTime();
  const isAlmostExpired = contractDate > today && contractDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const formattedData = (dataISO) => {
    const data = new Date(dataISO);
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(data);
  };

  return (
    // Impostiamo l'id del div con "contract-<id>" così poi possiamo fare scroll in Homepage
    <div id={`contract-${contract.id}`} className={styles.card}>
      {/* Se highlightType è 'new', mostro un badge verde con scritto "NUOVO" */}
      {highlightType === 'new' && (   
        <span className={styles.badgeNew}>✨ NUOVO</span>
      )}
      {/* Se highlightType è 'edited', mostro un badge giallo con scritto "MODIFICATO" */}
      {highlightType === 'edited' && (
        <span className={styles.badgeEdited}>✏️ MODIFICATO</span>
      )}

      <h3>{contract.nome} {contract.cognome}</h3>
      <p>Scade il: {formattedData(contract.data_scadenza)}</p>
      { isExpired ? (
        <p className={styles.isExpired}>🚨 Scaduto!</p>
      ) : isExpiredToday ? (
        <p className={styles.isExpiredToday}>⚠️ Scade oggi!</p>
      ) : isAlmostExpired ? (
        <p className={styles.isAlmostExpired}>ℹ️ Scade a breve!</p>
      ) : null}

      <div className={styles.actions}>
        <FaPencilAlt
          className={styles.edit}
          onClick={() => onEdit(contract)}
        />
        <BsFillTrash3Fill
          className={styles.delete}
          onClick={() => onDelete(contract)}
        />
      </div>
    </div>
  );
}

export default ContractCard;
