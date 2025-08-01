import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './components/Context/CartContext.tsx';
import { AuthProvider } from './components/Context/AuthContext.tsx';
import { ScrollProvider } from './components/Context/ScrollProvider.tsx';

// import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ScrollProvider>
    {/* <GoogleOAuthProvider clientId={clientId}> */}
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
      </ScrollProvider>
    {/* </GoogleOAuthProvider> */}
  </StrictMode>,
);
