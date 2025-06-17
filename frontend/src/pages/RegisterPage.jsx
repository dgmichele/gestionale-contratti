import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthUI } from "../hooks/useAuthUI";
import logo from '../asset/images/Logo.webp';
import styles from '../asset/css/RegisterPage.module.css';

export default function RegisterPage() {
  const { login, isLoggedIn, register } = useAuth(); 
  const {
    nome,
    email,
    password,
    error,
    loading,
    timeoutMessage,
    setNome,
    setEmail,
    setPassword,
    startAuth,
    handleAuthSuccess,
    handleAuthError,
    getStatusMessage
  } = useAuthUI();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    startAuth();

    try {
      // console.log("📦 Dati inviati:", { nome, email, password });
      await register({ nome, email, password });
      await login({ email, password }); // login automatico
      handleAuthSuccess();
    } catch (err) {
      console.error("❌ Errore registrazione:", err);
      const errorMessage = err.response?.data?.message || "Errore durante la registrazione."
      handleAuthError(errorMessage);
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
            {loading && !timeoutMessage && getStatusMessage('register')}
            {loading && timeoutMessage && getStatusMessage('register')}
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