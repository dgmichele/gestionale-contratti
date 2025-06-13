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
      api
        .get('/me')
        .then((res) => setUser(res.data))
        .catch((error) => {
          if (error?.response?.status === 401) {
          // Token non valido, quindi effettuo il logout
          logout('È scaduto il login, per favore autenticati di nuovo');
        }
      })
        .finally(() => setLoading(false)); 
    } else {
      setLoading(false);
    }
  }, []);

  const register = async ({ nome, email, password }) => {
    const response = await api.post('/register', { nome, email, password });
    return response.data;
  };

  const login = async ({ email, password }) => {
    const response = await api.post('/login', { email, password });

    const { access_token, refresh_token } = response.data;

    // Salva entrambi i token nel localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    // Dopo aver settato il token, possiamo ottenere l'utente
    const me = await api.get('/me');
    setUser(me.data);
    navigate('/');
  };

  const logout = async (message = null) => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        await api.post('/logout'); // blacklista il refresh_token
      }
    } catch (error) {
      console.warn('Errore nel logout sul server!', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token'); // rimuovilo dal localStorage
      setUser(null);
      queryClient.clear();

      if (message) setLogoutMessage(message);
      navigate('/login');
    }
  };

  return {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
    logoutMessage,
    register
  };
}
