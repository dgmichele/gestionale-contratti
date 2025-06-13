import axios from 'axios';

const api = axios.create({  
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Crea un'istanza dedicata per refresh per evitare loop
const refreshApi = axios.create({  
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Intercetta ogni richiesta per includere l'access_token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    //console.log('Aggiunto Authorization alla richiesta', config.url);
  }
  return config;
}, (error) => Promise.reject(error));


// Intercetta le risposte per gestire il refresh_token automaticamente
api.interceptors.response.use(
  response => response,
  async (error) => {
    //console.log('Interceptor risposta errore!', error?.response?.data);

    const isTokenExpired = 
      (error.response?.status === 401 &&
        (error.response?.data?.error === 'Token expired' ||
         error.response?.data?.error === 'jwt expired')) ||
      (error.response?.status === 403 &&
        error.response?.data?.message === 'Token non valido');

    if (isTokenExpired) {

      //console.log('È scaduto o non è più valido l\'access_token. Provo a rinnovarlo.');

      const originalRequest = error.config;

      if (!originalRequest._retry && !originalRequest.url?.includes('/refresh')) {
        originalRequest._retry = true;

        const refresh_token = localStorage.getItem('refresh_token'); // refresh_token dal storage
        // console.log('Refresh Token dal localStorage?', refresh_token ? 'Sì' : 'No');

        if (refresh_token) {
          try {
            // console.log('Invio richiesta di refresh a /refresh');
            const res = await refreshApi.post('/refresh', { refresh_token });

           // console.log('Risposta refresh', res?.data);
            const { access_token } = res.data;

            if (access_token) {
              // console.log('Salvo nuovo access_token nel localStorage');
              localStorage.setItem('token', access_token);
              originalRequest.headers.Authorization = `Bearer ${access_token}`;

              // console.log('Ritento la chiamata originale con il nuovo token');
              return api(originalRequest);
            }
          } catch (err) {
            console.error('Errore nel refresh!', err?.response?.data);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(err);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;