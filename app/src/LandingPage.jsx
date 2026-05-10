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
    description: 'Provider-flexible ship/no-ship assessment with specific flag keys called out, dependency gap analysis, and concrete remediation steps before you deploy.',
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
    title: 'Load the release state',
    description: 'Import LaunchDarkly, Statsig, Firebase Remote Config, or any JSON export. Compass Ultra turns scattered flags into one reviewable release.',
  },
  {
    number: '02',
    title: 'Find what can break',
    description: 'Policy gates and AI analysis call out dependency gaps, risky rollouts, missing approvals, expired flags, and context-specific surprises.',
  },
  {
    number: '03',
    title: 'Share the proof',
    description: 'Compare snapshots, export the runbook, and hand your team a clear ship, hold, or fix-first decision before production changes.',
  },
];

const DEMO_TOUR_STEPS = [
  'Toggle a release flag',
  'Watch policy gates update',
  'Run AI analysis',
  'Compare and export proof',
];

const PRICING = [
  {
    name: 'Free', price: '$0', period: 'forever', color: '#3d4451', highlight: false,
    features: ['3 saved snapshots', 'Local workspace', 'PDF runbook export', 'Flag evaluation engine', 'Policy checks'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$199', period: 'per month', color: '#58a6ff', highlight: false,
    features: ['7-day full-feature trial', 'Everything in Free', 'Unlimited snapshots', 'Cloud save & sync', 'Shareable public links', 'Snapshot diff viewer', 'AI risk analyzer'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Team', price: '$499', period: 'per month', color: '#3fb950', highlight: true,
    features: ['7-day full-feature trial', 'Everything in Pro', 'Flag expiration alerts', 'Team RBAC', 'Slack workflow payloads', 'Audit log export', 'Multi-workspace', 'Org management'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise', price: 'Contact sales', period: '', color: '#bc8cff', highlight: false,
    features: ['Everything in Team', 'SSO / SAML', 'Custom security review', 'Real-time collaboration', 'SLA guarantee', 'Dedicated onboarding'],
    cta: 'Contact Sales',
  },
];

const BUILT_FOR = ['LaunchDarkly', 'Unleash', 'Flagsmith', 'OpenFeature', 'Statsig', 'Firebase', 'Any JSON'];

const TRUST_SIGNALS = [
  {
    title: 'Blocked release demo',
    detail: 'Demo workspace ships with one unresolved policy violation and rollout warnings so teams can inspect the decision path immediately.',
  },
  {
    title: 'Audit-ready exports',
    detail: 'Runbooks, audit logs, snapshot diffs, and integration payloads are generated from the same release state.',
  },
  {
    title: 'Local-first review loop',
    detail: 'Try the release control room without an account, then connect live providers when the team is ready.',
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

const TOUR_STEPS = [
  {
    title: 'Change flag',
    eyebrow: 'Step 1',
    detail: 'Inspect checkout.new_flow and catch the risky EU dependency before launch.',
    badge: 'HIGH',
  },
  {
    title: 'Run AI analysis',
    eyebrow: 'Step 2',
    detail: 'The risk engine reviews the full flag workspace and returns a ship/no-ship assessment.',
    badge: 'WITH CAUTION',
  },
  {
    title: 'Review snapshot diff',
    eyebrow: 'Step 3',
    detail: 'Compare the release checkpoint against the last stable production snapshot.',
    badge: '4 CHANGES',
  },
  {
    title: 'Export PDF',
    eyebrow: 'Step 4',
    detail: 'Generate the release runbook with rollback notes, owners, and gate results.',
    badge: 'READY',
  },
];

function ProductTour() {
  const [step, setStep] = useState(0);
  const active = TOUR_STEPS[step];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((current) => (current + 1) % TOUR_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lp-product-tour" aria-label="Compass Ultra product walkthrough">
      <div className="lp-tour-screen">
        <div className="lp-tour-bar">
          <span className="lp-dot lp-dot--red" />
          <span className="lp-dot lp-dot--yellow" />
          <span className="lp-dot lp-dot--green" />
          <span>Compass Ultra product tour</span>
          <strong>0:{String((step + 1) * 12).padStart(2, '0')}</strong>
        </div>
        <div className="lp-tour-stage">
          <div className="lp-tour-left">
            <div className={`lp-tour-flag ${step === 0 ? 'is-active' : ''}`}>
              <span>checkout.new_flow</span>
              <strong>85% rollout</strong>
            </div>
            <div className={`lp-tour-flag ${step === 1 ? 'is-active' : ''}`}>
              <span>AI risk analyzer</span>
              <strong>Risk review</strong>
            </div>
            <div className={`lp-tour-flag ${step === 2 ? 'is-active' : ''}`}>
              <span>Snapshot diff</span>
              <strong>prod vs release</strong>
            </div>
            <div className={`lp-tour-flag ${step === 3 ? 'is-active' : ''}`}>
              <span>PDF runbook</span>
              <strong>CAB-ready export</strong>
            </div>
          </div>
          <div className="lp-tour-main">
            <div className="lp-tour-kicker">{active.eyebrow}</div>
            <h3>{active.title}</h3>
            <p>{active.detail}</p>
            <span className={`lp-tour-badge lp-tour-badge--${step}`}>{active.badge}</span>
            <div className="lp-tour-progress">
              {TOUR_STEPS.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={index === step ? 'is-active' : ''}
                  onClick={() => setStep(index)}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          </div>
          <div className="lp-tour-side">
            {step === 0 && (
              <>
                <AlertTriangle size={18} />
                <strong>Dependency blocked</strong>
                <span>payments.v2 disabled for EU users</span>
              </>
            )}
            {step === 1 && (
              <>
                <Brain size={18} />
                <strong>AI recommendation</strong>
                <span>Fix 2 blockers before shipping</span>
              </>
            )}
            {step === 2 && (
              <>
                <GitCompare size={18} />
                <strong>Snapshot changes</strong>
                <span>2 flags changed, 1 added, 1 removed</span>
              </>
            )}
            {step === 3 && (
              <>
                <FileDown size={18} />
                <strong>Runbook exported</strong>
                <span>Rollback notes and policy gates included</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="lp-video-flow">
        {TOUR_STEPS.map((item, index) => (
          <React.Fragment key={item.title}>
            <span className={index === step ? 'is-active' : ''}>{item.title}</span>
            {index < TOUR_STEPS.length - 1 && <ArrowRight size={14} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

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
          <div className="dash-panel-title">Feature Flags <span className="dash-count">{DEMO_FLAGS.length}</span><span style={{marginLeft:'auto',fontSize:9,color:'#484f58',fontWeight:400,textTransform:'none',letterSpacing:0}}>click to inspect</span></div>
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
            <div className="dash-panel-title"><Brain size={12} color="#bc8cff" /> AI Risk Analyzer<span style={{marginLeft:'auto',fontSize:9,color:'#484f58',fontWeight:400,textTransform:'none',letterSpacing:0}}>preview</span></div>
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

function DashboardMockInteractive() {
  const [flags, setFlags] = useState(DEMO_FLAGS);
  const [activeFlag, setActiveFlag] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [demoAction, setDemoAction] = useState('Change a flag, then run the release review.');

  const active = flags[activeFlag] || flags[0];
  const activeCritical = flags.filter(flag => flag.enabled && flag.risk === 'high').length;
  const highRollout = flags.some(flag => flag.enabled && flag.risk === 'high' && flag.rollout > 50);
  const disabledDependency = Boolean(
    flags.find(flag => flag.key === 'checkout.new_flow')?.enabled &&
    !flags.find(flag => flag.key === 'payments.stripe_v4')?.enabled
  );
  const score = Math.max(28, 96 - activeCritical * 14 - (highRollout ? 12 : 0) - (disabledDependency ? 16 : 0));
  const riskColor = score >= 70 ? '#3fb950' : score >= 40 ? '#e3b341' : '#f85149';
  const riskLevel = score >= 75 ? 'LOW' : score >= 55 ? 'MEDIUM' : 'HIGH';
  const riskTone = riskLevel.toLowerCase();

  const policyChecks = [
    { label: 'Change ticket attached', pass: true },
    { label: 'Approvers assigned', pass: true },
    { label: 'Expiration dates set', pass: !flags.some(flag => flag.enabled && flag.risk !== 'low') },
    { label: 'Canary limits respected', pass: !highRollout },
    { label: 'No dependency gaps', pass: !disabledDependency },
    { label: 'No production overrides', pass: true },
  ];

  const toggleFlag = (index) => {
    setFlags(current => current.map((flag, i) => i === index ? { ...flag, enabled: !flag.enabled } : flag));
    setActiveFlag(index);
    setShowResult(false);
    setDemoAction('Flag changed. The release score and gates updated.');
  };

  const setActiveRollout = (rollout) => {
    setFlags(current => current.map((flag, i) => i === activeFlag ? { ...flag, rollout } : flag));
    setShowResult(false);
    setDemoAction('Rollout changed. Policy gates recalculated.');
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setShowResult(false);
    setDemoAction('Risk engine is reviewing the current flag state.');
    setTimeout(() => {
      setAnalyzing(false);
      setShowResult(true);
      setDemoAction('Analysis complete. Compare snapshots or export the runbook next.');
    }, 900);
  };

  const applyScenario = (mode) => {
    setFlags(current => current.map((flag) => {
      if (mode === 'safe') {
        if (flag.risk === 'high') return { ...flag, enabled: false, rollout: 0 };
        if (flag.key === 'payments.stripe_v4') return { ...flag, enabled: true, rollout: 35 };
        return { ...flag, enabled: flag.risk !== 'low', rollout: Math.min(flag.rollout || 25, 35) };
      }
      if (flag.key === 'payments.stripe_v4') return { ...flag, enabled: false, rollout: 0 };
      if (flag.key === 'checkout.new_flow') return { ...flag, enabled: true, rollout: 90 };
      if (flag.key === 'flash_sale_engine') return { ...flag, enabled: true, rollout: 80 };
      return flag;
    }));
    setActiveFlag(mode === 'safe' ? 1 : 0);
    setShowResult(false);
    setDemoAction(mode === 'safe' ? 'Release stabilized. Run analysis to confirm.' : 'Blocker created. Run analysis to see why.');
  };

  return (
    <div className="dash-mock">
      <div className="dash-topbar">
        <div className="dash-topbar-left">
          <Compass size={14} color="#58a6ff" />
          <span>Compass Ultra</span>
          <span className="dash-badge-plan">DEMO</span>
        </div>
        <div className="dash-topbar-right">
          <span className="dash-score-label">Release Score</span>
          <span className="dash-score-value" style={{ color: riskColor }}>{score}%</span>
        </div>
      </div>

      <div className="dash-demo-rail">
        {DEMO_TOUR_STEPS.map((step, index) => (
          <span key={step} className={index <= (showResult ? 3 : analyzing ? 2 : 1) ? 'is-current' : ''}>
            {index + 1}. {step}
          </span>
        ))}
      </div>

      <div className="dash-body">
        <div className="dash-flags">
          <div className="dash-panel-title">Feature Flags <span className="dash-count">{flags.length}</span><span style={{ marginLeft: 'auto', fontSize: 9, color: '#484f58', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>toggle + inspect</span></div>
          {flags.map((flag, i) => (
            <div key={flag.key} className={`dash-flag-row ${i === activeFlag ? 'dash-flag-row--active' : ''}`} onClick={() => setActiveFlag(i)}>
              <button
                type="button"
                className={`dash-toggle ${flag.enabled ? 'dash-toggle--on' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFlag(i);
                }}
                aria-label={`${flag.enabled ? 'Disable' : 'Enable'} ${flag.name}`}
                aria-pressed={flag.enabled}
              />
              <div className="dash-flag-info">
                <span className="dash-flag-name">{flag.name}</span>
                <span className="dash-flag-key">{flag.key} · {flag.enabled ? `${flag.rollout}% rollout` : 'disabled'}</span>
              </div>
              <span className={`dash-risk-pill dash-risk-pill--${flag.risk}`}>{flag.risk.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="dash-right">
          <div className="dash-scenario-strip">
            <button type="button" onClick={() => applyScenario('blocked')}>Create blocker</button>
            <button type="button" onClick={() => applyScenario('safe')}>Stabilize</button>
          </div>
          <div className="dash-panel">
            <div className="dash-panel-title">Policy Gates</div>
            <div className="dash-checks">
              {policyChecks.map(check => (
                <div key={check.label} className="dash-check-row">
                  {check.pass ? <CheckCircle size={12} color="#3fb950" /> : <AlertTriangle size={12} color="#f85149" />}
                  <span style={{ color: check.pass ? '#8b949e' : '#f85149' }}>{check.label}</span>
                </div>
              ))}
            </div>
            {active && (
              <div className="dash-mini-editor">
                <span>{active.name}</span>
                <label>
                  rollout
                  <input type="range" min="0" max="100" value={active.rollout} disabled={!active.enabled} onChange={(event) => setActiveRollout(Number(event.target.value))} />
                  <strong>{active.enabled ? `${active.rollout}%` : 'off'}</strong>
                </label>
              </div>
            )}
          </div>

          <div className="dash-panel dash-ai-panel">
            <div className="dash-panel-title"><Brain size={12} color="#bc8cff" /> AI Risk Analyzer<span style={{ marginLeft: 'auto', fontSize: 9, color: '#484f58', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>interactive</span></div>
            {!showResult && !analyzing && (
              <button className="dash-analyze-btn" onClick={handleAnalyze}>
                <Zap size={12} /> Run Analysis
              </button>
            )}
            {analyzing && (
              <div className="dash-analyzing">
                <div className="dash-spinner" />
                <span>Analyzing current flag state...</span>
              </div>
            )}
            {showResult && (
              <div className="dash-ai-result">
                <div className="dash-risk-header">
                  <span className={`dash-risk-badge dash-risk-badge--${riskTone}`}>{riskLevel} RISK</span>
                  <span className="dash-with-caution">{riskLevel === 'LOW' ? 'READY' : 'WITH-CAUTION'}</span>
                </div>
                {disabledDependency && <div className="dash-finding"><span className="dash-finding-dot is-bad" /><span><strong>checkout.new_flow</strong> depends on payments.v2, which is disabled.</span></div>}
                {highRollout && <div className="dash-finding"><span className="dash-finding-dot is-warn" /><span><strong>high-risk rollout</strong> exceeds the 50% canary limit.</span></div>}
                {!disabledDependency && !highRollout && <div className="dash-finding"><span className="dash-finding-dot is-good" /><span><strong>policy gates</strong> are clear for the current demo state.</span></div>}
                <div className="dash-finding"><span className="dash-finding-dot is-info" /><span><strong>{active?.key}</strong> is selected at {active?.enabled ? `${active.rollout}% rollout` : 'disabled'}.</span></div>
                <div className="dash-next-actions">
                  <button type="button" onClick={() => setDemoAction('Snapshot Diff would compare the last safe checkpoint against this release.')}>Snapshot Diff</button>
                  <button type="button" onClick={() => setDemoAction('Runbook export would package gates, risks, and rollback steps for review.')}>Export Runbook</button>
                </div>
              </div>
            )}
            <p className="dash-demo-note">{demoAction}</p>
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
  const bookDemo = () => {
    window.location.href = 'mailto:hello@compassultra.com?subject=Book%20a%2015-min%20Compass%20Ultra%20demo';
  };

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
                Ship faster.<br />
                <span className="lp-gradient-text">Break nothing.</span>
              </h1>
              <p className="lp-hero-sub">
                Local-first React control room for feature flags, experiments, and safe production releases. Run the review, export the proof, and ship with confidence.
              </p>
              <div className="lp-hero-actions">
                <button className="lp-btn-primary lp-btn-lg" onClick={goToDemo}>
                  <Play size={15} /> Try Live Demo
                </button>
                <button className="lp-btn-ghost lp-btn-lg" onClick={goToApp}>
                  Start Free <ArrowRight size={16} />
                </button>
                <button className="lp-btn-ghost lp-btn-lg" onClick={bookDemo}>
                  Book a 15-min demo
                </button>
              </div>
              <p className="lp-hero-note">No account needed for the demo. Free forever to get started.</p>
              <div className="lp-hero-ai-card">
                <div className="lp-hero-ai-head">
                  <Brain size={16} />
                  <strong>AI Release Risk Analyzer</strong>
                  <span>HIGH RISK</span>
                </div>
                <p><strong>checkout.new_flow</strong> depends on disabled payments.v2 for EU paid users.</p>
                <ul>
                  <li>Reduce rollout to 10%</li>
                  <li>Assign production approver</li>
                  <li>Add rollback owner</li>
                </ul>
              </div>
              <div className="lp-hero-logos">
                <span>Works with</span>
                {BUILT_FOR.slice(0, 4).map((provider) => (
                  <span key={provider} className="lp-provider-pill">{provider}</span>
                ))}
              </div>
            </div>
            <div className="lp-hero-visual">
              <DashboardMockInteractive />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="lp-built-for">
        <div className="lp-container">
          <span>Built for teams already shipping with</span>
          <div className="lp-built-for-grid">
            {BUILT_FOR.map((provider) => (
              <div key={provider} className="lp-provider-logo">{provider}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {[
              { value: '8', label: 'Policy gates before deploy' },
              { value: 'AI', label: 'Risk explanation for each release' },
              { value: 'Diff', label: 'Snapshot comparison' },
              { value: 'PDF', label: 'Runbook handoff' },
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
            <h2>Try the release review loop</h2>
            <p>Change a flag, run AI analysis, compare snapshots, and export a runbook with no account required.</p>
          </div>
          <div className="lp-demo-cta-wrap">
            <div className="lp-demo-preview">
              <div className="lp-demo-preview-bar">
                <span className="lp-dot lp-dot--red" />
                <span className="lp-dot lp-dot--yellow" />
                <span className="lp-dot lp-dot--green" />
                <span className="lp-demo-preview-title">Demo Retail — Peak Sale Release · 5 flags · HIGH RISK</span>
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
                <span>AI risk analyzer calls the live backend when available</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>Snapshot diff opens with before-and-after sample releases</span>
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
          <div className="lp-video-panel">
            <ProductTour />
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
      <section className="lp-section lp-section--alt">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge">Launch Proof</div>
            <h2>Built for release teams before the launch rush</h2>
            <p>Concrete demo evidence, exportable artifacts, and a blocked production gate you can inspect before connecting live providers.</p>
          </div>
          <div className="lp-testimonials-grid">
            {TRUST_SIGNALS.map((item) => (
              <article key={item.title} className="lp-testimonial-card">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-ai-spotlight">
        <div className="lp-ai-glow" />
        <div className="lp-container">
          <div className="lp-ai-inner">
            <div className="lp-ai-text">
              <div className="lp-badge lp-badge--purple">AI Release Review</div>
              <h2>The only release tool with an AI risk analyzer built in</h2>
              <p>
                Before every deploy, Compass Ultra reviews your complete flag configuration with a provider-neutral AI risk engine. You get back a structured risk assessment with specific flag keys called out, dependency conflicts identified, compliance risks flagged, and a direct ship/no-ship recommendation.
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
            <button className="lp-btn-ghost lp-btn-lg" onClick={bookDemo}>
              Book a 15-min demo for your team
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
              <a href="https://github.com/DaCameraGirl/Compass-Ultra">GitHub</a>
              <a href="/trust">Trust</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <button className="lp-footer-app-link" onClick={goToApp}>Launch App →</button>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span>© 2026 Compass Ultra. All rights reserved.</span>
            <span>AI-assisted release risk review</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
