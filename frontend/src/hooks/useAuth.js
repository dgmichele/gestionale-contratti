import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export function useAuth() {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Oggetto utente (es. { id, nome, email })
  const [loading, setLoading] = useState(true);

  // Effetto per caricare dati utente al mount
  useEffect(() => {
    if (token) {
      api.get("/me")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (tokenFromApi) => {
    localStorage.setItem("token", tokenFromApi);
    setToken(tokenFromApi);
    navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const isAuthenticated = !!token;

  return {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
}
