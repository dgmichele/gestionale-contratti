import { useAuth } from '../hooks/useAuth';
import { useContracts } from '../hooks/useContracts';

export default function HomePage() {
  const { user } = useAuth();
  const { contratti, isLoading, error } = useContracts();

  return (
    <div>
      <h1>Benvenuto, {user?.nome || 'utente'}!</h1>

      {isLoading && <p>Caricamento contratti...</p>}
      {error && <p>Errore nel caricamento dei contratti</p>}

      <h2>I tuoi contratti:</h2>

      <ul>
        {contratti.map((c) => (
          <li key={c.id}>
            {c.nome} {c.cognome} – Scade il {c.data_scadenza}
          </li>
        ))}
      </ul>

      {contratti.length === 0 && !isLoading && !error && (
        <p>Nessun contratto trovato.</p>
      )}
    </div>
  );
}
