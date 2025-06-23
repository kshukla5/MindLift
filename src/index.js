import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18+
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

// Use the new root API for React 18+
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}