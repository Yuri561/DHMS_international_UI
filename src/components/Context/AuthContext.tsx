import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userLogin } from '../AuthFolder/AuthFiles';
import { useCart } from './CartContext';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  username: string;
  loading: boolean;
  logout: () => void;
  login: (formData: any) => Promise<boolean>;
  // fetchSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const navigate = useNavigate();
  
  // const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  
  useEffect(() => {
  
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      fetchSession();
    } else {
      setUsername('');
      setIsAuthenticated(false)
    }
  }, []);
  
  const { clearCart } = useCart()

  //verify session still exist if not clear user
  const fetchSession = async () => {
    try {
      const res = await axios.get(`${API_URL}/me`, {
        withCredentials: true,
      });
  // const fetchSession = async () => {
  //   try {
  //     const res = await axios.get(`${API_URL}/check-session`, {
  //       withCredentials: true,
  //     });

      if (res.status === 200) {
        console.log('found session', res.data);
        setIsAuthenticated(true);
        setUsername(res.data.user.username);
        localStorage.setItem('username', res.data.user.username);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        await logout();
        await clearCart();
        // navigate('/login');
        setIsAuthenticated(false);
      } else {
        console.error('Other error:', error);
      }
    } finally {
      setLoading(false);
    }
  };
  //     if (res.status === 200) {
  //       console.log('found session', res.data);
  //       setIsAuthenticated(true);
  //       setUsername(res.data.user.username);
  //       localStorage.setItem('username', res.data.user.username);
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   } catch (error: any) {
  //     if (error.response?.status === 401) {
  //       await logout();
  //       await clearCart();
  //       navigate('/login');
  //       setIsAuthenticated(false);
  //     } else {
  //       console.error('Other error:', error);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const logout = async (): Promise<void> => {
    try {
      await axios.get(`${API_URL}/logout`, { withCredentials: true });
      setIsAuthenticated(false);
      setUsername('');
      localStorage.removeItem("username")
      await clearCart();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const login = async (formData: any): Promise<boolean> => {
    try {
      const res = await userLogin(formData);
      if (res.status === 200) {
        setIsAuthenticated(true);
        setUsername(formData.username);
        localStorage.setItem('username', formData.username);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  useEffect(() => {
    // fetchSession();

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    } else {
      setUsername('');
      setIsAuthenticated(false)
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        username,
        loading,
        logout,
        login,
        // fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
