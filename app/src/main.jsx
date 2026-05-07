import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LandingPage from './LandingPage.jsx';
import './styles.css';

const domain   = import.meta.env.VITE_AUTH0_DOMAIN   || 'dev-dacameragirl.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'q2TOUmYqRvhQFW4kK5qqogrwJMG0R4w1';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE  || 'https://api.compass-ultra.com';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/app',
        audience,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<App />} />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
