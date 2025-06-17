import styles from '../asset/css/ContractCard.module.css';
import { FaPencilAlt } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";

function ContractCard({ contract, onEdit, onDelete, highlightType }) { // highlightType: 'new' | 'edited' | undefined

  const isExpired = new Date(contract.data_scadenza) < new Date() && new Date(contract.data_scadenza).getDate() !== new Date().getDate();
  const isExpiredToday = new Date(contract.data_scadenza).getDate() === new Date().getDate();
  const isAlmostExpired = new Date(contract.data_scadenza) < new Date(new Date().setDate(new Date().getDate() + 3)) && new Date(contract.data_scadenza).getDate() !== new Date().getDate();

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
        <p className={styles.isAlmostExpired}>ℹ️ Mancano solo 3 giorni!</p>
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
