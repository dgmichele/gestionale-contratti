import axios from "axios";

// Funzione per recuperare token dal localStorage
const getToken = () => localStorage.getItem("token");

// Crea l'istanza Axios con configurazione base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Esempio: http://localhost:3000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercettore per aggiungere il token a ogni richiesta
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// (Facoltativo) Intercettore per gestire errori globali (es: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("Errore API:", error);
    return Promise.reject(error);
  }
);

export default api;
