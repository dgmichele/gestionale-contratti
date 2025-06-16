import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from '../asset/images/Logo.webp';
import styles from '../asset/css/RegisterPage.module.css';

export default function RegisterPage() {
  const { login, isLoggedIn, register } = useAuth(); 

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showServerStartMessage, setShowServerStartMessage] = useState(false);  // gestione server dormiente Render
  const [timeoutMessage, setTimeoutMessage] = useState(false); // gestione server irraggiungibile

  // Gestiamo i tempi di attesa per il messaggio di server in avvio e irraggiungibile
  useEffect(() => {
    let startTimeout;
    let unreachableTimeout;

    if (loading) {
      // Dopo 3.5sec mostriamo il messaggio di "server in avvio"
      startTimeout = setTimeout(() => {
        setShowServerStartMessage(true);
      }, 3500);

      // Dopo 90sec consideriamo il server non raggiungibile
      unreachableTimeout = setTimeout(() => {
        setTimeoutMessage(true);
      }, 90000);
    } else {
      setShowServerStartMessage(false);
      setTimeoutMessage(false);
    }

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(unreachableTimeout);
    };
  }, [loading]);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // console.log("📦 Dati inviati:", { nome, email, password });
      await register({ nome, email, password });
      await login({ email, password }); // login automatico

    } catch (err) {
      console.error("❌ Errore registrazione:", err);
      setError(err.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <img className={styles.logo} src={logo} alt="logo" />
          <h1>Registrati</h1>
          <p>Gestisci i tuoi contratti in un unico posto.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button className={styles.submit} type="submit" disabled={loading}>
              Registrati
            </button>
          </form>

          <p className={styles.auth}>
            {loading && !timeoutMessage && (
              showServerStartMessage
                ? "Il server si sta avviando, attendi circa 50 secondi..."
                : "Accesso in corso..."
            )}

            {loading && timeoutMessage && (
              "È passato troppo tempo... sembra che il server non stia rispondendo. Riprova più tardi."
            )}
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p>
            Hai già un account?{" "}
            <Link to="/login">Effettua il login!</Link>
          </p>
        </div>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} Bich Immobiliare. Tutti i diritti riservati.</p>
      </footer>
    </>
  );
}