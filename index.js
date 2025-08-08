// main.jsx (Vite) or index.js (Create React App)
import React from 'react';
import ReactDOM from 'react-dom/client'; // or 'react-dom' for CRA
import App from './App'; // ✅ Should be default export

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
