import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
        setApiMessage(res.data); // dovrebbe essere "API pronta per partire!"
      } catch (err) {
        console.error('Errore nella chiamata API:', err);
        setApiMessage('Errore nel collegamento al server!');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Benvenuto!</h1>
      <p>{apiMessage}</p>
    </div>
  );
}

export default App;

