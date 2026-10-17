import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './components/Context/CartContext.tsx';
import { AuthProvider } from './components/Context/AuthContext.tsx';
import { ScrollProvider } from './components/Context/ScrollProvider.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ScrollProvider>
      <BrowserRouter>
        <CartProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </CartProvider>
      </BrowserRouter>
      </ScrollProvider>
  </StrictMode>,
);
