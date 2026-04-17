import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from "./auth/AuthContext";
import "./styles/colors.css";
import "./styles/global.css";
import App from './App';
import "./services/echo";
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
