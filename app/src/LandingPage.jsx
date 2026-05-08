import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Shield, Cloud, FileDown, GitCompare, Users,
  BarChart3, Check, ArrowRight, Menu, X, Compass, Zap,
  AlertTriangle, CheckCircle, Clock, Lock, Play,
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
    name: 'Pro', price: '$99', period: 'per month', color: '#58a6ff', highlight: false,
    features: ['Unlimited snapshots', 'Cloud save & sync', 'Shareable public links', 'Snapshot diff viewer', 'All Free features'],
    cta: 'Start Pro',
  },
  {
    name: 'Team', price: '$499', period: 'per month', color: '#3fb950', highlight: true,
    features: ['Everything in Pro', 'AI risk analyzer', 'Flag expiration alerts', 'Team RBAC', 'Audit log export', 'Priority support'],
    cta: 'Start Team',
  },
  {
    name: 'Enterprise', price: 'Contact sales', period: '', color: '#bc8cff', highlight: false,
    features: ['Everything in Team', 'SSO / SAML', 'Slack bot integration', 'Real-time collaboration', 'SLA guarantee', 'Dedicated onboarding'],
    cta: 'Contact Sales',
  },
];

const DEMO_FLAGS = [
  { key: 'checkout.new_flow', name: 'New Checkout Flow', enabled: true, risk: 'high', rollout: 85 },
  { key: 'payments.stripe_v4', name: 'Stripe v4 Integration', enabled: true, risk: 'medium', rollout: 100 },
  { key: 'eu.gdpr_consent_v2', name: 'GDPR Consent v2', enabled: true, risk: 'medium', rollout: 100 },
  { key: 'dark_mode_v3', name: 'Dark Mode v3', enabled: false, risk: 'low', rollout: 0 },
  { key: 'flash_sale_engine', name: 'Flash Sale Engine', enabled: true, risk: 'high', rollout: 60 },
];

const POLICY_CHECKS = [
  { label: 'Change ticket attached', pass: true },
  { label: 'Approvers assigned', pass: true },
  { label: 'Expiration dates set', pass: false },
  { label: 'Canary limits respected', pass: false },
  { label: 'No circular dependencies', pass: true },
  { label: 'No production overrides', pass: true },
];

