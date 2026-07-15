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
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

interface NextAuthSession {
  user?: {
    id?: string | number;
    name?: string | null;
    email?: string | null;
    isAdmin?: boolean;
  };
}

const AUTH_USER_KEY = 'auth_user';
const AUTH_MODE_KEY = 'auth_mode';

const sessionToUser = (session: NextAuthSession): User | null => {
  if (!session.user?.email) return null;
  return {
    id: Number(session.user.id) || 0,
    name: session.user.name || null,
    email: session.user.email,
    role: session.user.isAdmin ? 'admin' : 'user',
  };
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [hasNextAuthSession, setHasNextAuthSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      const savedUser = localStorage.getItem(AUTH_USER_KEY);
      const savedToken = getToken();

      if (savedUser && savedToken) {
        try {
          if (!cancelled) {
            setUser(JSON.parse(savedUser));
            setTokenState(savedToken);
            setIsLoading(false);
          }
          return;
        } catch {
          removeToken();
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }

      try {
        const session = await api.get<NextAuthSession>('/auth/session', { noAuth: true });
        const sessionUser = sessionToUser(session);
        if (sessionUser && !cancelled) {
          setUser(sessionUser);
          setHasNextAuthSession(true);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
          localStorage.setItem(AUTH_MODE_KEY, 'nextauth');
        } else if (!cancelled) {
          localStorage.removeItem(AUTH_MODE_KEY);
          if (!savedToken) localStorage.removeItem(AUTH_USER_KEY);
        }
      } catch {
        // A failed session probe must not block regular email/password login.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) {
      document.cookie = `webmns_ref=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    }

    void restoreSession();
    return () => { cancelled = true; };
  }, []);

  // Listen for forced logout (401)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setTokenState(null);
      setHasNextAuthSession(false);
      localStorage.removeItem(AUTH_MODE_KEY);
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
      setHasNextAuthSession(false);
      setUser(data.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(AUTH_MODE_KEY, 'jwt');

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { csrfToken } = await api.get<{ csrfToken: string }>('/auth/csrf', { noAuth: true });
      if (!csrfToken) throw new Error('Google sign-in is unavailable');

      const callbackUrl = new URL(window.location.href);
      callbackUrl.searchParams.delete('error');
      callbackUrl.searchParams.set('auth', 'google');

      const response = await fetch('/api/auth/signin/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Auth-Return-Redirect': '1',
        },
        body: new URLSearchParams({
          csrfToken,
          callbackUrl: callbackUrl.toString(),
          json: 'true',
        }),
      });

      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Google sign-in is unavailable');
      }

      window.location.assign(data.url);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
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
        setHasNextAuthSession(false);
        setUser(data.user);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(AUTH_MODE_KEY, 'jwt');
      }

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    if (hasNextAuthSession || localStorage.getItem(AUTH_MODE_KEY) === 'nextauth') {
      try {
        const { csrfToken } = await api.get<{ csrfToken: string }>('/auth/csrf', { noAuth: true });
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Return-Redirect': '1',
          },
          body: new URLSearchParams({
            csrfToken,
            callbackUrl: window.location.origin,
            json: 'true',
          }),
        });
      } catch {
        // Local state is still cleared so the user is never trapped in the app.
      }
    }

    removeToken();
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_MODE_KEY);
    setUser(null);
    setTokenState(null);
    setHasNextAuthSession(false);
  }, [hasNextAuthSession]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && (!!token || hasNextAuthSession),
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
