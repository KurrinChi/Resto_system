// frontend/src/main.tsx
// Force rebuild - timestamp: 2025-11-22 06:00
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import { SessionProvider } from './contexts/SessionContext';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SessionProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </SessionProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
