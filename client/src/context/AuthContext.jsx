import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser, saveAuth, clearAuth } from "../utils/storage.js";
import { fetchMe, login as apiLogin, register as apiRegister } from "../api/authApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!user) return;
      try {
        const { data } = await fetchMe();
        setUser(data);
        saveAuth(localStorage.getItem("chat_token"), data);
      } catch {
        logout();
      }
    };
    init();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const { data } = await apiLogin(username, password);
      saveAuth(data.token, data.user);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, password) => {
    setLoading(true);
    try {
      const { data } = await apiRegister(username, password);
      saveAuth(data.token, data.user);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || "Register failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
