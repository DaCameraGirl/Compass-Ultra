import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import LandingPage from './LandingPage.jsx';
import './styles.css';

const domain   = import.meta.env.VITE_AUTH0_DOMAIN   || 'dev-dacameragirl.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'q2TOUmYqRvhQFW4kK5qqogrwJMG0R4w1';
const audience = import.meta.env.VITE_AUTH0_AUDIENCE  || 'https://api.compass-ultra.com';

function LegalPage({ type }) {
  const isPrivacy = type === 'privacy';
  const updated = 'May 10, 2026';
  return (
    <main className="legal-page">
      <a href="/" className="legal-back">← Compass Ultra</a>
      <section>
        {isPrivacy ? (
          <>
            <h1>Privacy Policy</h1>
            <p style={{ color: '#8b949e', fontSize: 13, marginTop: 0 }}>Last updated: {updated}</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>1. Who we are</h2>
            <p>Compass Ultra is a release intelligence platform operated by DaCameraGirl ("we", "us", "our"). Contact: <a href="mailto:hello@compassultra.com">hello@compassultra.com</a></p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>2. What we collect</h2>
            <p><strong style={{ color: '#e6edf3' }}>Account data.</strong> When you sign in via Auth0 we receive your email address and Auth0 user ID.</p>
            <p><strong style={{ color: '#e6edf3' }}>Workspace data.</strong> Flag configurations, release metadata, policy check results, and audit entries you save as cloud snapshots are stored under your account.</p>
            <p><strong style={{ color: '#e6edf3' }}>Usage data.</strong> Standard server logs (IP address, browser type, pages visited, timestamps) collected by our hosting provider (Vercel) and analytics (Vercel Analytics). No third-party ad tracking.</p>
            <p><strong style={{ color: '#e6edf3' }}>Payment data.</strong> Stripe handles all payment processing. We never see or store your full card number. Stripe's privacy policy applies to payment data.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>3. How we use it</h2>
            <p>We use your data to provide and improve the service, process your subscription, send transactional emails (receipts, password resets), and respond to support requests. We do not sell your data or use it for advertising.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>4. Data storage and retention</h2>
            <p>Local workspaces stay in your browser's localStorage and never leave your device unless you explicitly save a snapshot. Cloud snapshots are stored in our database and retained until you delete them or close your account. You can delete snapshots from the app at any time.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>5. Sharing</h2>
            <p>We do not sell or share your personal data with third parties except: Auth0 (authentication), Stripe (payments), Vercel (hosting and analytics), and Render (backend API hosting). Each is bound by its own privacy policy and a data processing agreement where applicable.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>6. Your rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by emailing <a href="mailto:hello@compassultra.com">hello@compassultra.com</a>. We will respond within 30 days. If you are in the EU or UK, you have additional rights under GDPR/UK GDPR including the right to data portability and the right to lodge a complaint with your local supervisory authority.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>7. Cookies</h2>
            <p>We use only essential session cookies required for authentication. No advertising cookies. No cross-site tracking.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>8. Changes</h2>
            <p>We may update this policy. Material changes will be emailed to account holders at least 14 days before taking effect. Continued use after the effective date constitutes acceptance.</p>

            <p style={{ marginTop: 32 }}>Questions: <a href="mailto:hello@compassultra.com">hello@compassultra.com</a></p>
          </>
        ) : (
          <>
            <h1>Terms of Service</h1>
            <p style={{ color: '#8b949e', fontSize: 13, marginTop: 0 }}>Last updated: {updated}</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>1. Acceptance</h2>
            <p>By accessing or using Compass Ultra you agree to these Terms. If you are using Compass Ultra on behalf of an organization, you represent that you have authority to bind that organization.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>2. The service</h2>
            <p>Compass Ultra provides a browser-based workspace for evaluating feature flag configurations, generating release risk assessments, and producing deployment artifacts. The service is provided "as is" without warranty of any kind.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>3. Your account</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must not share accounts or allow unauthorized access. Notify us immediately at <a href="mailto:hello@compassultra.com">hello@compassultra.com</a> if you suspect unauthorized use.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>4. Acceptable use</h2>
            <p>You may not use Compass Ultra to: violate any law or regulation; transmit malicious code; attempt to gain unauthorized access to our systems or other users' data; resell or sublicense the service without written permission; or use automated scraping against our API.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>5. Subscriptions and billing</h2>
            <p>Paid plans are billed monthly or annually through Stripe. Subscriptions renew automatically unless cancelled before the renewal date. You may cancel at any time from the billing portal accessible within the app. No refunds are issued for partial billing periods unless required by applicable law.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>6. Intellectual property</h2>
            <p>Compass Ultra and its original content, features, and functionality are owned by DaCameraGirl and protected by applicable intellectual property laws. Your workspace data remains yours. You grant us a limited license to store and process it solely to provide the service.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>7. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Compass Ultra shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, arising from your use of the service. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>8. Termination</h2>
            <p>We may suspend or terminate your account for material breach of these Terms with reasonable notice. You may close your account at any time. Upon termination, your cloud data will be deleted within 30 days.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>9. Changes</h2>
            <p>We may update these Terms. We will provide at least 14 days notice of material changes via email. Continued use after the effective date constitutes acceptance.</p>

            <h2 style={{ color: '#e6edf3', fontSize: 18, margin: '28px 0 10px' }}>10. Governing law</h2>
            <p>These Terms are governed by the laws of the State of Florida, USA, without regard to conflict-of-law principles.</p>

            <p style={{ marginTop: 32 }}>Questions: <a href="mailto:hello@compassultra.com">hello@compassultra.com</a></p>
          </>
        )}
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
        <Analytics />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
);