function DashboardMock() {
  const [activeFlag, setActiveFlag] = useState(0);
  const [score, setScore] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setScore(62), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlag(f => (f + 1) % DEMO_FLAGS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setShowResult(false);
    setTimeout(() => { setAnalyzing(false); setShowResult(true); }, 1800);
  };

  const riskColor = score >= 70 ? '#3fb950' : score >= 40 ? '#e3b341' : '#f85149';

  return (
    <div className="dash-mock">
      {/* topbar */}
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <Compass size={14} color="#58a6ff" />
          <span>Compass Ultra</span>
          <span className="dash-badge-plan">TEAM</span>
        </div>
        <div className="dash-topbar-right">
          <span className="dash-score-label">Release Score</span>
          <span className="dash-score-value" style={{ color: riskColor }}>{score}%</span>
        </div>
      </div>

      <div className="dash-body">
        {/* flag list */}
        <div className="dash-flags">
          <div className="dash-panel-title">Feature Flags <span className="dash-count">{DEMO_FLAGS.length}</span></div>
          {DEMO_FLAGS.map((flag, i) => (
            <div
              key={flag.key}
              className={`dash-flag-row ${i === activeFlag ? 'dash-flag-row--active' : ''}`}
              onClick={() => setActiveFlag(i)}
            >
              <div className={`dash-toggle ${flag.enabled ? 'dash-toggle--on' : ''}`} />
              <div className="dash-flag-info">
                <span className="dash-flag-name">{flag.name}</span>
                <span className="dash-flag-key">{flag.key}</span>
              </div>
              <span className={`dash-risk-pill dash-risk-pill--${flag.risk}`}>
                {flag.risk.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* right panel */}
        <div className="dash-right">
          {/* policy checks */}
          <div className="dash-panel">
            <div className="dash-panel-title">Policy Gates</div>
            <div className="dash-checks">
              {POLICY_CHECKS.map(c => (
                <div key={c.label} className="dash-check-row">
                  {c.pass
                    ? <CheckCircle size={12} color="#3fb950" />
                    : <AlertTriangle size={12} color="#f85149" />}
                  <span style={{ color: c.pass ? '#8b949e' : '#f85149' }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI analyzer */}
          <div className="dash-panel dash-ai-panel">
            <div className="dash-panel-title"><Brain size={12} color="#bc8cff" /> AI Risk Analyzer</div>
            {!showResult && !analyzing && (
              <button className="dash-analyze-btn" onClick={handleAnalyze}>
                <Zap size={12} /> Run Analysis
              </button>
            )}
            {analyzing && (
              <div className="dash-analyzing">
                <div className="dash-spinner" />
                <span>Analyzing 5 flags…</span>
              </div>
            )}
            {showResult && (
              <div className="dash-ai-result">
                <div className="dash-risk-header">
                  <span className="dash-risk-badge dash-risk-badge--high">HIGH RISK</span>
                  <span className="dash-with-caution">WITH-CAUTION</span>
                </div>
                <div className="dash-finding">🔴 <span><strong>checkout.new_flow</strong> depends on payments.v2 — disabled for EU (34% of users)</span></div>
                <div className="dash-finding">🟠 <span><strong>eu.gdpr_consent_v2</strong> expires in 48 hours</span></div>
                <div className="dash-finding">🟡 <span><strong>dark_mode_v3</strong> missing canary rollout config</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const goToDemo = () => navigate('/app?demo=true');

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
            <a href="#demo">Demo</a>
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
            <a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a>
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
                AI-powered risk analysis, automated policy enforcement, and instant handoff documentation — before a single change touches production.
              </p>
              <div className="lp-hero-actions">
                <button className="lp-btn-primary lp-btn-lg" onClick={goToDemo}>
                  <Play size={15} /> Try Live Demo
                </button>
                <button className="lp-btn-ghost lp-btn-lg" onClick={goToApp}>
                  Start Free <ArrowRight size={16} />
                </button>
              </div>
              <p className="lp-hero-note">No account needed for the demo. Free forever to get started.</p>
              <div className="lp-hero-logos">
                <span>Works with</span>
                <span className="lp-provider-pill">LaunchDarkly</span>
                <span className="lp-provider-pill">Statsig</span>
                <span className="lp-provider-pill">Firebase</span>
                <span className="lp-provider-pill">Any JSON</span>
              </div>
            </div>
            <div className="lp-hero-visual">
              <DashboardMock />
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

      {/* ── LIVE DEMO ── */}
      <section id="demo" className="lp-section lp-demo-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge lp-badge--green">Live Demo</div>
            <h2>See it in action — no sign-up required</h2>
            <p>Click below to open the full app preloaded with a realistic Black Friday release scenario.</p>
          </div>
          <div className="lp-demo-cta-wrap">
            <div className="lp-demo-preview">
              <div className="lp-demo-preview-bar">
                <span className="lp-dot lp-dot--red" />
                <span className="lp-dot lp-dot--yellow" />
                <span className="lp-dot lp-dot--green" />
                <span className="lp-demo-preview-title">ShopFlow — Black Friday Release · 5 flags · HIGH RISK</span>
              </div>
              <div className="lp-demo-preview-body">
                <div className="lp-demo-row lp-demo-row--bad">
                  <AlertTriangle size={13} color="#f85149" />
                  <span><strong>checkout.new_flow</strong> — dependency on payments.v2 is disabled for EU</span>
                  <span className="lp-demo-pill lp-demo-pill--high">HIGH</span>
                </div>
                <div className="lp-demo-row lp-demo-row--warn">
                  <Clock size={13} color="#e3b341" />
                  <span><strong>eu.gdpr_consent_v2</strong> — expires in 48 hours, no renewal ticket</span>
                  <span className="lp-demo-pill lp-demo-pill--med">MEDIUM</span>
                </div>
                <div className="lp-demo-row lp-demo-row--ok">
                  <CheckCircle size={13} color="#3fb950" />
                  <span><strong>payments.stripe_v4</strong> — all checks passed</span>
                  <span className="lp-demo-pill lp-demo-pill--low">LOW</span>
                </div>
                <div className="lp-demo-row lp-demo-row--bad">
                  <AlertTriangle size={13} color="#f85149" />
                  <span><strong>flash_sale_engine</strong> — missing canary rollout, no expiry date</span>
                  <span className="lp-demo-pill lp-demo-pill--high">HIGH</span>
                </div>
                <div className="lp-demo-overlay">
                  <button className="lp-demo-launch-btn" onClick={goToDemo}>
                    <Play size={18} /> Launch Full Demo
                  </button>
                  <p>Opens the real app — interactive, no login needed</p>
                </div>
              </div>
            </div>
            <div className="lp-demo-features">
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>Full flag evaluation engine with live context switching</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>8 automated enterprise policy checks running live</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>AI risk analyzer — real Claude API call, real result</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>PDF runbook export works right in the demo</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>GitHub, Jira, and Slack payload generation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="lp-section lp-section--alt">
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
      <section id="features" className="lp-section">
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
              <button className="lp-btn-primary" onClick={goToDemo}>
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
      <section id="pricing" className="lp-section lp-section--alt">
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
                  onClick={tier.name === 'Enterprise' ? () => window.location.href = 'mailto:hello@compassultra.com' : goToApp}
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
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn-primary lp-btn-lg" onClick={goToDemo}>
              <Play size={15} /> Try Live Demo
            </button>
            <button className="lp-btn-ghost lp-btn-lg" onClick={goToApp}>
              Start Free <ArrowRight size={16} />
            </button>
          </div>
          <p className="lp-cta-note">No credit card required. Demo opens instantly.</p>
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
              <a href="#demo">Demo</a>
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
