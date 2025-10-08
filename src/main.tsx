import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      style: {
        background: '#18181b',
        color: '#cbd5e1',
        border: '1px solid #4f46e5',
      },
    }} />
  </React.StrictMode>,
);
