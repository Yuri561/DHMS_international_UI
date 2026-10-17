// src/components/Context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useCart } from './CartContext';
import api from '../setUpAxios';

export type SessionUser = {
  id?: string;
  username?: string;
  role?: 'admin' | 'user' | string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAuth: boolean) => void;
  username: string;
  loading: boolean;
  logout: () => Promise<void>;
  /** Returns the server user or undefined if not logged in */
  fetchSession: () => Promise<SessionUser | undefined>;
  /** Returns true if login request succeeded */
  login: (formData: { username: string; password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { clearCart } = useCart();

  const resetAuthState = useCallback(async () => {
    setIsAuthenticated(false);
    setUsername('');
    setIsAdmin(false);
    localStorage.removeItem('username');
    await clearCart();
  }, [clearCart]);

  const fetchSession = useCallback(async (): Promise<SessionUser | undefined> => {
    try {
      setLoading(true);
      const res = await api.get('/me');
      const user: SessionUser | undefined = res.data?.user ?? res.data;
      if (res.status === 200 && user) {
        setIsAuthenticated(true);
        setUsername(user.username ?? '');
        setIsAdmin((user.role ?? '') === 'admin');
        if (user.username) localStorage.setItem('username', user.username);
        return user;
      }
      await resetAuthState();
      return undefined;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        await resetAuthState();
        return undefined;
      }
      console.error('fetchSession error:', error);
      await resetAuthState();
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [resetAuthState]);

  const login = async (formData: { username: string; password: string }): Promise<boolean> => {
    try {
      const res = await api.post('/login', {
        username: formData.username.trim(),
        password: formData.password,
      });

      if (res.status === 200) {
        await fetchSession();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.get('/logout'); // 
    } catch (error) {
      console.error('Logout failed (continuing to clear state):', error);
    } finally {
      await resetAuthState();
    }
  };

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        username,
        isAdmin,
        setIsAdmin,
        loading,
        logout,
        fetchSession,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
