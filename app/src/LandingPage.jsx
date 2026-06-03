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
    icon: <Shield size={22} />, color: '#3fb950',
    title: 'CI Release Gate',
    description: 'Block PRs that fail release policy. Add one GitHub Action and every PR gets scanned — change ticket coverage, canary limits, dependency health, expiration dates.',
    detail: [
      '🔧 How: One YAML step in your GitHub Actions workflow with a COMPASS_API_KEY secret — no infrastructure changes.',
      '🎯 What: Scans change tickets, canary rollout limits, dependency health, flag expiration, and approver coverage on every PR.',
      '⏱️ When: Fires on every pull request and merge attempt — before a single line reaches production.',
      '📍 Where: Lives in your CI pipeline; results post directly to the PR as a check status with a link to the full report.',
      '💡 Why: Catching a release policy violation at merge time costs minutes to fix. Catching it post-deploy costs hours — or your on-call rotation.',
    ],
  },
  {
    icon: <Brain size={22} />, color: '#bc8cff',
    title: 'Risk Analyzer',
    description: 'Provider-flexible ship/no-ship assessment with specific flag keys called out, dependency gap analysis, and concrete remediation steps before you deploy.',
    detail: [
      '🔧 How: Run analysis from the app or API — live AI service with a deterministic fallback so you always get a result.',
      '🎯 What: Returns a SHIP / HOLD / FIX-FIRST verdict with every affected flag key named, dependency gaps mapped, and a financial impact estimate.',
      '⏱️ When: Run it before any production deploy, especially during high-traffic windows (peak sales, launches, migrations).',
      '📍 Where: In-app dashboard, API endpoint, or embedded in your CI workflow via the GitHub Action.',
      '💡 Why: Generic risk tools don\'t know your flags. Compass Ultra reads your actual workspace state — specific keys, actual rollouts, real dependency chains.',
    ],
  },
  {
    icon: <Shield size={22} />, color: '#58a6ff',
    title: 'Automated Policy Checks',
    description: '9 enterprise gates run automatically — change ticket coverage, approver assignments, traceability, expiration dates, canary limits, dependency health, and provider readiness.',
    detail: [
      '🔧 How: Runs automatically on every workspace state change — no manual trigger needed.',
      '🎯 What: 9 gates covering change tickets, critical flag approvers, flag traceability, expiration dates, production override discipline, canary rollout limits, dependency graph, and provider/outbound hook readiness.',
      '⏱️ When: Real-time — the gate panel updates the moment you toggle a flag, change a rollout, or edit release metadata.',
      '📍 Where: Displayed as a live gate panel in the release workspace; also embedded in every PDF export and API response.',
      '💡 Why: SOX, HIPAA, and CAB review boards need evidence of process. These 9 gates are designed around what auditors and compliance teams actually ask for.',
    ],
  },
  {
    icon: <Cloud size={22} />, color: '#58a6ff',
    title: 'Cloud Snapshots & Env Diff',
    description: 'Save named checkpoints of your full release state. Compare staging vs production in one click — see exactly what flags differ, what rollouts changed, and what is missing.',
    detail: [
      '🔧 How: Hit "Save Snapshot" at any point — before a deploy, after a hotfix, or when a release is approved. Name it, describe it, share it.',
      '🎯 What: Captures every flag, rollout percentage, criticality, owner, approver, override, expiry, and dependency in a timestamped record.',
      '⏱️ When: Save before and after every deploy. Diff them to produce a change record. Share the link with your CAB or on-call team.',
      '📍 Where: Cloud-synced under your account; accessible from any device. Public share links work without a login.',
      '💡 Why: "What changed between staging and production?" is the most common question in a production incident. Now you can answer it in one click.',
    ],
  },
  {
    icon: <FileDown size={22} />, color: '#3fb950',
    title: 'PDF Release Runbooks',
    description: 'One-click export with gate status, policy results, active evaluations, and per-flag rollback procedures. Ready for CAB submission or management review.',
    detail: [
      '🔧 How: Click "Export Certificate" — jsPDF generates the full document client-side in seconds with no upload required.',
      '🎯 What: Includes release metadata, deploy window, policy gate results, active flag evaluations, risk summary, per-flag rollback instructions, approver list, and full audit history.',
      '⏱️ When: Export before your CAB review window, before a high-risk deploy, or any time you need paper trail evidence.',
      '📍 Where: Downloaded as a PDF to your device. Filename is timestamped and workspace-keyed for easy filing.',
      '💡 Why: Change advisory boards and compliance teams need a document, not a dashboard link. This gives them everything on one page.',
    ],
  },
  {
    icon: <BarChart3 size={22} />, color: '#f78166',
    title: 'Flag Evaluation Engine',
    description: 'Evaluate every flag against real user segments — environment, plan, role, region, device. See exactly why each flag is on or off for any given user.',
    detail: [
      '🔧 How: Set a user context (key, email, tenant, plan, role, region, country, device, environment) and every flag evaluates instantly against it.',
      '🎯 What: Shows the resolved value for each flag — the actual result, not the default — plus the reason: rule match, rollout bucket, override, or default value.',
      '⏱️ When: Use it during QA to verify a specific user segment, during an incident to understand who is affected, or before a deploy to check edge-case users.',
      '📍 Where: In the flag inspector panel. Switch between 3 saved context presets (Production admin, EU customer, Mobile guest) or create your own.',
      '💡 Why: "Is this flag on for EU enterprise mobile users?" used to require reading SDK source code. Now it\'s a context switch.',
    ],
  },
  {
    icon: <Zap size={22} />, color: '#ffb800',
    title: 'Embeddable Dev HUD',
    description: 'Drop <CompassUltra /> into any React app. Ctrl+Shift+D opens a full debug panel — toggle flags, inject latency, mock APIs, capture logs.',
    detail: [
      '🔧 How: Import the <CompassUltra /> React component and add it anywhere in your app tree. One component, zero config required to start.',
      '🎯 What: A full debug HUD with live flag toggles, rollout sliders, latency injection (Instant → 2G → Offline), API mocking, error log capture, build info, and experiment variant switching.',
      '⏱️ When: Leave it in staging and development. Use Ctrl+Shift+D to open it without touching your UI. Disable it by not rendering the component in production.',
      '📍 Where: Renders as a floating overlay inside your app — no separate tab, no browser extension needed.',
      '💡 Why: Devs install it for debugging and discover the platform. It\'s also a great demo tool for showing stakeholders exactly what a flag change does in real time.',
    ],
  },
  {
    icon: <Users size={22} />, color: '#bc8cff',
    title: 'Team RBAC & Audit Log',
    description: 'Admin, Approver, Operator, and Viewer roles with hard-enforced permissions. Every action logged with actor, role, timestamp, and the exact gate that fired.',
    detail: [
      '🔧 How: Assign roles per workspace member. Permissions are enforced at the action level — not just in the UI but in every write operation.',
      '🎯 What: 4 roles — Admin (full access), Approver (approve releases, view all), Operator (edit flags and release metadata), Viewer (read only). Every blocked action is logged.',
      '⏱️ When: Set roles during onboarding. The audit log runs continuously — every flag toggle, release edit, snapshot save, and blocked action is timestamped and attributed.',
      '📍 Where: Team panel in the workspace for role management. Audit log exports as part of the PDF runbook and is available as a separate JSON export on Team plan.',
      '💡 Why: When something goes wrong in production, "who changed what and when" is the first question. The audit log is the answer.',
    ],
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
    description: 'Policy gates and risk analysis call out dependency gaps, risky rollouts, missing approvals, expired flags, and context-specific surprises.',
  },
  {
    number: '03',
    title: 'Export the certificate',
    description: 'Generate the Release Readiness Certificate — score, blockers, owners, approvals, timestamp, and rollback evidence — as a CAB-ready PDF or share link.',
  },
];

