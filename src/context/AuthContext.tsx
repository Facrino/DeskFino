import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, DashboardData } from '../types';

interface AuthContextType {
  user: User | null;
  dashboard: DashboardData | null;
  login: (user: User) => void;
  logout: () => void;
  refreshDashboard: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('finovex_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (user) {
      refreshDashboard();
    }
  }, [user]);

  const refreshDashboard = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/${user.id}/dashboard`);
      const data = await res.json();
      setDashboard(data);
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('finovex_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setDashboard(null);
    localStorage.removeItem('finovex_user');
  };

  return (
    <AuthContext.Provider value={{ user, dashboard, login, logout, refreshDashboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
