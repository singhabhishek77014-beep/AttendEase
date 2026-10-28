import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("attendance_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => { sessionStorage.removeItem("attendance_token"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const acceptAuth = (data) => {
    sessionStorage.setItem("attendance_token", data.token);
    setUser(data.user);
  };
  const logout = () => {
    sessionStorage.removeItem("attendance_token");
    setUser(null);
  };
  return <AuthContext.Provider value={{ user, loading, acceptAuth, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
