import { useReducer, useEffect } from 'react';

// Stato iniziale
const initialState = {
  // Stati del form
  nome: "",
  email: "",
  password: "",
  
  // Stati di gestione UI
  error: null,
  loading: false,
  showServerStartMessage: false,
  timeoutMessage: false
};

// Reducer per gestire tutti gli stati UI di autenticazione
const authUIReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOME':
      return {
        ...state,
        nome: action.payload
      };
      
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload
      };
      
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SHOW_SERVER_START_MESSAGE':
      return {
        ...state,
        showServerStartMessage: true
      };
      
    case 'SHOW_TIMEOUT_MESSAGE':
      return {
        ...state,
        timeoutMessage: true
      };
      
    case 'RESET_MESSAGES':
      return {
        ...state,
        showServerStartMessage: false,
        timeoutMessage: false
      };
      
    case 'START_AUTH':
      return {
        ...state,
        error: null,
        loading: true
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false
      };
      
    case 'AUTH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case 'RESET_FORM':
      return initialState;
      
    default:
      return state;
  }
};

// Custom hook useAuthUI
export const useAuthUI = (externalLoading = null) => {
  const [state, dispatch] = useReducer(authUIReducer, initialState);
  
  // Usa loading esterno se fornito, altrimenti quello interno
  const currentLoading = externalLoading !== null ? externalLoading : state.loading;
  
  // Gestione timeout per messaggi server
  useEffect(() => {
    let startTimeout;
    let unreachableTimeout;

    if (currentLoading) {
      // Dopo 3.5sec mostriamo il messaggio di "server in avvio"
      startTimeout = setTimeout(() => {
        dispatch({ type: 'SHOW_SERVER_START_MESSAGE' });
      }, 3500);

      // Dopo 90sec consideriamo il server non raggiungibile
      unreachableTimeout = setTimeout(() => {
        dispatch({ type: 'SHOW_TIMEOUT_MESSAGE' });
      }, 90000);
    } else {
      dispatch({ type: 'RESET_MESSAGES' });
    }

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(unreachableTimeout);
    };
  }, [currentLoading]);
  
  // Metodi per gestire il form
  const setNome = (nome) => {
    dispatch({ type: 'SET_NOME', payload: nome });
  };
  
  const setEmail = (email) => {
    dispatch({ type: 'SET_EMAIL', payload: email });
  };
  
  const setPassword = (password) => {
    dispatch({ type: 'SET_PASSWORD', payload: password });
  };
  
  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };
  
  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };
  
  // Metodi combinati per gestire i flussi completi
  const startAuth = () => {
    dispatch({ type: 'START_AUTH' });
  };
  
  const handleAuthSuccess = () => {
    dispatch({ type: 'AUTH_SUCCESS' });
  };
  
  const handleAuthError = (errorMessage) => {
    dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
  };
  
  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };
  
  // Metodo per ottenere il messaggio di stato appropriato
  const getStatusMessage = (mode = 'login') => {
    // mode può essere: 'login', 'register', 'protected'
    if (!currentLoading) return null;
    
    if (state.timeoutMessage) {
      return "È passato troppo tempo... sembra che il server non stia rispondendo. Riprova più tardi.";
    }
    
    if (state.showServerStartMessage) {
      return mode === 'protected' 
        ? "Attendi 50 secondi, sto avviando il server..."
        : "Il server si sta avviando, attendi circa 50 secondi...";
    }
    
    // Messaggi di default per lo stato di loading
    switch (mode) {
      case 'register':
        return "Registrazione in corso...";
      case 'protected':
        return "🔁 Recupero i dati...";
      case 'login':
      default:
        return "Accesso in corso...";
    }
  };
  
  return {
    // Stati
    nome: state.nome,
    email: state.email,
    password: state.password,
    error: state.error,
    loading: currentLoading, // Restituisce il loading corrente (interno o esterno)
    showServerStartMessage: state.showServerStartMessage,
    timeoutMessage: state.timeoutMessage,
    
    // Metodi semplici
    setNome,
    setEmail,
    setPassword,
    setError,
    setLoading,
    
    // Metodi combinati
    startAuth,
    handleAuthSuccess,
    handleAuthError,
    resetForm,
    
    // Utility
    getStatusMessage
  };
};