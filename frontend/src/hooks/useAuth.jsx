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
          if (error.name === 'TokenExpiredError') {
          logout('La tua sessione è scaduta. Effettua di nuovo l’accesso.'); // logout chiama navigate('/login')
          } else {
          console.error('Errore imprevisto:', error);
          }
        })
        .finally(() => setLoading(false)); // fine caricamento
    } else {
      setLoading(false); // nessun token trovato
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

  const logout = (message = null) => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    if (message) setLogoutMessage(message);
    navigate('/login');
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
