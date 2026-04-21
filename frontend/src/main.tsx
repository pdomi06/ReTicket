import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import './styles/global.css';
import { AuthProvider } from './contexts/auth/AuthContext';
import { LoadingProvider } from './contexts/loading/LoadingContext';

createRoot(document.getElementById('root')!).render(
  <LoadingProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </LoadingProvider>
);
