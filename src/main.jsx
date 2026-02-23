import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; // ← Added this import
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Wrap the App to enable SEO document head modifications */}
        <HelmetProvider>
            <App />
        </HelmetProvider>
    </React.StrictMode>
);
