import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import './styles/global.css';
import { AuthProvider } from './contexts/auth/AuthContext';
import { LoadingProvider } from './contexts/loading/LoadingProvider';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <LoadingProvider>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </LoadingProvider>
);
