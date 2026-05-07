import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Shield, Cloud, FileDown, GitCompare, Users,
  BarChart3, Check, ArrowRight, Menu, X, Compass, Zap, Lock,
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: <Brain size={22} />, color: '#bc8cff',
    title: 'AI Risk Analyzer',
    description: 'Claude-powered ship/no-ship assessment with specific flag keys called out, dependency gap analysis, and concrete remediation steps before you deploy.',
  },
  {
    icon: <Shield size={22} />, color: '#58a6ff',
    title: 'Automated Policy Checks',
    description: '8 enterprise gates run automatically — change ticket coverage, approver assignments, expiration dates, canary limits, and dependency chain integrity.',
  },
  {
    icon: <Cloud size={22} />, color: '#58a6ff',
    title: 'Cloud Snapshots',
    description: 'Save named checkpoints of your full release state. Compare any two snapshots side by side to see exactly what changed between deploys.',
  },
  {
    icon: <FileDown size={22} />, color: '#3fb950',
    title: 'PDF Release Runbooks',
    description: 'One-click export with gate status, policy results, active evaluations, and per-flag rollback procedures. Ready for CAB submission or management review.',
  },
  {
    icon: <BarChart3 size={22} />, color: '#f78166',
    title: 'Flag Evaluation Engine',
    description: 'Evaluate every flag against real user segments — environment, plan, role, region, device. See exactly why each flag is on or off for any given user.',
  },
  {
    icon: <Users size={22} />, color: '#bc8cff',
    title: 'Team RBAC & Audit Log',
    description: 'Admin, Operator, and Viewer roles with hard-enforced permissions. Every action logged with actor, role, timestamp, and the exact gate that fired.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect Your Flag Data',
    description: 'Import from LaunchDarkly, Statsig, Firebase Remote Config, or paste any JSON export. Your full flag inventory loads in seconds.',
  },
  {
    number: '02',
    title: 'Run the Pre-Release Analysis',
    description: 'AI evaluates every flag against your user context, runs 8 policy gates, identifies dependency conflicts, and generates a complete risk assessment.',
  },
  {
    number: '03',
    title: 'Ship with Full Confidence',
    description: 'Get a clear ship/no-ship recommendation, export your PDF runbook, share the snapshot with your team, and deploy knowing you\'re covered.',
  },
];

