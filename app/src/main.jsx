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

function TrustPage() {
  return (
    <main className="legal-page trust-page">
      <a href="/" className="legal-back">Compass Ultra</a>
      <section>
        <h1>Security & Trust</h1>
        <p>
          Compass Ultra is built as a release review layer. It is designed to inspect feature flag
          state, generate risk evidence, and support deploy decisions without requiring write access
          to your flag provider by default.
        </p>
        <div className="trust-grid">
          <article>
            <h2>Read-only by default</h2>
            <p>Provider sync should use read-only tokens or JSON exports. Compass does not need provider write permissions for release checks.</p>
          </article>
          <article>
            <h2>Token handling</h2>
            <p>Secrets belong in backend environment variables, GitHub Actions secrets, or provider vaults. Do not paste provider secrets into public browser sessions.</p>
          </article>
          <article>
            <h2>CI release gate</h2>
            <p>The GitHub Action calls the backend risk-check API with `COMPASS_API_KEY` and fails deploy workflows when risk meets the configured threshold.</p>
          </article>
          <article>
            <h2>Audit evidence</h2>
            <p>Risk checks return timestamped JSON and Markdown evidence with decision, risk, findings, actions, flags, release metadata, and audit history.</p>
          </article>
          <article>
            <h2>Data retention</h2>
            <p>Local workspaces stay in the browser. Cloud snapshots are stored only when a logged-in user saves them. Snapshot deletion is supported from the app.</p>
          </article>
          <article>
            <h2>Access control</h2>
            <p>Auth0 protects accounts. In-app RBAC separates admin, approver, operator, and viewer release roles for workspace actions.</p>
          </article>
        </div>
        <p>
          Questions or deletion requests: <a href="mailto:hello@compassultra.com">hello@compassultra.com</a>
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
          <Route path="/trust" element={<TrustPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
