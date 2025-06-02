import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const { login, isLoggedIn, register } = useAuth(); 

  const [nome, setNome] = useState("");
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
      console.log("📦 Dati inviati:", { nome, email, password });

      // Usa la funzione centralizzata da useAuth
      await register({ nome, email, password });

      // Login automatico dopo registrazione
      await login({ email, password });

    } catch (err) {
      console.error("❌ Errore registrazione:", err);
      setError(err.response?.data?.message || "Errore durante la registrazione");
    } finally {
      setLoading(false); // evita blocco infinito
    }
  };

  return (
    <div>
      <h1>Registrazione</h1>
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

        <button type="submit" disabled={loading}>Registrati</button>
      </form>

      <p>{loading && "Registrazione in corso..."}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Hai già un account?{" "}
        <Link to="/login">Effettua il login!</Link>
      </p>
    </div>
  );
}