const PRICING = [
  {
    name: 'Free', price: '$0', period: 'forever', color: '#3d4451', highlight: false,
    features: ['3 saved snapshots', 'Local workspace', 'PDF runbook export', 'Flag evaluation engine', 'Policy checks'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$49', period: 'per month', color: '#58a6ff', highlight: false,
    features: ['Unlimited snapshots', 'Cloud save & sync', 'Shareable public links', 'Snapshot diff viewer', 'All Free features'],
    cta: 'Start Pro',
  },
  {
    name: 'Team', price: '$249', period: 'per month', color: '#ffb800', highlight: true,
    features: ['Everything in Pro', 'AI risk analyzer', 'Flag expiration alerts', 'Team RBAC', 'Audit log export', 'Priority support'],
    cta: 'Start Team',
  },
  {
    name: 'Enterprise', price: '$999', period: 'per month+', color: '#bc8cff', highlight: false,
    features: ['Everything in Team', 'SSO / SAML', 'Slack bot integration', 'Real-time collaboration', 'SLA guarantee', 'Dedicated onboarding'],
    cta: 'Contact Sales',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goToApp = () => navigate('/app');

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <nav className={`lp-nav ${scrolled ? 'lp-nav--scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <Compass size={20} color="#58a6ff" />
            <span>Compass <strong>Ultra</strong></span>
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-btn-ghost" onClick={goToApp}>Log In</button>
            <button className="lp-btn-primary" onClick={goToApp}>Get Started Free</button>
          </div>
          <button className="lp-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="lp-mobile-menu">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How It Works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <button className="lp-btn-primary" style={{ width: '100%' }} onClick={goToApp}>Get Started Free</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-container">
          <div className="lp-hero-inner">
            <div className="lp-hero-text">
              <div className="lp-badge">Release Intelligence Platform</div>
              <h1 className="lp-hero-headline">
                Ship smarter.<br />
                <span className="lp-gradient-text">Every release.</span>
              </h1>
              <p className="lp-hero-sub">
                Compass Ultra gives DevOps teams AI-powered risk analysis, automated policy enforcement, and instant handoff documentation — before a single change touches production.
              </p>
              <div className="lp-hero-actions">
                <button className="lp-btn-primary lp-btn-lg" onClick={goToApp}>
                  Start for Free <ArrowRight size={16} />
                </button>
                <a href="#how" className="lp-btn-ghost lp-btn-lg">See How It Works</a>
              </div>
              <p className="lp-hero-note">Free forever. No credit card required.</p>
            </div>
            <div className="lp-hero-visual">
              <div className="lp-terminal">
                <div className="lp-terminal-bar">
                  <span className="lp-dot lp-dot--red" />
                  <span className="lp-dot lp-dot--yellow" />
                  <span className="lp-dot lp-dot--green" />
                  <span className="lp-terminal-title">AI Risk Analyzer — prod-2026.05</span>
                </div>
                <div className="lp-terminal-body">
                  <div className="lp-risk-level lp-risk--high">## RISK LEVEL: HIGH</div>
                  <br />
                  <div className="lp-terminal-label">## EXECUTIVE SUMMARY</div>
                  <div className="lp-terminal-text">3 flags require immediate attention. checkout.new_flow has an unresolved dependency on payments.v2 which is disabled for EU users (34% of traffic).</div>
                  <br />
                  <div className="lp-terminal-label">## TOP RISKS</div>
                  <div className="lp-terminal-text">🔴 checkout.new_flow depends on payments.v2 (disabled)</div>
                  <div className="lp-terminal-text">🟠 eu.gdpr_consent_v2 expires in 48 hours</div>
                  <div className="lp-terminal-text">🟡 dark_mode_v3 missing canary rollout</div>
                  <br />
                  <div className="lp-safe-to-ship">## SAFE TO SHIP? <span className="lp-caution">WITH-CAUTION</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {[
              { value: '8', label: 'Automated Policy Gates' },
              { value: 'AI', label: 'Ship / No-Ship Assessment' },
              { value: '1-click', label: 'PDF Runbook Export' },
              { value: '100%', label: 'Audit Trail Coverage' },
            ].map((s, i) => (
              <div key={i} className="lp-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge">How It Works</div>
            <h2>From flags to confidence in minutes</h2>
            <p>Three steps between your current flag state and a production deploy you can stand behind.</p>
          </div>
          <div className="lp-steps">
            {STEPS.map((step) => (
              <div key={step.number} className="lp-step">
                <div className="lp-step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge">Features</div>
            <h2>Everything your team needs before shipping</h2>
            <p>Built for the DevOps teams who can't afford a bad deploy.</p>
          </div>
          <div className="lp-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="lp-feature-card">
                <div className="lp-feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SPOTLIGHT ── */}
      <section className="lp-ai-spotlight">
        <div className="lp-ai-glow" />
        <div className="lp-container">
          <div className="lp-ai-inner">
            <div className="lp-ai-text">
              <div className="lp-badge lp-badge--purple">Powered by Claude AI</div>
              <h2>The only release tool with an AI risk analyzer built in</h2>
              <p>
                Before every deploy, Compass Ultra sends your complete flag configuration to Claude — one of the world's most advanced AI systems. You get back a structured risk assessment with specific flag keys called out, dependency conflicts identified, compliance risks flagged, and a direct ship/no-ship recommendation.
              </p>
              <ul className="lp-ai-list">
                {[
                  'Identifies flag dependency conflicts automatically',
                  'Flags SOX and HIPAA compliance risks in your rollout',
                  'Calls out specific flag keys that need attention',
                  'Generates concrete remediation actions before you ship',
                  'Ship / No-Ship / With-Caution decision — every time',
                ].map(item => (
                  <li key={item}><Check size={15} color="#bc8cff" /><span>{item}</span></li>
                ))}
              </ul>
              <button className="lp-btn-primary" onClick={goToApp}>
                Try the AI Analyzer <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <div className="lp-ai-card">
                <div className="lp-ai-card-header">
                  <Brain size={16} color="#bc8cff" />
                  <span>AI Risk Analysis</span>
                  <span className="lp-risk-tag lp-risk-tag--high">HIGH RISK</span>
                </div>
                <div className="lp-ai-card-body">
                  <div className="lp-ai-finding">
                    <span>🔴</span>
                    <span><strong>checkout.new_flow</strong> — depends on payments.v2 which is disabled for EU (34% of users)</span>
                  </div>
                  <div className="lp-ai-finding">
                    <span>🟠</span>
                    <span><strong>eu.gdpr_consent_v2</strong> — expires in 48 hours, no renewal ticket attached</span>
                  </div>
                  <div className="lp-ai-finding">
                    <span>🟡</span>
                    <span><strong>dark_mode_v3</strong> — canaryRequired=true but rollout is set to 100%</span>
                  </div>
                </div>
                <div className="lp-ai-card-footer">
                  <span style={{ color: '#e3b341', fontWeight: 700 }}>WITH-CAUTION</span>
                  <span style={{ color: '#8b949e', fontSize: 12 }}>Fix 2 blockers before shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="lp-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge">Pricing</div>
            <h2>Simple, transparent pricing</h2>
            <p>Start free. Upgrade when your team needs more.</p>
          </div>
          <div className="lp-pricing-grid">
            {PRICING.map(tier => (
              <div
                key={tier.name}
                className={`lp-pricing-card ${tier.highlight ? 'lp-pricing-card--featured' : ''}`}
                style={{ borderColor: tier.highlight ? tier.color : undefined }}
              >
                {tier.highlight && <div className="lp-popular-badge">MOST POPULAR</div>}
                <div className="lp-pricing-name" style={{ color: tier.color }}>{tier.name}</div>
                <div className="lp-pricing-price">{tier.price}</div>
                <div className="lp-pricing-period">{tier.period}</div>
                <ul className="lp-pricing-features">
                  {tier.features.map(f => (
                    <li key={f}>
                      <Check size={12} style={{ color: tier.color, flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={tier.highlight ? 'lp-btn-primary' : 'lp-btn-outline'}
                  style={tier.highlight ? { justifyContent: 'center' } : { borderColor: tier.color, color: tier.color }}
                  onClick={goToApp}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta-banner">
        <div className="lp-cta-glow" />
        <div className="lp-container" style={{ textAlign: 'center', position: 'relative' }}>
          <h2>Ready to ship with confidence?</h2>
          <p>Stop guessing. Start shipping smart.</p>
          <button className="lp-btn-primary lp-btn-lg" onClick={goToApp}>
            Start for Free <ArrowRight size={16} />
          </button>
          <p className="lp-cta-note">Free forever. No credit card required.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div className="lp-logo">
                <Compass size={18} color="#58a6ff" />
                <span>Compass <strong>Ultra</strong></span>
              </div>
              <p>Release intelligence for teams who can't afford to guess.</p>
            </div>
            <div className="lp-footer-links">
              <a href="#features">Features</a>
              <a href="#how">How It Works</a>
              <a href="#pricing">Pricing</a>
              <button className="lp-footer-app-link" onClick={goToApp}>Launch App →</button>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Compass Ultra. All rights reserved.</span>
            <span>Powered by Claude AI</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
