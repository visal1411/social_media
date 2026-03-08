import { useState, useContext, createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = window.localStorage.getItem("hh_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Mock authentication - in production, call your backend
    const mockUsers = [
      { id: 1, email: "alex@hobbyhub.com", password: "password123", name: "Alex Chen", avatar: "AC" },
      { id: 2, email: "mia@hobbyhub.com", password: "password123", name: "Mia Torres", avatar: "MT" },
    ];
    
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { id: found.id, email: found.email, name: found.name, avatar: found.avatar, token: "mock_jwt_token_" + found.id };
      setUser(userData);
      window.localStorage.setItem("hh_current_user", JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const signup = (email, password, name) => {
    // Mock signup
    if (email && password && name) {
      const newUser = { id: Date.now(), email, name, avatar: name.substring(0, 2).toUpperCase(), token: "mock_jwt_token_" + Date.now() };
      setUser(newUser);
      window.localStorage.setItem("hh_current_user", JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, error: "All fields required" };
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("hh_current_user");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
