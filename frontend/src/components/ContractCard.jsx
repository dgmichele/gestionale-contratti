import styles from '../asset/css/ContractCard.module.css';
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

function ContractCard({ contratto, onEdit, onDelete, highlightType }) { // highlightType: 'new' | 'edited' | undefined

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
    // Impostiamo l'id del div con "contract-<id>" così poi possiamo fare scroll in Homepage
    <div id={`contract-${contratto.id}`} className={styles.card}>
      {/* Se highlightType è 'new', mostro un badge verde con scritto "NUOVO" */}
      {highlightType === 'new' && (   
        <span className={styles.badgeNew}>NUOVO</span>
      )}
      {/* Se highlightType è 'edited', mostro un badge giallo con scritto "MODIFICATO" */}
      {highlightType === 'edited' && (
        <span className={styles.badgeEdited}>MODIFICATO</span>
      )}

      <h3>{contratto.nome} {contratto.cognome}</h3>
      <p>Scade il: {formattedData(contratto.data_scadenza)}</p>
      {isExpired && <p className={styles.isExpired}>⚠️ Scaduto!</p>}

      <div className={styles.actions}>
        <FaPencilAlt
          className={styles.edit}
          onClick={() => onEdit(contratto)}
        />
        <FaRegTrashAlt
          className={styles.delete}
          onClick={() => onDelete(contratto)}
        />
      </div>
    </div>
  );
}

export default ContractCard;
