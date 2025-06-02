import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // nuovo stato

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/me')
        .then(res => setUser(res.data))
        .catch(() => {
          logout(); // se token non valido
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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  return {
    user,
    isLoggedIn: !!user,
    loading, // esporta loading
    login,
    logout,
    register
  };
}
