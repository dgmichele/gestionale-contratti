import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useContracts } from '../hooks/useContracts';
import ContractCard from '../components/ContractCard';
import PopupAddAndChangeContract from '../components/PopupAddAndChangeContract';
import PopupDeleteContract from '../components/PopupDeleteContract';
import styles from '../asset/css/HomePage.module.css';

export default function HomePage() {
  const { user } = useAuth();

  const [isMobile, setIsMobile] = useState(false);
  const [popupMode, setPopupMode] = useState('add'); // logica per usare stesso popup per creazione e modifica contratto
  const [isAddAndChangePopupVisible, setIsAddAndChangePopupVisible] = useState(false);
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const limit = isMobile ? 6 : 11;

  // Passiamo il limite a useContracts
  const {
    contratti,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useContracts(limit);

  const visibleContracts = contratti;

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bentornato, {user?.nome || 'utente'}!</h1>

      {isLoading && <p className={styles.status}>🔁 Caricamento contratti...</p>}
      {error && <p className={styles.status}>❌ Errore nel caricamento dei contratti</p>}

      {!isLoading && !error && (
        <>
          <p className={styles.subtitle}>I tuoi contratti:</p>

          {contratti.length === 0 ? (
            <>
            <p className={styles.noContracts}>Non hai ancora nessun contratto salvato, crealo adesso.</p>
            <button className={styles.addCardButton} onClick={openAddPopup}>Aggiungi un contratto</button>
            </>
          ) : (
            <div className={styles.grid}>
              {visibleContracts.map((contratto) => (
                <ContractCard
                  key={contratto.id}
                  contratto={contratto}
                  onEdit={openChangePopup}
                  onDelete={openDeletePopup}
                />
              ))}
                <button className={styles.addCardPlus} onClick={openAddPopup}>
                  +
                </button>
            </div>
          )}

          <div className={styles.loadMoreBtnContainer}>
             {hasNextPage && (
            <button className={styles.loadMoreBtn} onClick={fetchNextPage} disabled={isFetchingNextPage}>
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
        />
      )}

      {isDeletePopupVisible && (
        <PopupDeleteContract
          contrattoId={selectedContract?.id}
          onClose={closeDeletePopup}
        />
      )}     
    </div>
  );
}
