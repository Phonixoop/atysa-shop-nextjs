import { useState, createContext, useContext } from "react";
import { jsonify } from "utils";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  async function requestCode({ phonenumber }) {
    const result = await fetch("/api/auth/send-verification-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phonenumber }),
    });
    const data = await result.json();
    return data;
  }
  async function login({ phonenumber, verificationCode }) {
    const result = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phonenumber, verificationCode }),
    });
    const data = await result.json();
    if (!result.error) {
      setUser(data);
    }
    return data;
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, requestCode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
