import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthUI } from "../hooks/useAuthUI";
import logo from '../asset/images/Logo.webp';
import styles from '../asset/css/LoginPage.module.css';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const {
    email,
    password,
    error,
    loading,
    timeoutMessage,
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
      await login({ email, password });
      handleAuthSuccess();
      // console.log("✅ Login riuscito!");
    } catch (err) {
      console.error("❌ Errore login:", err);
      const errorMessage = err.response?.data?.message || "Errore durante il login.";
      handleAuthError(errorMessage);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <img className={styles.logo} src={logo} alt="logo" />
          <h1>Accedi</h1>
          <p>Gestisci i tuoi contratti in un unico posto.</p>

          <form onSubmit={handleSubmit}>
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
              Accedi
            </button>
          </form>

          <p className={styles.auth}>
            {loading && !timeoutMessage && getStatusMessage('login')}
            {loading && timeoutMessage && getStatusMessage('login')}
          </p>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            Non hai un account? <Link to="/register">Registrati!</Link>
          </p>
        </div>
      </div>

      <footer>
        <p>© {new Date().getFullYear()} Bich Immobiliare. Tutti i diritti riservati.</p>
      </footer>
    </>
  );
}