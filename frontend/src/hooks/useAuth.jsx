import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [logoutMessage, setLogoutMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then(res => setUser(res.data))
        .catch((error) => {
          if (error.name === 'TokenExpiredError' || error.name === 'TokenBlacklistedError') {
            logout('La tua sessione è scaduta o non è più valida. Effettua di nuovo l’accesso.');
          } else {
            console.error('Errore imprevisto:', error);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = async ({ nome, email, password }) => {
  const response = await api.post('/register', { nome, email, password });
  return response.data; // puoi restituire un messaggio oppure ignorarlo
  };

  const login = async ({ email, password }) => {
    const response = await api.post('/login', { email, password });
    const { token } = response.data;

    localStorage.setItem('token', token);
    const me = await api.get('/me');
    setUser(me.data);
    navigate('/');
  };

const logout = async (message = null) => {
  const token = localStorage.getItem('token');

  try {
    if (token) {
    // invia richiesta di logout al server per blacklistare il token
    await api.post('/logout');
    }
  } catch (error) {
    console.warn('Errore nel logout sul server:', error.message);
    // anche se fallisce il logout server-side, procediamo col logout locale
  } finally {
    // logout locale
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    if (message) setLogoutMessage(message);
    navigate('/login');
  }
};

  return {
    user,
    isLoggedIn: !!user,
    loading, // esporta loading
    login,
    logout,
    logoutMessage,
    register
  };
}
