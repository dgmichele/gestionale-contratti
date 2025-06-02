import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      console.log("✅ Login riuscito!");
    } catch (err) {
      console.error("❌ Errore login:", err);
      setError("Credenziali non valide.");
    } finally {
    setLoading(false); 
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
        <button type="submit" disabled={loading}>Accedi</button>
      </form>

      <p>{loading && "Accesso in corso..."}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Non hai un account?{" "}
        <Link to="/register">Registrati!</Link>
      </p>
    </div>
  );
}
