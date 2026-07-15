import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setToken, removeToken, getToken } from '@/lib/api';

export interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  referral_code?: string;
  referral_balance?: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = getToken();

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setTokenState(savedToken);
      } catch {
        removeToken();
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for forced logout (401)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setTokenState(null);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<{
        user: User;
        token: string;
        message: string;
      }>('/auth/login', { email, password }, { noAuth: true });

      setToken(data.token);
      setTokenState(data.token);
      setUser(data.user);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const ref = new URLSearchParams(window.location.search).get('ref') || undefined;
      const data = await api.post<{
        user: User;
        token: string;
        message: string;
      }>('/auth/register', { name, email, password, ref }, { noAuth: true });

      if (data.token) {
        setToken(data.token);
        setTokenState(data.token);
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem('auth_user');
    setUser(null);
    setTokenState(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
