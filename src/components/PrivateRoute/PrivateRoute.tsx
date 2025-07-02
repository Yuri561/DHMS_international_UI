// import { createContext, useContext, useEffect, useState } from 'react';


// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: (username: string) => void;
//   logout: () => void;
//   userEmail: string | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userName, setUserName] = useState<string | null>(null);

//   useEffect(() => {
//     const username = localStorage.getItem('username');
//     if (username) {
//       setUserName(username);
//       setIsAuthenticated(true);
//     }
//   }, []);

//   const login = (username: string) => {
//     localStorage.setItem('username', username);
//     setUserName(username);
//     setIsAuthenticated(true);
//   };

//   const logout = () => {
//     localStorage.removeItem('username');
//     setUserName(null);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout, userEmail }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
