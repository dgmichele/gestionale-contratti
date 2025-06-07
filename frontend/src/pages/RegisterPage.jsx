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

  // useEffect per attivare il messaggio dopo 5 secondi di loading
  useEffect(() => {
    let timer;

    if (loading) {
      timer = setTimeout(() => {
        setShowServerStartMessage(true);
      }, 5000);
    } else {
      setShowServerStartMessage(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("📦 Dati inviati:", { nome, email, password });

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
            {loading && (
              showServerStartMessage
                ? "🕛 Il server si sta avviando, attendi circa 50 secondi..."
                : "Registrazione in corso..."
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