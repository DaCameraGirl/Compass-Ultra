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

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  return (
    <main className="legal-page">
      <a href="/" className="legal-back">Compass Ultra</a>
      <section>
        <h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
        <p>
          This page is a launch-ready placeholder for Compass Ultra. Replace it with counsel-reviewed
          legal copy before paid acquisition or enterprise procurement.
        </p>
        <p>
          Questions: <a href="mailto:hello@compassultra.com">hello@compassultra.com</a>
        </p>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: (window.location.hostname === 'localhost' ? window.location.origin : 'https://compassultra.com') + '/app',
        audience,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<App />} />
          <Route path="/app/*" element={<App />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