const DEMO_TOUR_STEPS = [
  'Toggle a release flag',
  'Watch policy gates update',
  'Run risk analysis',
  'Compare and export proof',
];

const PRICING = [
  {
    name: 'Free', price: '$0', period: 'forever', color: '#3d4451', highlight: false,
    persona: 'Try it',
    description: 'Evaluate the release review loop on a local workspace, no account required.',
    features: ['Local workspace, no login', '3 saved snapshots', 'Flag evaluation engine', '9 policy gates', 'PDF runbook export'],
    cta: 'Get Started',
  },
  {
    name: 'Solo', price: '$49', period: 'per month', color: '#e3b341', highlight: false,
    persona: 'Solo · 1 developer',
    description: 'Independent developers and freelancers who own production flags end-to-end.',
    features: ['Everything in Free', '1 seat', 'Unlimited snapshots in the cloud', 'AI risk analyzer', 'Snapshot diff viewer', 'Flag expiration alerts', 'Shareable certificate links', 'Audit log export', '7-day trial, no credit card'],
    cta: 'Start Free Trial', plan: 'solo',
  },
  {
    name: 'Pro', price: '$149', period: 'per month', color: '#58a6ff', highlight: false,
    persona: 'Team · up to 5',
    description: 'Small teams that need to review releases together and route them through Slack.',
    features: ['Everything in Solo', 'Up to 5 team seats', 'Shared team workspace', 'Team RBAC (Admin / Operator / Viewer)', 'Slack workflow payloads', 'Jira & GitHub release handoff', 'Priority support'],
    cta: 'Start Free Trial', plan: 'pro',
  },
  {
    name: 'Team', price: '$299', period: 'per month', color: '#3fb950', highlight: true,
    badge: 'BEST FOR RELEASE TEAMS',
    persona: 'Organization · up to 15',
    plan: 'team',
    description: 'Release teams that need shared readiness scoring, CAB workflows, and audit trails.',
    features: ['Everything in Pro', 'Up to 15 team seats', 'Release Readiness scoring across workspaces', 'CAB-ready certificate workflow', 'Multi-environment snapshot diff', 'Audit log streaming', 'SSO-ready (Google + Email)'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', period: 'contact sales', color: '#bc8cff', highlight: false,
    persona: 'Org · 15+ or regulated',
    description: 'Organizations with security review, compliance, and procurement requirements.',
    features: ['Everything in Team', 'Custom seat count & org setup', 'Security review & DPA', 'SSO/SAML and SCIM', 'SLA targets', 'Dedicated onboarding', 'Custom workflows & integrations'],
    cta: 'Talk to Sales',
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

const GALLERY_IMAGES = [
  {
    icon: <Compass size={18} />,
    title: 'Release Control Room',
    headline: 'Know what can break before you ship.',
    description: 'A single dashboard for risk, flags, gates, ownership, and release readiness.',
    tags: ['Risk', 'Flags', 'Gates', 'Readiness'],
    featured: true,
  },
  {
    icon: <Brain size={18} />,
    title: 'Risk Analyzer',
    headline: 'Ship, hold, or fix first.',
    description: 'A clear assessment with blocker details and remediation steps.',
    tags: ['Decision', 'Blockers', 'Fix steps'],
  },
  {
    icon: <Shield size={18} />,
    title: 'Policy Gates',
    headline: 'Catch the missing proof.',
    description: 'Blockers, warnings, approvers, dependencies, overrides, and expiration checks.',
    tags: ['Approvers', 'Dependencies', 'Overrides'],
  },
  {
    icon: <GitCompare size={18} />,
    title: 'Snapshot Diff',
    headline: 'See exactly what changed.',
    description: 'Before-and-after release state for flags, rollouts, owners, and policies.',
    tags: ['Before', 'After', 'Change review'],
  },
  {
    icon: <FileDown size={18} />,
    title: 'PDF Runbook Export',
    headline: 'Send audit-ready release proof.',
    description: 'Clean release evidence for QA, DevOps, leadership, and compliance reviews.',
    tags: ['PDF', 'QA', 'Compliance'],
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
  { label: 'Every flag traceable', pass: true },
  { label: 'Expiration dates set', pass: false },
  { label: 'Canary limits respected', pass: false },
  { label: 'Dependencies enabled', pass: true },
  { label: 'No production overrides', pass: true },
  { label: 'Provider adapters ready', pass: true },
  { label: 'Outbound hooks configured', pass: false },
];

const TOUR_STEPS = [
  {
    title: 'Change flag',
    eyebrow: 'Step 1',
    detail: 'Inspect checkout.new_flow and catch the risky EU dependency before launch.',
    badge: 'HIGH',
  },
  {
    title: 'Run risk analysis',
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
              <span>Risk analyzer</span>
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
  const staticStatus = score >= 75 ? 'READY' : score >= 55 ? 'WITH CAUTION' : 'BLOCKED';

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
          <span className="dash-score-label">Readiness</span>
          <span className="dash-score-value" style={{ color: riskColor }}>{score}%</span>
          <span className="dash-score-status" style={{ color: riskColor }}>{staticStatus}</span>
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
            <div className="dash-panel-title"><Brain size={12} color="#bc8cff" /> Risk Analyzer<span style={{marginLeft:'auto',fontSize:9,color:'#484f58',fontWeight:400,textTransform:'none',letterSpacing:0}}>preview</span></div>
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
          <span className="dash-score-label">Readiness</span>
          <span className="dash-score-value" style={{ color: riskColor }}>{score}%</span>
          <span className="dash-score-status" style={{ color: riskColor }}>
            {riskLevel === 'LOW' ? 'READY' : riskLevel === 'MEDIUM' ? 'WITH CAUTION' : 'BLOCKED'}
          </span>
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
            <div className="dash-panel-title"><Brain size={12} color="#bc8cff" /> Risk Analyzer<span style={{ marginLeft: 'auto', fontSize: 9, color: '#484f58', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>interactive</span></div>
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

export default function LandingPage({ initialAnchor }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (!initialAnchor) return;
    const scrollToTarget = () => {
      const el = document.getElementById(initialAnchor);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    };
    // Defer one frame so layout/styles settle before scrolling.
    const raf = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(raf);
  }, [initialAnchor]);

  const goToApp = (plan) => navigate(plan ? `/app?plan=${plan}` : '/app');
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
            <a href="#certificate">Certificate</a>
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
            <a href="#certificate" onClick={() => setMenuOpen(false)}>Certificate</a>
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
              <div className="lp-badge">Release Readiness Platform</div>
              <h1 className="lp-hero-headline">
                Know if your release is safe<br />
                <span className="lp-gradient-text">before you deploy.</span>
              </h1>
              <p className="lp-hero-sub">
                Sync your feature flags, run policy gates and AI risk analysis, and export a <strong>Release Readiness Certificate</strong> — a single shareable artifact your team, CAB, and auditors can trust. <strong>Catch the bad release before production does.</strong>
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
                  <strong>Release Readiness Certificate</strong>
                  <span>HIGH RISK</span>
                </div>
                <p>Readiness <strong>62%</strong> · <strong>2 blockers unresolved</strong> · <strong>checkout.new_flow</strong> depends on disabled payments.v2 for EU paid users.</p>
                <ul>
                  <li>Reduce rollout to 10%</li>
                  <li>Assign production approver</li>
                  <li>Add rollback owner</li>
                  <li>Export CAB-ready PDF</li>
                </ul>
              </div>
              <div className="lp-hero-logos">
                <span>BYO sync/import for</span>
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
          <span>Built for teams importing or syncing from their own</span>
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
              { value: '1', label: 'Release Readiness Certificate per deploy' },
              { value: '9', label: 'Policy gates before production' },
              { value: 'AI', label: 'Risk decision: ship · with-caution · hold' },
              { value: 'CAB', label: 'Audit-ready PDF + share link' },
            ].map((s, i) => (
              <div key={i} className="lp-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELEASE READINESS CERTIFICATE ── */}
      <section id="certificate" className="lp-section lp-certificate-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge lp-badge--green">The Artifact</div>
            <h2>The Release Readiness Certificate</h2>
            <p>Sync or import your flags, run gates and risk analysis, and export one shareable artifact — proof that this release is safe to deploy.</p>
          </div>
          <div className="lp-certificate-wrap">
            <article className="lp-certificate" aria-label="Release Readiness Certificate example">
              <header className="lp-certificate-head">
                <div>
                  <div className="lp-certificate-eyebrow">Release Readiness Certificate</div>
                  <h3>Demo Retail — Peak Sale 2026.11</h3>
                  <span className="lp-certificate-meta">Issued 2026-05-17 14:32 UTC · CHG-1850 · train peak-sale-2026.11</span>
                </div>
                <div className="lp-certificate-score">
                  <span className="lp-certificate-score-label">Readiness</span>
                  <strong>72%</strong>
                  <span className="lp-certificate-status lp-certificate-status--caution">WITH CAUTION · 2 blockers unresolved</span>
                </div>
              </header>
              <div className="lp-certificate-grid">
                <section>
                  <h4>Blockers (2)</h4>
                  <ul>
                    <li><span className="lp-cert-dot is-bad" /> <strong>checkout.new_flow</strong> depends on disabled payments.v2 for EU</li>
                    <li><span className="lp-cert-dot is-bad" /> <strong>flash_sale_engine</strong> missing canary rollout cap</li>
                  </ul>
                </section>
                <section>
                  <h4>Warnings (1)</h4>
                  <ul>
                    <li><span className="lp-cert-dot is-warn" /> <strong>eu.gdpr_consent_v2</strong> expires in 48 hours, no renewal ticket</li>
                  </ul>
                </section>
                <section>
                  <h4>Owners &amp; Approvals</h4>
                  <ul>
                    <li><span>Release captain</span><strong>A. Ortiz</strong></li>
                    <li><span>Production approver</span><strong>R. Kim (pending)</strong></li>
                    <li><span>Rollback owner</span><strong>D. Patel</strong></li>
                  </ul>
                </section>
                <section>
                  <h4>Rollback Evidence</h4>
                  <ul>
                    <li><span className="lp-cert-dot is-good" /> Last safe snapshot — 2026-05-15 09:11 UTC</li>
                    <li><span className="lp-cert-dot is-good" /> Per-flag rollback steps attached</li>
                    <li><span className="lp-cert-dot is-good" /> Provider tokens read-only verified</li>
                  </ul>
                </section>
              </div>
              <footer className="lp-certificate-footer">
                <span>Signed by Compass Ultra · audit-ready PDF</span>
                <span className="lp-certificate-cab">CAB-ready export · share link · attach to PR</span>
              </footer>
            </article>
            <aside className="lp-certificate-side">
              <h3>One artifact. Every reviewer.</h3>
              <ul>
                <li><CheckCircle size={14} color="#3fb950" /><span><strong>Sync or import</strong> flags from LaunchDarkly, Statsig, Unleash, Flagsmith, OpenFeature, Firebase, or any JSON.</span></li>
                <li><CheckCircle size={14} color="#3fb950" /><span><strong>Run 9 policy gates</strong> and AI risk analysis on the current flag state.</span></li>
                <li><CheckCircle size={14} color="#3fb950" /><span><strong>Export the certificate</strong> — score, blockers, owners, approvals, timestamp, rollback evidence.</span></li>
                <li><CheckCircle size={14} color="#3fb950" /><span><strong>Share it</strong> as a PDF runbook, public link, or Slack/Jira payload for CAB review.</span></li>
              </ul>
              <div className="lp-certificate-actions">
                <button className="lp-btn-primary" onClick={goToDemo}>See it in the live demo <ArrowRight size={15} /></button>
                <button className="lp-btn-outline" onClick={goToApp}>Generate yours free</button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <section className="lp-section lp-gallery-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge">Product Gallery</div>
            <h2>See the release decision before production does</h2>
            <p>Visual proof for every part of the release review: risk, gates, diffs, and runbooks.</p>
          </div>
          <div className="lp-gallery-grid">
            {GALLERY_IMAGES.map((item) => (
              <article key={item.title} className={`lp-gallery-card ${item.featured ? 'lp-gallery-card--featured' : ''}`}>
                <div className="lp-gallery-card-head">
                  <span>{item.icon}</span>
                  <strong>{item.title}</strong>
                </div>
                <div className="lp-gallery-visual" aria-hidden="true">
                  {item.featured ? (
                    <>
                      <div className="lp-gallery-dashboard-top">
                        <span>Readiness · WITH CAUTION</span>
                        <strong>72%</strong>
                      </div>
                      <div className="lp-gallery-dashboard-bars">
                        <span style={{ width: '72%' }} />
                        <span style={{ width: '44%' }} />
                        <span style={{ width: '86%' }} />
                      </div>
                      <div className="lp-gallery-dashboard-grid">
                        <span>3 blockers unresolved</span>
                        <span>8 stale flags</span>
                        <span>2 missing owners</span>
                        <span>1 risky rollout</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="lp-gallery-mini-line" />
                      <div className="lp-gallery-mini-line is-short" />
                      <div className="lp-gallery-mini-stack">
                        <span />
                        <span />
                        <span />
                      </div>
                    </>
                  )}
                </div>
                <h3>{item.headline}</h3>
                <p>{item.description}</p>
                <div className="lp-gallery-tags">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="lp-section lp-demo-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <div className="lp-badge lp-badge--green">Live Demo</div>
            <h2>Try the release review loop</h2>
            <p>Change a flag, run risk analysis, compare snapshots, and export a runbook with no account required.</p>
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
                <span>9 automated enterprise policy checks running live</span>
              </div>
              <div className="lp-demo-feature-item">
                <CheckCircle size={16} color="#3fb950" />
                <span>Risk analyzer uses the live backend when available</span>
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
                <div className="lp-feature-card-inner">
                  {/* Front */}
                  <div className="lp-feature-card-front">
                    <div className="lp-feature-icon" style={{ color: f.color, background: `${f.color}18` }}>
                      {f.icon}
                    </div>
                    <h3>{f.title}</h3>
                    <p>{f.description}</p>
                    <span className="lp-feature-hint">hover to explore →</span>
                  </div>
                  {/* Back */}
                  <div className="lp-feature-card-back" style={{ '--feature-color': f.color }}>
                    <div className="lp-feature-back-icon" style={{ color: f.color, background: `${f.color}18` }}>
                      {f.icon}
                    </div>
                    <h3 style={{ color: f.color }}>{f.title}</h3>
                    <ul className="lp-feature-detail">
                      {f.detail.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
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
            <p>Concrete demo evidence, exportable artifacts, and a blocked production gate you can inspect before adding customer-owned provider tokens.</p>
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
              <h2>Release risk analysis built into the control room</h2>
              <p>
                Before every deploy, Compass Ultra reviews your imported or synced flag configuration with a provider-neutral AI risk engine. You get back a structured risk assessment with specific flag keys called out, dependency conflicts identified, compliance risks flagged, and a direct ship/no-ship recommendation.
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
                Try the Risk Analyzer <ArrowRight size={16} />
              </button>
            </div>
            <div>
              <div className="lp-ai-card">
                <div className="lp-ai-card-header">
                  <Brain size={16} color="#bc8cff" />
                  <span>Risk Analysis</span>
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
            <h2>Pricing for teams that can't afford messy releases</h2>
            <p>Start free. Upgrade when you need risk analysis, audit exports, Slack-ready workflows, and release-readiness reporting.</p>
          </div>
          <div className="lp-pricing-roi">
            <strong>One bad rollout costs more than a month of Compass Ultra.</strong>
            <span>Compass Ultra helps teams catch stale flags, risky releases, missing ownership, and audit gaps before they become production problems.</span>
            <div className="lp-pricing-roi-actions">
              <button className="lp-btn-primary" onClick={goToDemo}>Open Live Demo</button>
              <button className="lp-btn-outline" onClick={goToDemo}>Try Demo Workspace</button>
            </div>
          </div>
          <div className="lp-pricing-grid">
            {PRICING.map(tier => (
              <div
                key={tier.name}
                className={`lp-pricing-card ${tier.highlight ? 'lp-pricing-card--featured' : ''}`}
                style={{ borderColor: tier.highlight ? tier.color : undefined }}
              >
                {tier.highlight && <div className="lp-popular-badge">{tier.badge || 'BEST FOR TEAMS'}</div>}
                <div className="lp-pricing-name" style={{ color: tier.color }}>{tier.name}</div>
                {tier.persona && <div className="lp-pricing-persona">{tier.persona}</div>}
                <div className="lp-pricing-price">{tier.price}</div>
                <div className="lp-pricing-period">{tier.period}</div>
                <p className="lp-pricing-description">{tier.description}</p>
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
                  onClick={tier.name === 'Enterprise' ? () => window.location.href = 'mailto:hello@compassultra.com' : () => goToApp(tier.plan)}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
          <div className="lp-pricing-proof">
            <div>
              <span>Designed for teams using</span>
              <strong>React · Next.js · LaunchDarkly-style workflows · CI/CD · Slack · GitHub</strong>
            </div>
            <div>
              <span>Use Compass Ultra before</span>
              <strong>Major releases · Cleanup sprints · Flag migrations · Security reviews · Production launches</strong>
            </div>
          </div>
          <div className="lp-risk-report-preview">
            <div className="lp-risk-report-copy">
              <span className="lp-badge lp-badge--green">Example Release Readiness Certificate</span>
              <h3>Your feature flags are a release surface. Treat them like one.</h3>
              <p>Compass Ultra turns scattered flag state into a CAB-ready certificate your team can review, export, and defend.</p>
            </div>
            <div className="lp-risk-report-card">
              <div><span>Readiness</span><strong>72% · WITH CAUTION</strong></div>
              <div><span>Blockers unresolved</span><strong>3</strong></div>
              <div><span>Stale flags</span><strong>8</strong></div>
              <div><span>Missing owners</span><strong>2</strong></div>
              <div><span>Risky rollout patterns</span><strong>1</strong></div>
              <footer>CAB-ready PDF · share link · audit log</footer>
            </div>
          </div>
          <div className="lp-pricing-value">
            <div>
              <h3>Prevent release risk</h3>
              <p>Find blockers and risky rollout patterns before production.</p>
            </div>
            <div>
              <h3>Reduce flag debt</h3>
              <p>Identify stale, expired, ownerless, and forgotten flags.</p>
            </div>
            <div>
              <h3>Create audit-ready reports</h3>
              <p>Export clean summaries for engineering reviews, leadership, and compliance.</p>
            </div>
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
              <a href="https://www.compassultra.com">Website</a>
              <a href="/trust">Trust</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <button className="lp-footer-app-link" onClick={goToApp}>Launch App →</button>
            </div>
          </div>
          <div className="lp-footer-ph">
            <a href="https://www.producthunt.com/posts/compass-ultra" target="_blank" rel="noreferrer">
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=compass-ultra&theme=dark"
                alt="Compass Ultra on Product Hunt"
                style={{ height: 40 }}
              />
            </a>
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
