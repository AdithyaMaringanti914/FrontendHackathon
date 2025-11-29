"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type AuthUser = { email: string; name?: string } | null;

type AuthContextType = {
  currentUser: AuthUser;
  login: (email: string) => void;
  logout: () => void;
  signup: (email: string, name?: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const login = (email: string) => {
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u: any) => u.email === email);
    if (found) {
      const user = { email: found.email, name: found.name };
      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
    }
  };

  const signup = (email: string, name?: string) => {
    const usersRaw = localStorage.getItem("users");
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const exists = users.some((u: any) => u.email === email);
    if (exists) return;
    const newUsers = [...users, { email, name }];
    localStorage.setItem("users", JSON.stringify(newUsers));
    const user = { email, name };
    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

