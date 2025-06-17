import { useReducer } from 'react';

// Stato iniziale
const initialState = {
  // Stati per popup
  popupMode: 'add', // 'add' | 'edit'
  isAddAndChangePopupVisible: false,
  isDeletePopupVisible: false,
  selectedContract: null,
  
  // Stati per toast
  toast: {
    type: '', // 'new' | 'edited' | 'deleted'
    visible: false,
    contractId: null // usato solo se type==='new'
  },
  
  // Stati per evidenziazione
  highlightedId: null,
  highlightedType: null
};

// Reducer per gestire tutti gli stati UI
const uiReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_ADD_POPUP':
      return {
        ...state,
        popupMode: 'add',
        selectedContract: null,
        isAddAndChangePopupVisible: true
      };
      
    case 'OPEN_EDIT_POPUP':
      return {
        ...state,
        popupMode: 'edit',
        selectedContract: action.payload,
        isAddAndChangePopupVisible: true
      };
      
    case 'OPEN_DELETE_POPUP':
      return {
        ...state,
        selectedContract: action.payload,
        isDeletePopupVisible: true
      };
      
    case 'CLOSE_ADD_AND_CHANGE_POPUP':
      return {
        ...state,
        isAddAndChangePopupVisible: false
      };
      
    case 'CLOSE_DELETE_POPUP':
      return {
        ...state,
        isDeletePopupVisible: false
      };
      
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          type: action.payload.type,
          visible: true,
          contractId: action.payload.contractId || null
        }
      };
      
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: {
          ...state.toast,
          visible: false
        }
      };
      
    case 'SET_HIGHLIGHT':
      return {
        ...state,
        highlightedId: action.payload.id,
        highlightedType: action.payload.type
      };
      
    case 'CLEAR_HIGHLIGHT':
      return {
        ...state,
        highlightedId: action.payload.id === state.highlightedId ? null : state.highlightedId,
        highlightedType: action.payload.id === state.highlightedId ? null : state.highlightedType
      };
      
    default:
      return state;
  }
};

// Custom hook useUIManager
export const useUI = () => {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  
  // Metodi per gestire i popup
  const openAddPopup = () => {
    dispatch({ type: 'OPEN_ADD_POPUP' });
  };
  
  const openChangePopup = (contract) => {
    dispatch({ type: 'OPEN_EDIT_POPUP', payload: contract });
  };
  
  const openDeletePopup = (contract) => {
    dispatch({ type: 'OPEN_DELETE_POPUP', payload: contract });
  };
  
  const closeAddAndChangePopup = () => {
    dispatch({ type: 'CLOSE_ADD_AND_CHANGE_POPUP' });
  };
  
  const closeDeletePopup = () => {
    dispatch({ type: 'CLOSE_DELETE_POPUP' });
  };
  
  // Metodi per gestire i toast
  const showToast = (type, contractId = null) => {
    dispatch({ 
      type: 'SHOW_TOAST', 
      payload: { type, contractId } 
    });
  };
  
  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };
  
  // Metodi per gestire l'evidenziazione
  const setHighlight = (id, type) => {
    dispatch({ 
      type: 'SET_HIGHLIGHT', 
      payload: { id, type } 
    });
  };
  
  const clearHighlight = (id) => {
    dispatch({ 
      type: 'CLEAR_HIGHLIGHT', 
      payload: { id } 
    });
  };
  
  // Metodi combinati per gestire i flussi completi
  const handleAddOrEditSuccess = (newId, actionType) => {
    // Imposto evidenziazione
    setHighlight(newId, actionType);
    
    // Mostro toast
    showToast(actionType, actionType === 'new' ? newId : null);
  };
  
  const handleDeleteSuccess = (deletedId) => {
    // Rimuovo eventuale evidenza
    clearHighlight(deletedId);
    
    // Mostro toast di tipo 'deleted'
    showToast('deleted');
  };
  
  return {
    // Stati
    popupMode: state.popupMode,
    isAddAndChangePopupVisible: state.isAddAndChangePopupVisible,
    isDeletePopupVisible: state.isDeletePopupVisible,
    selectedContract: state.selectedContract,
    toast: state.toast,
    highlightedId: state.highlightedId,
    highlightedType: state.highlightedType,
    
    // Metodi per popup
    openAddPopup,
    openChangePopup,
    openDeletePopup,
    closeAddAndChangePopup,
    closeDeletePopup,
    
    // Metodi per toast
    showToast,
    hideToast,
    
    // Metodi per evidenziazione
    setHighlight,
    clearHighlight,
    
    // Metodi combinati
    handleAddOrEditSuccess,
    handleDeleteSuccess
  };
};