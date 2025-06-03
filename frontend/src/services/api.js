import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // esempio: https://gestionale-contratti-server.onrender.com
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercetta tutte le richieste e aggiunge il token JWT se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // recupera token dal localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercetta errori 401 (token scaduto)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Creiamo un errore specifico che potrà essere intercettato dal frontend
      const customError = new Error('TOKEN_EXPIRED');
      customError.name = 'TokenExpiredError';
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default api;
