import { useState, createContext } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  function login() {
    setUser({ name: "Mark", email: "mark@devmentor.live" });
  }

  function logout() {
    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
