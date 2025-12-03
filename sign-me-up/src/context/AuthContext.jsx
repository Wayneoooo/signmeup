import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");

  // Parse token immediately to set user
  const parseJwt = (token) => {
    try {
      const base64 = token.split(".")[1];
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(() => {
    if (!storedToken) return null;
    const decoded = parseJwt(storedToken);
    return decoded
      ? { id: decoded.userId, role: decoded.role, email: decoded.email }
      : null;
  });

  const isAuthenticated = !!token;

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);

    const decoded = parseJwt(jwtToken);
    if (decoded) setUser({ id: decoded.userId, role: decoded.role, email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
