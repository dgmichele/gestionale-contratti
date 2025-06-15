import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContracts } from '../hooks/useContracts';
import { useNavigate } from 'react-router-dom';
import ContractCard from '../components/ContractCard';
import PopupAddAndChangeContract from '../components/PopupAddAndChangeContract';
import PopupDeleteContract from '../components/PopupDeleteContract';
import Toast from '../components/Toast';
import styles from '../asset/css/HomePage.module.css';

export default function HomePage() {
  const { user } = useAuth();

  // Rilevo se siamo in mobile (per paginazione): la parte rimane uguale a prima
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const limit = isMobile ? 6 : 11;

  // Hook per contratti
  const {
    contracts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useContracts(limit);

  const visibleContracts = contracts;

  // Stati per popup
  const [popupMode, setPopupMode] = useState('add');
  const [isAddAndChangePopupVisible, setIsAddAndChangePopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [toast, setToast] = useState({
    type: '', // 'new' | 'edited' | 'deleted'
    visible: false,
    contractId: null // usato solo se type==='new'
  });
  const [highlightedId, setHighlightedId] = useState(null);
  const [highlightedType, setHighlightedType] = useState(null);

  // Successo in ADD o EDIT
  const handleAddOrEditSuccess = (newId, actionType) => {
    // Imposto badge
    setHighlightedId(newId);
    setHighlightedType(actionType);

    // Mostro toast
    setToast({
      type: actionType,
      visible: true,
      contractId: actionType === 'new' ? newId : null
    });
  };

  // Successo in DELETE
  const handleDeleteSuccess = (deletedId) => {
    // Rimuovo eventuale evidenza
    if (highlightedId === deletedId) {
      setHighlightedId(null);
      setHighlightedType(null);
    }
    // Mostro toast di tipo 'deleted'
    setToast({
      type: 'deleted',
      visible: true,
      contractId: null
    });
  };

  // Chiudo il toast (sia manualmente che dopo 3 secondi)
  const handleToastClose = () => {
    // Nascondo il toast
    setToast(current => ({ ...current, visible: false }));
  };

  const openAddPopup = () => {
    setPopupMode('add');
    setSelectedContract(null);
    setIsAddAndChangePopupVisible(true);
  };

  const openChangePopup = (contratto) => {
    setPopupMode('edit');
    setSelectedContract(contratto);
    setIsAddAndChangePopupVisible(true);
  };

  const closeAddAndChangePopup = () => {
    setIsAddAndChangePopupVisible(false);
  };

  const openDeletePopup = (contratto) => {
    setSelectedContract(contratto);
    setIsDeletePopupVisible(true);
  };

  const closeDeletePopup = () => {
    setIsDeletePopupVisible(false);
  };

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ciao {user?.nome || 'utente'}!</h1>

      {/* mostro il toast se toast.visible===true */}
      {toast.visible && (
        <Toast
          type={toast.type}
          visible={toast.visible}
          contractId={toast.contractId}
          onClose={handleToastClose}
        />
      )}

      {isLoading && <p className={styles.status}>🔁 Caricamento contratti...</p>}

      {error?.response?.status === 401 || error?.response?.status === 403 ? (
        <>
          <p>⏳ La tua sessione è scaduta. Effettua nuovamente l'accesso per continuare.</p>
          <button className={styles.newAccess} onClick={() => navigate('/login')}>
            Accedi di nuovo
          </button>
        </>
        ) : error ? (
          <p>❌ Errore nel caricamento dei contratti.</p>
        ) : null}

      {!isLoading && !error && (
        <>
          <p className={styles.subtitle}>I tuoi contratti:</p>

          {visibleContracts.length === 0 ? (
            <>
              <p className={styles.noContracts}>
                Non hai ancora nessun contratto salvato, crealo adesso.
              </p>
              <button className={styles.addCardButton} onClick={openAddPopup}>
                Aggiungi un contratto
              </button>
            </>
          ) : (
            <div className={styles.grid}>
              {visibleContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onEdit={openChangePopup}
                  onDelete={openDeletePopup}
                  // Se questo contratto corrisponde a highlightedId, passo highlightedType
                  highlightType={highlightedId === contract.id ? highlightedType : undefined}
                />
              ))}
              <button className={styles.addCardPlus} onClick={openAddPopup}>
                +
              </button>
            </div>
          )}

          <div className={styles.loadMoreBtnContainer}>
            {hasNextPage && (
              <button
                className={styles.loadMoreBtn}
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Caricamento...' : 'Carica altri contratti'}
              </button>
            )}
          </div>
        </>
      )}

      {isAddAndChangePopupVisible && (
        <PopupAddAndChangeContract
          mode={popupMode}
          initialData={selectedContract}
          onClose={closeAddAndChangePopup}
          onSuccess={handleAddOrEditSuccess} 
        />
      )}

      {isDeletePopupVisible && (
        <PopupDeleteContract
          contractId={selectedContract?.id}
          onClose={closeDeletePopup}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
