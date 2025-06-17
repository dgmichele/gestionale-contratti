import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContracts } from '../hooks/useContracts';
import { useUI } from '../hooks/useUI';
import { useNavigate } from 'react-router-dom';
import ContractCard from '../components/ContractCard';
import PopupAddAndChangeContract from '../components/PopupAddAndChangeContract';
import PopupDeleteContract from '../components/PopupDeleteContract';
import Toast from '../components/Toast';
import styles from '../asset/css/HomePage.module.css';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rilevo se siamo in mobile (per paginazione)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const limit = isMobile ? 6 : 11; // 6 per mobile, 11 per desktop

  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Hook per contratti
  const {
    contracts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useContracts(limit);

  // Mostro "Lista contratti completa ✅" solo se sono stati caricati più di 11 (o 6) contratti
  const handleLoadMore = () => {
    fetchNextPage();
    setHasLoadedMore(true);
  };

  const visibleContracts = contracts;

  // Hook per gestire tutta la logica UI (popup, toast, evidenziazioni)
  const {
    // Stati
    popupMode,
    isAddAndChangePopupVisible,
    isDeletePopupVisible,
    selectedContract,
    toast,
    highlightedId,
    highlightedType,
    
    // Metodi per popup
    openAddPopup,
    openChangePopup,
    openDeletePopup,
    closeAddAndChangePopup,
    closeDeletePopup,
    
    // Metodi per toast
    hideToast,
    
    // Metodi combinati
    handleAddOrEditSuccess,
    handleDeleteSuccess
  } = useUI();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ciao {user?.nome || 'utente'}! 😊</h1>

      {/* Mostro il toast se toast.visible===true */}
      {toast.visible && (
        <Toast
          type={toast.type}
          visible={toast.visible}
          contractId={toast.contractId}
          onClose={hideToast}
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
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Caricamento...' : 'Carica altri contratti'}
              </button>
            )}

          {!hasNextPage && hasLoadedMore && visibleContracts.length >= limit && (
            <p className={styles.noMore}>
              Lista contratti completa ✅
            </p>
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