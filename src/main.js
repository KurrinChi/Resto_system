import { jsx as _jsx } from "react/jsx-runtime";
// frontend/src/main.tsx
// Force rebuild - timestamp: 2025-11-22 06:00
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsx(AdminProvider, { children: _jsx(App, {}) }) }) }));
