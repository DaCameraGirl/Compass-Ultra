import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { jsPDF } from 'jspdf';
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  Braces,
  CheckCircle2,
  Clipboard,
  Cloud,
  CloudCog,
  Download,
  BrainCircuit,
  DollarSign,
  GitCompare,
  FileDown,
  Sparkles,
  FileJson,
  Gauge,
  GitBranch,
  KeyRound,
  Link,
  ListChecks,
  ListFilter,
  LockKeyhole,
  LogIn,
  LogOut,
  Plus,
  Share2,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Moon,
  Sun,
  Trash2,
  Upload,
  UserRound,
  Users,
  Volume2,
  VolumeX,
  Webhook,
  XCircle,
} from 'lucide-react';
import { api } from './api.js';

const storageKey = 'compass-ultra-workspace-v4';

const defaultContext = {
  key: 'demo_admin_001',
  email: 'admin@example.test',
  tenant: 'demo-retail-prod',
  plan: 'enterprise',
  role: 'admin',
  region: 'us-east',
  country: 'US',
  device: 'desktop',
  environment: 'production',
};

const defaultRelease = {
  train: 'peak-sale-2026.11',
  changeTicket: 'CHG-20261120',
  incidentChannel: '#release-war-room',
  releaseCaptain: 'Release Captain',
  approver: 'Platform Approver',
  window: 'Thu 23:00-01:00 ET',
};

const releaseFieldLabels = {
  train: 'Release train',
  changeTicket: 'Change ticket',
  incidentChannel: 'Incident channel',
  releaseCaptain: 'Release captain',
  approver: 'Approver',
  window: 'Deploy window',
};

const contextFieldLabels = {
  key: 'User key',
  email: 'Email',
  tenant: 'Tenant',
  plan: 'Plan',
  role: 'Role',
  region: 'Region',
  country: 'Country',
  device: 'Device',
  environment: 'Environment',
};

const fieldLabel = (key, labels) => labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase());

const defaultTeam = {
  workspaceId: 'demo-retail-prod',
  authMode: 'Local RBAC session',
  members: [
    { id: 'admin', name: 'Admin Reviewer', email: 'admin@example.test', role: 'admin' },
    { id: 'sre', name: 'Release Approver', email: 'approver@example.test', role: 'approver' },
    { id: 'qa', name: 'QA Operator', email: 'operator@example.test', role: 'operator' },
    { id: 'viewer', name: 'Read Only Viewer', email: 'viewer@example.test', role: 'viewer' },
  ],
  activeMemberId: 'admin',
};

const defaultIntegrations = [
  { id: 'launchdarkly', name: 'LaunchDarkly', kind: 'provider', status: 'ready', endpoint: '', apiKey: '', projectKey: 'default', envKey: 'production', secretHint: 'Paste your LaunchDarkly API key to sync live', lastSync: 'sample loaded' },
  { id: 'statsig', name: 'Statsig', kind: 'provider', status: 'ready', endpoint: '', apiKey: '', secretHint: 'Paste your Statsig Console API key to sync live', lastSync: 'sample loaded' },
  { id: 'firebase', name: 'Firebase Remote Config', kind: 'provider', status: 'ready', endpoint: '', apiKey: '', projectId: '', secretHint: 'Paste your Firebase access token + project ID to sync live', lastSync: 'sample loaded' },
  { id: 'github', name: 'GitHub Issues', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'repo issue proxy or GitHub app endpoint', lastSync: 'payload ready' },
  { id: 'jira', name: 'Jira Change', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'Jira automation webhook', lastSync: 'payload ready' },
  { id: 'slack', name: 'Slack War Room', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'Slack workflow/proxy endpoint', lastSync: 'payload ready' },
];

const sampleContexts = [
  { name: 'Production admin', context: defaultContext },
  {
    name: 'EU customer',
    context: { ...defaultContext, key: 'demo_user_8842', email: 'customer-eu@example.test', tenant: 'demo-retail-eu', role: 'customer', region: 'eu-west', country: 'DE' },
  },
  {
    name: 'Mobile guest',
    context: { ...defaultContext, key: 'demo_guest_4401', email: 'guest@example.test', tenant: 'demo-retail-prod', plan: 'free', role: 'guest', region: 'us-west', device: 'mobile', environment: 'production' },
  },
];

const seedFlags = [
  {
    key: 'checkout.express_pay',
    name: 'Express checkout (Apple Pay / Google Pay)',
    owner: 'Growth',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 45,
    criticality: 'high',
    jira: 'CHG-1842',
    approver: 'Growth Lead',
    expiresAt: '2026-12-01',
    rollback: 'Disable express_pay and revert to standard checkout flow. Flush CDN cache on /checkout.',
    canaryRequired: true,
    dependencies: ['payments.stripe_v4'],
    tags: ['revenue', 'checkout', 'peak-sale'],
    rules: [{ attribute: 'device', operator: 'equals', value: 'mobile', valueWhenMatched: true }],
    source: 'LaunchDarkly',
  },
  {
    key: 'payments.stripe_v4',
    name: 'Stripe API v4 migration',
    owner: 'Payments',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'CHG-1801',
    approver: 'Finance Ops',
    expiresAt: '2026-11-30',
    rollback: 'Set payments.stripe_v4 false. Revert to v3 SDK. Replay any failed charges from dead-letter queue.',
    canaryRequired: true,
    dependencies: [],
    tags: ['payments', 'critical', 'peak-sale'],
    rules: [{ attribute: 'country', operator: 'notEquals', value: 'DE', valueWhenMatched: true }],
    source: 'Statsig',
  },
  {
    key: 'fraud.ml_scoring_v2',
    name: 'ML fraud scoring v2',
    owner: 'Trust & Safety',
    type: 'json',
    enabled: true,
    defaultValue: { model: 'rules_v1', threshold: 0.7, blockOnTimeout: false },
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'CHG-1799',
    approver: 'Security',
    expiresAt: '2026-12-31',
    rollback: 'Revert model to rules_v1 and set blockOnTimeout false.',
    canaryRequired: false,
    dependencies: [],
    tags: ['fraud', 'ml', 'security'],
    rules: [{ attribute: 'environment', operator: 'equals', value: 'production', valueWhenMatched: { model: 'xgb_v2', threshold: 0.82, blockOnTimeout: true } }],
    source: 'LaunchDarkly',
  },
  {
    key: 'inventory.realtime_sync',
    name: 'Real-time inventory sync',
    owner: 'Platform',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 60,
    criticality: 'high',
    jira: 'CHG-1823',
    approver: 'Platform Approver',
    expiresAt: '2026-11-28',
    rollback: 'Disable realtime_sync. Fall back to 5-minute polling. Alert #inventory-ops.',
    canaryRequired: true,
    dependencies: [],
    tags: ['inventory', 'peak-sale', 'platform'],
    rules: [],
    source: 'Statsig',
  },
  {
    key: 'search.ai_rankings',
    name: 'AI-powered search rankings',
    owner: 'Search',
    type: 'variant',
    enabled: true,
    defaultValue: 'keyword',
    overrideValue: null,
    rollout: 25,
    criticality: 'medium',
    jira: 'CHG-1810',
    approver: 'Search Lead',
    expiresAt: '2027-01-15',
    rollback: 'Force variant to keyword.',
    canaryRequired: false,
    dependencies: [],
    tags: ['search', 'ai', 'revenue'],
    variants: ['keyword', 'semantic', 'hybrid', 'personalized'],
    rules: [{ attribute: 'plan', operator: 'equals', value: 'enterprise', valueWhenMatched: 'personalized' }],
    source: 'Firebase',
  },
  {
    key: 'shipping.same_day',
    name: 'Same-day shipping eligibility',
    owner: 'Logistics',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 35,
    criticality: 'high',
    jira: 'CHG-1835',
    approver: 'Logistics Lead',
    expiresAt: '2026-12-26',
    rollback: 'Disable same_day flag. Show standard shipping only.',
    canaryRequired: true,
    dependencies: ['inventory.realtime_sync'],
    tags: ['shipping', 'peak-sale', 'logistics'],
    rules: [{ attribute: 'region', operator: 'equals', value: 'us-east', valueWhenMatched: true }],
    source: 'LaunchDarkly',
  },
  {
    key: 'ui.dark_mode',
    name: 'Dark mode beta',
    owner: 'Frontend',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 10,
    criticality: 'low',
    jira: 'CHG-1788',
    approver: 'Frontend Lead',
    expiresAt: '2027-03-01',
    rollback: 'Disable dark_mode. No data impact.',
    canaryRequired: false,
    dependencies: [],
    tags: ['ui', 'beta'],
    rules: [{ attribute: 'device', operator: 'equals', value: 'mobile', valueWhenMatched: true }],
    source: 'Firebase',
  },
  {
    key: 'ops.circuit_breaker',
    name: 'Global circuit breaker',
    owner: 'SRE',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 0,
    criticality: 'critical',
    jira: 'CHG-1000',
    approver: 'Platform Approver',
    expiresAt: '2027-12-31',
    rollback: 'Enable to shed load and force degraded mode across all services.',
    canaryRequired: false,
    dependencies: [],
    tags: ['sre', 'emergency', 'peak-sale'],
    rules: [],
    source: 'Local',
  },
  {
    key: 'data.gdpr_consent_v3',
    name: 'GDPR consent banner v3',
    owner: 'Legal',
    type: 'json',
    enabled: true,
    defaultValue: { version: 'v2', strictMode: false },
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'CHG-1791',
    approver: 'Privacy',
    expiresAt: '2027-12-31',
    rollback: 'Revert to v2 consent banner. Notify legal immediately.',
    canaryRequired: false,
    dependencies: [],
    tags: ['privacy', 'gdpr', 'legal'],
    rules: [{ attribute: 'country', operator: 'equals', value: 'DE', valueWhenMatched: { version: 'v3', strictMode: true } }],
    source: 'LaunchDarkly',
  },
  {
    key: 'promos.flash_sale_engine',
    name: 'Flash sale pricing engine',
    owner: 'Commerce',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'CHG-1850',
    approver: 'Finance Ops',
    expiresAt: '2026-11-30',
    rollback: 'Disable flash_sale_engine immediately. Revert prices via admin panel. Alert #commerce-ops.',
    canaryRequired: true,
    dependencies: ['payments.stripe_v4', 'inventory.realtime_sync'],
    tags: ['pricing', 'peak-sale', 'revenue', 'critical'],
    rules: [],
    source: 'Statsig',
  },
];

const samplePacks = {
  dcg: {
    label: 'Demo Retail — Peak Sale Release',
    workspaceName: 'Demo Retail — Peak Sale Command',
    flags: seedFlags,
  },
  launchdarkly: {
    label: 'LaunchDarkly import',
    workspaceName: 'LaunchDarkly production mirror',
    payload: {
      items: [
        { key: 'ld.checkout.holdback', name: 'Checkout holdback', on: true, tags: ['Growth'], fallthrough: { rollout: { variations: [{ weight: 25000 }] } } },
        { key: 'ld.search.pipeline', name: 'Search pipeline v4', on: true, tags: ['Search'], fallthrough: { rollout: { variations: [{ weight: 50000 }] } } },
        { key: 'ld.eu.privacy_banner', name: 'EU privacy banner', on: true, tags: ['Privacy'], fallthrough: { rollout: { variations: [{ weight: 100000 }] } } },
      ],
    },
  },
  statsig: {
    label: 'Statsig gates',
    workspaceName: 'Statsig experiment gate review',
    payload: {
      feature_gates: [
        { name: 'statsig_ai_triage', description: 'AI triage queue', isEnabled: true, rollout: 30 },
        { name: 'statsig_enterprise_sso', description: 'Enterprise SSO hardening', isEnabled: true, rollout: 100 },
        { name: 'statsig_invoice_pdf_v2', description: 'Invoice PDF v2', isEnabled: false, rollout: 5 },
      ],
    },
  },
  firebase: {
    label: 'Firebase config',
    workspaceName: 'Firebase mobile config review',
    payload: {
      parameters: {
        firebase_mobile_paywall: { defaultValue: { value: 'variant_b' } },
        firebase_review_prompt: { defaultValue: { value: 'true' } },
        firebase_cache_ttl: { defaultValue: { value: '900' } },
      },
    },
  },
};

const emptyDraft = {
  key: '',
  name: '',
  owner: 'Product',
  type: 'boolean',
  defaultValue: 'false',
};

let riskAudioContext;

function getRiskLevelFromAnalysis(analysis) {
  const riskMatch = analysis.match(/##\s*RISK LEVEL:\s*(LOW|MEDIUM|HIGH|CRITICAL)/i);
  return riskMatch ? riskMatch[1].toUpperCase() : '';
}

function getRiskAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!riskAudioContext) riskAudioContext = new AudioContextCtor();
  return riskAudioContext;
}

function primeRiskAudio() {
  const ctx = getRiskAudioContext();
  if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
}

function playRiskTone(level) {
  const ctx = getRiskAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const patterns = {
    LOW: [
      [660, 0.00, 0.10],
      [880, 0.14, 0.12],
    ],
    MEDIUM: [
      [440, 0.00, 0.12],
      [440, 0.18, 0.12],
    ],
    HIGH: [
      [330, 0.00, 0.10],
      [330, 0.16, 0.10],
      [330, 0.32, 0.16],
    ],
    CRITICAL: [
      [220, 0.00, 0.11],
      [180, 0.15, 0.11],
      [220, 0.30, 0.11],
      [180, 0.45, 0.16],
    ],
  };

  const start = ctx.currentTime + 0.02;
  (patterns[level] || patterns.MEDIUM).forEach(([frequency, offset, duration]) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = level === 'LOW' ? 'sine' : 'square';
    oscillator.frequency.setValueAtTime(frequency, start + offset);
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(0.045, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + duration + 0.03);
  });
}

export default function App() {
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [cloudSnapshots, setCloudSnapshots] = useState([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudNotice, setCloudNotice] = useState('');
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [snapshotDraftName, setSnapshotDraftName] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiAnalysisSource, setAiAnalysisSource] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRiskLevel, setAiRiskLevel] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [diffA, setDiffA] = useState(null);
  const [diffB, setDiffB] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [workspaceTheme, setWorkspaceTheme] = useState(() => localStorage.getItem('cu-theme') || 'dark');
  const [demoMode, setDemoMode] = useState(false);
  const [userPlan, setUserPlan] = useState(() => (
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('upgraded') || 'free'
      : 'free'
  ));
  const [upgradeNotice, setUpgradeNotice] = useState('');
  const [gateNotice, setGateNotice] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('cu-onboarded'));
  const [onboardStep, setOnboardStep] = useState(1);
  const checkoutPlanRef = useRef(
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('upgraded')
      : null
  );

  const [showKillSwitch, setShowKillSwitch] = useState(false);
  const [killToast, setKillToast] = useState('');

  const importRef = useRef(null);
  const initial = useMemo(loadWorkspace, []);
  const [workspaceName, setWorkspaceName] = useState(initial.workspaceName);
  const [context, setContext] = useState(initial.context);
  const [release, setRelease] = useState(initial.release);
  const [team, setTeam] = useState(initial.team);
  const [integrations, setIntegrations] = useState(initial.integrations);
  const [flags, setFlags] = useState(initial.flags);
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(initial.flags[0]?.key || '');
  const [draft, setDraft] = useState(emptyDraft);
  const [notice, setNotice] = useState('Saved locally');
  const [audit, setAudit] = useState(initial.audit);

  const executeKillSwitch = () => {
    const checkpoint = JSON.stringify({ workspaceName, release, team, integrations, context, flags, audit });
    localStorage.setItem('compass-ultra-emergency-checkpoint', checkpoint);

    const safeState = localStorage.getItem('compass-ultra-last-known-good');
    if (safeState) {
      try {
        const parsed = JSON.parse(safeState);
        setWorkspaceName(parsed.workspaceName || 'Workspace');
        setRelease(parsed.release || defaultRelease);
        setTeam(parsed.team || defaultTeam);
        setIntegrations(parsed.integrations || defaultIntegrations);
        setContext(parsed.context || defaultContext);
        setFlags(parsed.flags || []);
        setSelectedKey((parsed.flags && parsed.flags[0]?.key) || '');
        setAiAnalysis('');
        setAiRiskLevel('');
        record('KILL SWITCH ACTIVATED — rolled back to last known good state');
      } catch { resetWorkspace(); }
    } else {
      resetWorkspace();
    }

    const lastGoodFlags = safeState ? (JSON.parse(safeState).flags || []) : [];
    fetch(`${(import.meta.env.VITE_API_URL || 'https://compass-ultra-backend-production.up.railway.app').replace(/\/+$/, '')}/api/v1/alerts/kill-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceName,
        release,
        activeMember: activeMember?.name || 'Unknown',
        changedFlags: flags.filter(f => {
          const safe = lastGoodFlags.find(g => g.key === f.key);
          return !safe || JSON.stringify(safe) !== JSON.stringify(f);
        }).map(f => ({ key: f.key, rollout: f.rollout, enabled: f.enabled })),
      }),
    }).catch(() => {});

    setShowKillSwitch(false);
    setKillToast('Kill switch activated — rolled back to safe state. Slack notified.');
    setTimeout(() => setKillToast(''), 5000);
  };

  const saveLastKnownGood = () => {
    localStorage.setItem('compass-ultra-last-known-good', JSON.stringify({ workspaceName, release, team, integrations, context, flags, audit }));
  };

  useEffect(() => {
    const interval = setInterval(saveLastKnownGood, 30000);
    return () => clearInterval(interval);
  }, [workspaceName, release, team, integrations, context, flags, audit]);

  const finishOnboarding = () => {
    localStorage.setItem('cu-onboarded', '1');
    setShowOnboarding(false);
  };

  useEffect(() => {
    localStorage.setItem('cu-theme', workspaceTheme);
  }, [workspaceTheme]);

  const canUseAI   = demoMode || userPlan === 'pro' || userPlan === 'team';
  const canUseDiff = demoMode || userPlan === 'pro' || userPlan === 'team';
  const canExportAudit = userPlan === 'team';
  const snapshotCap = userPlan === 'free' ? 3 : Infinity;

  const requirePlan = (needed, label) => {
    setGateNotice(`${label} requires the ${needed} plan.`);
    setShowPricing(true);
    setTimeout(() => setGateNotice(''), 100);
  };

  const getPublicReturnUrl = () => (
    window.location.hostname === 'localhost' ? window.location.origin : 'https://www.compassultra.com'
  );

  const loginWithEmail = () => loginWithRedirect({
    authorizationParams: {
      connection: import.meta.env.VITE_AUTH0_CONNECTION || 'Username-Password-Authentication',
    },
  });

  const handleLogout = () => {
    checkoutPlanRef.current = null;
    setUserPlan('free');
    setCloudSnapshots([]);
    setCloudNotice('');
    setUpgradeNotice('');
    logout({ logoutParams: { returnTo: getPublicReturnUrl() } });
  };

  const selectedFlag = flags.find((flag) => flag.key === selectedKey) || flags[0];
  const activeMember = team.members.find((member) => member.id === team.activeMemberId) || team.members[0];
  const canEdit = ['admin', 'operator'].includes(activeMember?.role);
  const canAdmin = activeMember?.role === 'admin';

  const evaluations = useMemo(
    () =>
      flags.map((flag) => ({
        flag,
        result: evaluateFlag(flag, context),
      })),
    [context, flags]
  );

  const policyChecks = useMemo(() => makePolicyChecks(flags, evaluations, context, release, integrations), [context, evaluations, flags, integrations, release]);
  const releaseState = getReleaseState(policyChecks);
  const policyBlockers = policyChecks.filter((check) => check.status === 'block').length;
  const policyWarnings = policyChecks.filter((check) => check.status === 'warn').length;
  const connectedProviders = integrations.filter((item) => item.kind === 'provider' && (item.endpoint || item.apiKey)).length;
  const releaseBlockSummary = policyBlockers
    ? `Blocked because ${release.changeTicket || 'this release'} has ${policyBlockers} unresolved policy violation${policyBlockers === 1 ? '' : 's'} and ${policyWarnings} rollout warning${policyWarnings === 1 ? '' : 's'}.`
    : policyWarnings
      ? `Needs review because ${release.changeTicket || 'this release'} has ${policyWarnings} rollout warning${policyWarnings === 1 ? '' : 's'}.`
      : 'All policy gates are clear. Export the proof package before shipping.';

  const visibleEvaluations = evaluations.filter(({ flag }) => {
    const text = `${flag.key} ${flag.name} ${flag.owner} ${flag.source} ${flag.criticality} ${flag.jira} ${flag.tags?.join(' ')}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  const activeOverrides = flags.filter((flag) => flag.overrideValue !== null).length;
  const enabledFlags = flags.filter((flag) => flag.enabled).length;
  const matchedRules = evaluations.filter(({ result }) => result.reason === 'rule').length;
  const criticalActive = evaluations.filter(({ flag, result }) => flag.criticality === 'critical' && Boolean(result.value)).length;
  const diffSnapshots = useMemo(
    () => (demoMode && cloudSnapshots.length < 2 ? makeDemoSnapshots(seedFlags, defaultContext, defaultRelease) : cloudSnapshots),
    [cloudSnapshots, demoMode]
  );

  const workspace = useMemo(
    () => ({
      product: 'Compass-Ultra',
      version: 4,
      workspaceName,
      release,
      team,
      integrations,
      context,
      flags,
    }),
    [context, flags, integrations, release, team, workspaceName]
  );

  const workspaceText = JSON.stringify(workspace, null, 2);
  const selectedEvaluation = selectedFlag ? evaluateFlag(selectedFlag, context) : null;
  const sdkSnippet = selectedFlag ? makeSdkSnippet(workspaceName, context, flags) : '';
  const runbook = makeRunbook(workspaceName, release, context, evaluations, policyChecks);
  const integrationPayloads = useMemo(
    () => makeIntegrationPayloads(workspaceName, release, context, evaluations, policyChecks, runbook),
    [context, evaluations, policyChecks, release, runbook, workspaceName]
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ workspaceName, release, team, integrations, context, flags, audit }));
  }, [audit, context, flags, integrations, release, team, workspaceName]);

  const record = (action, detail = '', level = 'info') => {
    setAudit((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: timeNow(),
        actor: activeMember?.name || 'System',
        role: activeMember?.role || 'system',
        level,
        action,
        detail,
      },
      ...current,
    ].slice(0, 60));
    setNotice(action);
  };

  const updateContext = (field, value) => {
    setContext((current) => ({ ...current, [field]: value }));
    record(`Context ${field} changed`);
  };

  const updateRelease = (field, value) => {
    if (!canEdit) {
      record('Release edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setRelease((current) => ({ ...current, [field]: value }));
    record(`Release ${field} changed`);
  };

  const updateFlag = (key, patch) => {
    if (!canEdit) {
      record('Flag edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setFlags((current) =>
      current.map((flag) => (flag.key === key ? normalizeFlag({ ...flag, ...patch }) : flag))
    );
  };

  const setOverride = (flag, value) => {
    updateFlag(flag.key, { overrideValue: value });
    record(`${flag.name} override ${value === null ? 'cleared' : 'set'}`);
  };

  const addFlag = () => {
    if (!canEdit) {
      record('Add flag blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    const key = slugKey(draft.key || draft.name);
    if (!key || flags.some((flag) => flag.key === key)) {
      record('Flag key must be unique');
      return;
    }

    const nextFlag = normalizeFlag({
      key,
      name: draft.name || key,
      owner: draft.owner || 'Product',
      type: draft.type,
      enabled: true,
      defaultValue: parseTypedValue(draft.defaultValue, draft.type),
      overrideValue: null,
      rollout: 100,
      criticality: 'medium',
      jira: release.changeTicket,
      approver: release.approver,
      expiresAt: '2026-12-31',
      rollback: `Disable ${key}.`,
      canaryRequired: false,
      dependencies: [],
      tags: ['local'],
      rules: [],
      source: 'Local',
    });

    setFlags((current) => [nextFlag, ...current]);
    setSelectedKey(nextFlag.key);
    setDraft(emptyDraft);
    record(`${nextFlag.name} added`);
  };

  const removeFlag = (key) => {
    if (!canEdit) {
      record('Remove flag blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    const target = flags.find((flag) => flag.key === key);
    setFlags((current) => current.filter((flag) => flag.key !== key));
    if (selectedKey === key) setSelectedKey(flags.find((flag) => flag.key !== key)?.key || '');
    record(`${target?.name || key} removed`);
  };

  const updateRule = (flag, patch) => {
    const rule = { attribute: 'plan', operator: 'equals', value: '', valueWhenMatched: defaultRuleValue(flag), ...(flag.rules?.[0] || {}), ...patch };
    updateFlag(flag.key, { rules: [rule] });
    record(`${flag.name} rule updated`);
  };

  const applySamplePack = (packKey) => {
    const pack = samplePacks[packKey];
    if (!pack) return;
    const hydrated = hydrateWorkspace({
      workspaceName: pack.workspaceName,
      release: defaultRelease,
      context: defaultContext,
      flags: pack.flags,
      ...pack.payload,
    });
    setWorkspaceName(hydrated.workspaceName);
    setRelease(hydrated.release);
    setContext(hydrated.context);
    setFlags(hydrated.flags);
    setSelectedKey(hydrated.flags[0]?.key || '');
    record(`${pack.label} loaded`);
  };

  const applySampleContext = (nextContext) => {
    setContext(nextContext);
    record('Sample context loaded');
  };

  const updateTeamMember = (id, patch) => {
    if (!canAdmin) {
      record('Team edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setTeam((current) => ({
      ...current,
      members: current.members.map((member) => (member.id === id ? { ...member, ...patch } : member)),
    }));
    record('Team member updated', id);
  };

  const updateIntegration = (id, patch) => {
    if (!canAdmin) {
      record('Integration edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setIntegrations((current) =>
      current.map((integration) => (integration.id === id ? { ...integration, ...patch } : integration))
    );
  };

  const syncProvider = async (integration) => {
    if (!canEdit) {
      record('Provider sync blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    const proxyProviders = ['launchdarkly', 'statsig', 'firebase'];
    const isProxyProvider = proxyProviders.includes(integration.id);

    if (isProxyProvider && !integration.apiKey) {
      record(`${integration.name} needs API key`, 'Enter your API key in the integration panel', 'warn');
      return;
    }

    if (!isProxyProvider && !integration.endpoint) {
      record(`${integration.name} needs endpoint`, 'Configure a read-only proxy/export URL first', 'warn');
      return;
    }

    setIntegrations((current) =>
      current.map((item) => (item.id === integration.id ? { ...item, status: 'syncing' } : item))
    );

    try {
      let payload;
      if (isProxyProvider) {
        const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
        const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
        const body = integration.id === 'launchdarkly'
          ? { apiKey: integration.apiKey, projectKey: integration.projectKey || 'default', envKey: integration.envKey || 'production' }
          : integration.id === 'firebase'
          ? { apiKey: integration.apiKey, projectId: integration.projectId }
          : { apiKey: integration.apiKey };
        const response = await fetch(`${apiBase}/api/v1/proxy/${integration.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        payload = await response.json();
      } else {
        const response = await fetch(integration.endpoint, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        payload = await response.json();
      }

      const hydrated = hydrateWorkspace({ flags: normalizeImportedFlags(payload), context, release });
      setFlags(hydrated.flags);
      setSelectedKey(hydrated.flags[0]?.key || '');
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'connected', lastSync: new Date().toLocaleString() } : item
        )
      );
      record(`${integration.name} synced`, `${hydrated.flags.length} flags imported`);
    } catch (error) {
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'error', lastSync: error.message } : item
        )
      );
      record(`${integration.name} sync failed`, error.message, 'warn');
    }
  };

  const sendIntegrationPayload = async (integration) => {
    const payload = integrationPayloads[integration.id] || integrationPayloads.generic;
    const text = JSON.stringify(payload, null, 2);

    if (!integration.endpoint) {
      await copyText(text, `${integration.name} payload copied`);
      return;
    }

    if (!canEdit) {
      record('Outbound send blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    setIntegrations((current) =>
      current.map((item) => (item.id === integration.id ? { ...item, status: 'posting' } : item))
    );
    try {
      const response = await fetch(integration.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'posted', lastSync: new Date().toLocaleString() } : item
        )
      );
      record(`${integration.name} payload posted`, release.changeTicket);
    } catch (error) {
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'error', lastSync: error.message } : item
        )
      );
      record(`${integration.name} post failed`, error.message, 'warn');
    }
  };

  const importWorkspace = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      const hydrated = hydrateWorkspace(imported, file.name);
      setWorkspaceName(hydrated.workspaceName);
      setRelease(hydrated.release);
      setTeam(hydrated.team);
      setIntegrations(hydrated.integrations);
      setContext(hydrated.context);
      setFlags(hydrated.flags);
      setSelectedKey(hydrated.flags[0]?.key || '');
      record(`Imported ${file.name}`);
    } catch {
      record('Import failed');
    } finally {
      event.target.value = '';
    }
  };

  const exportWorkspace = () => {
    const stamped = JSON.stringify({ ...workspace, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([stamped], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugKey(workspaceName) || 'compass-workspace'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    record('Workspace exported');
  };

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 48;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = margin;

    const addPage = () => { doc.addPage(); y = margin; };
    const checkY = (needed = 20) => { if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage(); };
    const addSectionTitle = (title) => {
      checkY(28);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 184, 0);
      doc.text(title, margin, y);
      y += 16;
    };
    const addWrappedText = (text, indent = 0, color = [139, 148, 158], fontSize = 9) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...color);
      String(text || '').split('\n').forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph || ' ', maxW - indent);
        lines.forEach((line) => {
          checkY(13);
          doc.text(line, margin + indent, y);
          y += 13;
        });
      });
    };

    // Header bar
    doc.setFillColor(7, 9, 14);
    doc.rect(0, 0, pageW, 56, 'F');
    doc.setTextColor(255, 184, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPASS-ULTRA', margin, 36);
    doc.setFontSize(9);
    doc.setTextColor(139, 148, 158);
    doc.setFont('helvetica', 'normal');
    doc.text(`Release Runbook  ·  ${new Date().toLocaleString()}`, margin, 50);
    y = 80;

    // Title
    doc.setTextColor(230, 237, 243);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(22, 27, 34);
    doc.rect(margin - 8, y - 14, maxW + 16, 24, 'F');
    doc.text(workspaceName, margin, y);
    y += 32;

    // Release metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const meta = [
      ['Change Ticket', release.changeTicket],
      ['Release Train', release.train],
      ['Release Captain', release.releaseCaptain],
      ['Approver', release.approver],
      ['Window', release.window],
      ['Incident Channel', release.incidentChannel],
    ];
    meta.forEach(([label, value]) => {
      checkY(16);
      doc.setTextColor(139, 148, 158);
      doc.text(`${label}:`, margin, y);
      doc.setTextColor(230, 237, 243);
      doc.text(String(value), margin + 110, y);
      y += 16;
    });
    y += 12;

    // Gate status
    checkY(28);
    const blocked = policyChecks.filter(c => c.status === 'block').length;
    const warnings = policyChecks.filter(c => c.status === 'warn').length;
    const gateColor = blocked ? [248, 81, 73] : warnings ? [240, 136, 62] : [63, 185, 80];
    const gateLabel = blocked ? 'BLOCKED' : warnings ? 'NEEDS REVIEW' : 'READY TO SHIP';
    doc.setFillColor(...gateColor);
    doc.roundedRect(margin - 8, y - 14, maxW + 16, 22, 3, 3, 'F');
    doc.setTextColor(7, 9, 14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`GATE STATUS: ${gateLabel}`, margin, y);
    y += 30;

    // Policy checks
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ENTERPRISE POLICY CHECKS', margin, y);
    y += 16;
    policyChecks.forEach(check => {
      checkY(18);
      const color = check.status === 'pass' ? [63, 185, 80] : check.status === 'warn' ? [240, 136, 62] : [248, 81, 73];
      doc.setFillColor(...color);
      doc.circle(margin + 4, y - 4, 4, 'F');
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(check.title, margin + 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      const lines = doc.splitTextToSize(check.detail, maxW - 14);
      lines.forEach(line => { checkY(13); doc.text(line, margin + 14, y += 13); });
      y += 6;
    });
    y += 8;

    // Active flags
    checkY(28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ACTIVE FLAG EVALUATIONS', margin, y);
    y += 16;
    evaluations.filter(({ result }) => Boolean(result.value)).forEach(({ flag, result }) => {
      checkY(36);
      doc.setFillColor(22, 27, 34);
      doc.rect(margin - 8, y - 14, maxW + 16, 32, 'F');
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(flag.name, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      doc.text(`${flag.key}  ·  owner: ${flag.owner}  ·  ticket: ${flag.jira}  ·  criticality: ${flag.criticality}  ·  reason: ${result.reason}`, margin, y + 13);
      y += 38;
    });
    y += 8;

    // Rollback steps
    checkY(28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ROLLBACK PROCEDURES', margin, y);
    y += 16;
    flags.filter(f => f.enabled).forEach(flag => {
      checkY(28);
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(flag.key, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      const lines = doc.splitTextToSize(flag.rollback, maxW - 14);
      lines.forEach(line => { checkY(13); doc.text(line, margin + 14, y += 13); });
      y += 6;
    });

    y += 8;
    addSectionTitle('AI RISK ANALYSIS');
    if (aiAnalysis) {
      addWrappedText(aiAnalysis.replace(/^#+\s*/gm, ''), 0, [230, 237, 243], 8);
    } else {
      addWrappedText('No release risk analysis has been run for this workspace session. Run Risk Analysis before exporting if this PDF will be used as final release evidence.');
    }

    y += 8;
    addSectionTitle('PROOF SUMMARY');
    [
      `Readiness: ${releaseState.score}%`,
      `Gate status: ${gateLabel}`,
      `Blockers: ${blocked}`,
      `Warnings: ${warnings}`,
      `Enabled flags: ${enabledFlags}/${flags.length}`,
      `Critical active paths: ${criticalActive}`,
      `Live providers configured: ${connectedProviders}`,
      `Snapshot evidence available: ${diffSnapshots.length}`,
    ].forEach((line) => addWrappedText(`- ${line}`, 8, [230, 237, 243]));

    y += 8;
    addSectionTitle('PROVIDER STATUS');
    integrations.forEach((integration) => {
      addWrappedText(`- ${integration.name}: ${integration.status}; last sync: ${integration.lastSync || 'not recorded'}`, 8);
    });

    y += 8;
    addSectionTitle('AUDIT TRAIL');
    const auditRows = audit.slice(0, 10);
    if (!auditRows.length) {
      addWrappedText('No audit events recorded in this workspace.');
    } else {
      auditRows.forEach((event) => {
        addWrappedText(`- [${event.time}] ${event.action}${event.detail ? ` — ${event.detail}` : ''} (${event.actor})`, 8);
      });
    }

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFillColor(7, 9, 14);
      doc.rect(0, doc.internal.pageSize.getHeight() - 28, pageW, 28, 'F');
      doc.setFontSize(8);
      doc.setTextColor(61, 68, 81);
      doc.text(`Compass-Ultra  ·  ${workspaceName}  ·  Page ${i} of ${pages}`, margin, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`${slugKey(workspaceName) || 'compass-runbook'}-${Date.now()}.pdf`);
    record('PDF runbook exported');
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      record(label);
    } catch {
      record('Clipboard unavailable');
    }
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('workspace', encodeWorkspace({ ...workspace, exportedAt: new Date().toISOString() }));
    await copyText(url.toString(), 'Share link copied');
  };

  const resetWorkspace = () => {
    const baseline = hydrateWorkspace({});
    setWorkspaceName(baseline.workspaceName);
    setRelease(baseline.release);
    setTeam(baseline.team);
    setIntegrations(baseline.integrations);
    setContext(baseline.context);
    setFlags([]);
    setSelectedKey('');
    record('Workspace reset');
  };

  const openSnapshotDiff = () => {
    if (!canUseDiff) {
      requirePlan('Pro', 'Snapshot diff viewer');
      return;
    }

    if (demoMode && !diffA && !diffB) {
      const demoSnapshots = makeDemoSnapshots(seedFlags, defaultContext, defaultRelease);
      setDiffA(demoSnapshots[0]);
      setDiffB(demoSnapshots[1]);
    }
    setShowDiff((current) => !current);
  };

  const loadDemo = (name = 'Demo Retail — Production Release', releaseOverrides = {}) => {
    const demo = hydrateWorkspace({ flags: seedFlags, workspaceName: name });
    setWorkspaceName(demo.workspaceName);
    setRelease({ ...defaultRelease, changeTicket: 'CHG-24051', train: 'prod-2026.05', releaseCaptain: 'Demo User', ...releaseOverrides });
    setTeam(demo.team);
    setIntegrations(demo.integrations);
    setContext(demo.context);
    setFlags(demo.flags);
    setSelectedKey(demo.flags[0]?.key || '');
    setDemoMode(true);
    record('Demo workspace loaded');
  };

  const loadCloudSnapshots = async () => {
    if (!isAuthenticated) return;
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const snaps = await api.listSnapshots(token);
      setCloudSnapshots(snaps);
    } catch (e) {
      setCloudNotice('Failed to load cloud snapshots');
    } finally {
      setCloudLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadCloudSnapshots();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let cancelled = false;
    const expectedPlan = checkoutPlanRef.current;
    const refreshPlan = async (attempt = 0) => {
      try {
        const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
        const data = await api.getPlan(token);
        const nextPlan = data.plan || 'free';
        if (cancelled) return;
        if (expectedPlan && nextPlan === 'free' && attempt < 10) {
          window.setTimeout(() => refreshPlan(attempt + 1), 1500);
          return;
        }
        setUserPlan(nextPlan);
        if (!expectedPlan || nextPlan !== 'free') checkoutPlanRef.current = null;
      } catch {
        if (!cancelled && expectedPlan && attempt < 10) {
          window.setTimeout(() => refreshPlan(attempt + 1), 1500);
        }
      }
    };
    refreshPlan();
    return () => {
      cancelled = true;
    };
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('demo') === 'true') {
      loadDemo('Demo Retail — Peak Sale Release', { changeTicket: 'CHG-1850', train: 'peak-sale-2026.11', releaseCaptain: 'Demo Release Lead' });
      return;
    }

    if (params.get('sandbox') === 'true') {
      loadDemo('Demo Sandbox — Try Before You Sign In', { changeTicket: 'CHG-SANDBOX', train: 'sandbox-2026', releaseCaptain: 'Guest Explorer' });
      return;
    }

    if (!authLoading && !isAuthenticated) {
      loadDemo('Demo Retail — Peak Sale Release', { changeTicket: 'CHG-1850', train: 'peak-sale-2026.11', releaseCaptain: 'Demo Guest' });
      return;
    }

    const upgraded = params.get('upgraded');
    if (upgraded) {
      checkoutPlanRef.current = upgraded;
      setUpgradeNotice(`You're now on the ${upgraded.charAt(0).toUpperCase() + upgraded.slice(1)} plan — welcome aboard!`);
      setUserPlan(upgraded);
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setUpgradeNotice(''), 6000);
    }
    const snapId = params.get('snapshot');
    if (!snapId) return;
    api.getSnapshot(snapId).then((snap) => {
      restoreFromCloud(snap);
      window.history.replaceState({}, '', window.location.pathname);
    }).catch(() => {});
  }, []);

  const saveToCloud = () => {
    if (!isAuthenticated) { loginWithEmail(); return; }
    if (cloudSnapshots.length >= snapshotCap) {
      requirePlan('Pro', `Free plan is limited to ${snapshotCap} snapshots`);
      return;
    }
    setSnapshotDraftName(workspaceName);
    setShowSnapshotModal(true);
  };

  const confirmSnapshotSave = async () => {
    const name = snapshotDraftName.trim();
    if (!name) return;
    setShowSnapshotModal(false);
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      await api.saveSnapshot(token, name, '', workspace);
      setCloudNotice('Saved to cloud!');
      await loadCloudSnapshots();
    } catch (e) {
      setCloudNotice('Cloud save failed');
    } finally {
      setCloudLoading(false);
    }
  };

  const restoreFromCloud = (snap) => {
    const hydrated = hydrateWorkspace(snap.snapshot_data);
    setWorkspaceName(hydrated.workspaceName);
    setRelease(hydrated.release);
    setTeam(hydrated.team);
    setIntegrations(hydrated.integrations);
    setContext(hydrated.context);
    setFlags(hydrated.flags);
    setSelectedKey(hydrated.flags[0]?.key || '');
    record(`Restored cloud snapshot: ${snap.name}`);
  };

  const deleteCloudSnapshot = async (id) => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      await api.deleteSnapshot(token, id);
      await loadCloudSnapshots();
      setCloudNotice('Snapshot deleted');
    } catch (e) {
      setCloudNotice('Delete failed');
    }
  };

  const applyRiskAnalysis = (analysis, source) => {
    const level = getRiskLevelFromAnalysis(analysis);
    setAiAnalysis(analysis);
    setAiRiskLevel(level);
    setAiAnalysisSource(source);
    if (soundEnabled) playRiskTone(level);
  };

  const runAiAnalysis = async () => {
    if (soundEnabled) primeRiskAudio();
    if (demoMode && !isAuthenticated) {
      setAiLoading(true);
      setAiAnalysis('');
      setAiAnalysisSource('');
      try {
        const { analysis } = await api.analyzeDemoFlags({ flags, context, release, policyChecks });
        applyRiskAnalysis(analysis, 'Live AI service');
        setAiLoading(false);
        record('Live demo AI risk analysis complete');
        return;
      } catch (e) {
        record('Live demo AI unavailable; using state-aware fallback', e.message || '', 'warn');
      }
      window.setTimeout(() => {
        const analysis = makeDemoAiAnalysis(workspaceName, release, context, flags, policyChecks);
        applyRiskAnalysis(analysis, 'Local deterministic risk engine');
        setAiLoading(false);
        record('State-aware demo AI risk analysis complete');
      }, 650);
      return;
    }
    if (!isAuthenticated) { loginWithEmail(); return; }
    if (!canUseAI) { requirePlan('Pro', 'risk analyzer'); return; }
    setAiLoading(true);
    setAiAnalysis('');
    setAiAnalysisSource('');
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const { analysis } = await api.analyzeFlags(token, { flags, context, release, policyChecks });
      applyRiskAnalysis(analysis, 'Live AI service');
      record('AI risk analysis complete');
    } catch (e) {
      if (e.error === 'login_required' || e.error === 'consent_required') {
        loginWithEmail();
        return;
      }
      const analysis = makeDemoAiAnalysis(workspaceName, release, context, flags, policyChecks);
      applyRiskAnalysis(
        `${analysis}\n\nLive AI service unavailable; Compass Ultra generated this deterministic release-risk fallback from the current workspace state.`,
        'Local deterministic risk engine'
      );
      record('AI risk analysis fallback used', e.message || '', 'warn');
    } finally {
      setAiLoading(false);
    }
  };

  const shareCloudSnapshot = async (id) => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const { shareUrl } = await api.shareSnapshot(token, id);
      await navigator.clipboard.writeText(shareUrl);
      setCloudNotice('Share link copied to clipboard!');
    } catch (e) {
      setCloudNotice('Share failed');
    }
  };

  return (
    <main className={`app-shell theme-${workspaceTheme}`}>
      {upgradeNotice && (
        <div style={{ background: '#3fb950', color: '#000', padding: '10px 20px', textAlign: 'center', fontWeight: 600, fontSize: '0.95rem', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          {upgradeNotice}
          <button onClick={() => setUpgradeNotice('')} style={{ marginLeft: 16, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>×</button>
        </div>
      )}
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Compass-Ultra">
          <span className="brand-mark">CU</span>
          <span>
            <strong>Compass Ultra</strong>
            <small>Release Intelligence Platform</small>
          </span>
        </a>
        <div className="workspace-title">
          <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} aria-label="Workspace name" />
          <span>{notice}</span>
        </div>
        <div className="release-badge" data-state={releaseState.state}>
          {releaseState.icon}
          <strong>{releaseState.label}</strong>
          <span>{releaseState.score}% ready</span>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setWorkspaceTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
            title={workspaceTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={workspaceTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {workspaceTheme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => importRef.current?.click()} title="Import JSON" aria-label="Import JSON">
            <Upload size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={exportWorkspace} title="Export workspace" aria-label="Export workspace">
            <Download size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={copyShareLink} title="Copy share link" aria-label="Copy share link">
            <Link size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={resetWorkspace} title="Reset workspace" aria-label="Reset workspace">
            <RefreshCw size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setShowPricing(true)} title="Pricing" aria-label="Pricing" style={{ color: '#ffb800' }}>
            <DollarSign size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={openSnapshotDiff} title={demoMode ? 'Demo snapshot diff viewer' : canUseDiff ? 'Snapshot diff viewer' : 'Snapshot diff viewer (Pro)'} aria-label="Snapshot diff viewer" style={{ color: showDiff ? '#58a6ff' : canUseDiff ? '#8b949e' : '#3d4451' }}>
            <GitCompare size={17} aria-hidden="true" />
            {!canUseDiff && <LockKeyhole size={9} style={{ position: 'absolute', marginLeft: -7, marginTop: 8, color: '#ffb800' }} />}
          </button>
          <button type="button" onClick={runAiAnalysis} title={demoMode ? 'Run demo risk analysis' : canUseAI ? 'Risk analysis' : 'Risk analysis (Pro)'} aria-label="Risk analysis" style={{ color: aiLoading ? '#ffb800' : canUseAI ? '#bc8cff' : '#3d4451', position: 'relative' }}>
            <BrainCircuit size={17} aria-hidden="true" />
            {!canUseAI && <LockKeyhole size={9} style={{ position: 'absolute', top: 0, right: 0, color: '#ffb800' }} />}
          </button>
          <button type="button" onClick={exportPDF} title="Export proof PDF" aria-label="Export proof PDF">
            <FileDown size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={saveToCloud} title={isAuthenticated ? 'Save to cloud' : 'Login to save to cloud'} aria-label="Save to cloud" style={{ color: isAuthenticated ? '#3fb950' : '#8b949e' }}>
            <Cloud size={17} aria-hidden="true" />
          </button>
          {isAuthenticated && userPlan !== 'free' && (
            <button
              type="button"
              title="Manage subscription"
              onClick={async () => {
                try {
                  const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
                  const { url } = await api.openPortal(token);
                  window.location.href = url;
                } catch (e) {
                  if (e.status === 404 || e.message?.includes('No subscription')) {
                    setShowPricing(true);
                  } else {
                    alert('Could not open subscription portal. Please try again.');
                  }
                }
              }}
              style={{ fontSize: '0.7rem', fontWeight: 700, background: '#3fb950', color: '#000', borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.05em', border: 'none', cursor: 'pointer' }}
            >{userPlan}</button>
          )}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} title={`Logout ${user?.email}`} aria-label="Logout">
              <LogOut size={17} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={() => loginWithEmail()} title="Login" aria-label="Login">
              <LogIn size={17} aria-hidden="true" />
            </button>
          )}
          <input ref={importRef} className="hidden-file" type="file" accept="application/json,.json" onChange={importWorkspace} />
        </div>
      </header>

      <section className="ai-risk-strip" data-risk={aiRiskLevel ? aiRiskLevel.toLowerCase() : 'pending'}>
        <div className="ai-risk-main">
          <div className="ai-risk-icon">
            <BrainCircuit size={22} aria-hidden="true" />
          </div>
          <div>
            <span className="ai-risk-kicker">Release Risk Analyzer</span>
            <h1>
              {aiLoading
                ? 'Risk engine is reviewing this release.'
                : aiRiskLevel
                  ? `${aiRiskLevel} risk detected`
                  : 'Run the risk check before deploy.'}
            </h1>
            <p>
              {aiAnalysis
                ? `Latest analysis is ready below with blockers, affected flags, and recommended actions. Source: ${aiAnalysisSource || 'risk engine'}.`
                : releaseBlockSummary}
            </p>
          </div>
        </div>
        <div className="ai-risk-metrics">
          <span><strong>{releaseState.score}%</strong> readiness</span>
          <span><strong>{policyBlockers}</strong> blockers</span>
          <span><strong>{policyWarnings}</strong> warnings</span>
        </div>
        <div className="ai-risk-actions">
          <button type="button" className="ai-risk-cta" onClick={runAiAnalysis} disabled={aiLoading}>
            <BrainCircuit size={16} aria-hidden="true" />
            {aiLoading ? 'Analyzing...' : aiRiskLevel ? 'Run Again' : 'Run Risk Analysis'}
          </button>
          <button
            type="button"
            className="ai-sound-toggle"
            onClick={() => setSoundEnabled((value) => !value)}
            aria-label={soundEnabled ? 'Turn risk sounds off' : 'Turn risk sounds on'}
            title={soundEnabled ? 'Risk sounds on' : 'Risk sounds off'}
          >
            {soundEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          </button>
        </div>
      </section>

      {(aiAnalysis || aiLoading) && (
        <section className="risk-analysis-panel" data-risk={aiRiskLevel ? aiRiskLevel.toLowerCase() : 'pending'}>
          <div className="risk-analysis-heading">
            <div>
              <span className="ai-risk-kicker">Current Analysis</span>
              <h2>Release Risk Analysis</h2>
            </div>
            <div className="risk-analysis-tools">
              {aiAnalysisSource && <span>{aiAnalysisSource}</span>}
              {aiAnalysis && (
                <>
                  <button type="button" onClick={() => copyText(aiAnalysis, 'Risk analysis copied!')} aria-label="Copy plain text" title="Copy plain text">
                    <Clipboard size={15} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => copyText(toSlackMrkdwn(aiAnalysis), 'Copied for Slack!')} aria-label="Copy as Slack mrkdwn" title="Copy for Slack (mrkdwn format)">
                    Slack
                  </button>
                  <button type="button" onClick={() => setAiAnalysis('')} aria-label="Close analysis">
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
          {aiLoading && <p className="risk-analysis-loading">Analyzing the current workspace...</p>}
          {aiAnalysis && <pre>{aiAnalysis}</pre>}
          {aiAnalysis && (aiRiskLevel === 'HIGH' || aiRiskLevel === 'CRITICAL') && (
            <div className="rollback-callout">
              <div>
                <strong>{aiRiskLevel} risk detected</strong>
                <span>Rollback to a previous safe snapshot to undo recent changes.</span>
              </div>
              <button
                type="button"
                onClick={() => { if (!isAuthenticated) { loginWithEmail(); return; } setShowRollbackModal(true); }}
              >
                Rollback to Safe State
              </button>
            </div>
          )}
        </section>
      )}

      {!authLoading && !isAuthenticated && (
        <section className="sandbox-banner">
          <div className="sandbox-banner-content">
            <span className="sandbox-badge">SANDBOX</span>
            <span>Exploring Compass Ultra — no account needed. Toggle flags, run risk analysis, export PDFs.</span>
          </div>
          <div className="sandbox-banner-actions">
            <button type="button" className="sandbox-login-btn" onClick={() => loginWithEmail()}>
              <LogIn size={15} />
              Sign in to save
            </button>
            <button type="button" className="sandbox-dismiss-btn" onClick={() => setShowPricing(true)}>
              View Pricing
            </button>
          </div>
        </section>
      )}

      {demoMode && isAuthenticated && (
        <section className="demo-guide-bar" aria-label="Demo walkthrough">
          <div>
            <strong>Try the release review loop</strong>
            <span>Toggle a risky flag, run risk analysis, compare snapshots, then export the runbook.</span>
          </div>
          <div className="demo-guide-actions">
            <button type="button" onClick={runAiAnalysis}>
              <BrainCircuit size={15} aria-hidden="true" />
              Run AI
            </button>
            <button type="button" onClick={openSnapshotDiff}>
              <GitCompare size={15} aria-hidden="true" />
              Snapshot Diff
            </button>
            <button type="button" onClick={exportPDF}>
              <FileDown size={15} aria-hidden="true" />
              Export Proof
            </button>
          </div>
        </section>
      )}

      <section id="workspace" className="workspace-layout">
        <WorkspaceGuide />

        <aside className="sidebar">
          <section className="panel">
            <div className="panel-heading">
              <Rocket size={18} aria-hidden="true" />
              <h2>Release Setup</h2>
            </div>
            <p className="panel-note">Set the release metadata that fills reports, tickets, and integration payloads.</p>
            <div className="field-grid">
              {Object.entries(release).map(([key, value]) => (
                <label key={key}>
                  {fieldLabel(key, releaseFieldLabels)}
                  <input value={value} onChange={(event) => updateRelease(key, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <Users size={18} aria-hidden="true" />
              <h2>Seats & Roles</h2>
            </div>
            <p className="panel-note">Switch the active seat and audit who can edit, approve, or view this release.</p>
            <label>
              Active seat
              <select value={team.activeMemberId} onChange={(event) => setTeam((current) => ({ ...current, activeMemberId: event.target.value }))}>
                {team.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </label>
            <div className="auth-card">
              <KeyRound size={17} aria-hidden="true" />
              <div>
                <strong>{team.authMode}</strong>
                <span>{canEdit ? 'Write controls enabled for this role' : 'Read-only role active'}</span>
              </div>
            </div>
            <div className="team-list">
              {team.members.map((member) => (
                <article className="team-member" key={member.id}>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>
                  <select value={member.role} disabled={!canAdmin} onChange={(event) => updateTeamMember(member.id, { role: event.target.value })}>
                    <option value="admin">admin</option>
                    <option value="approver">approver</option>
                    <option value="operator">operator</option>
                    <option value="viewer">viewer</option>
                  </select>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <CloudCog size={18} aria-hidden="true" />
              <h2>Import Sample Data</h2>
            </div>
            <div className="sample-grid">
              {Object.entries(samplePacks).map(([key, pack]) => (
                <button type="button" key={key} onClick={() => applySamplePack(key)}>
                  <strong>{pack.label}</strong>
                  <span>{pack.workspaceName}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <UserRound size={18} aria-hidden="true" />
              <h2>Test Context</h2>
            </div>
            <p className="panel-note">Choose the user, plan, device, and environment used for flag evaluation.</p>
            <div className="context-pills">
              {sampleContexts.map((item) => (
                <button type="button" key={item.name} onClick={() => applySampleContext(item.context)}>
                  {item.name}
                </button>
              ))}
            </div>
            <div className="field-grid">
              {Object.entries(context).map(([key, value]) => (
                <label key={key}>
                  {fieldLabel(key, contextFieldLabels)}
                  <input value={value} onChange={(event) => updateContext(key, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <Plus size={18} aria-hidden="true" />
              <h2>Add Feature Flag</h2>
            </div>
            <div className="field-grid">
              <label>
                key
                <input value={draft.key} onChange={(event) => setDraft((current) => ({ ...current, key: event.target.value }))} placeholder="team.flag_name" />
              </label>
              <label>
                name
                <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Flag name" />
              </label>
              <label>
                owner
                <input value={draft.owner} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} />
              </label>
              <label>
                type
                <select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value, defaultValue: event.target.value === 'json' ? '{}' : 'false' }))}>
                  <option value="boolean">boolean</option>
                  <option value="variant">variant</option>
                  <option value="json">json</option>
                </select>
              </label>
              <label>
                default
                <input value={draft.defaultValue} onChange={(event) => setDraft((current) => ({ ...current, defaultValue: event.target.value }))} />
              </label>
            </div>
            <button className="full-button" type="button" onClick={addFlag}>
              <Plus size={16} aria-hidden="true" />
              Add flag
            </button>
          </section>
        </aside>

        <section className="main-panel">
          <div className="summary-grid">
            <Metric icon={<ShieldCheck />} label="Enabled" value={`${enabledFlags}/${flags.length}`} />
            <Metric icon={<SlidersHorizontal />} label="Overrides" value={activeOverrides} />
            <Metric icon={<GitBranch />} label="Rule matches" value={matchedRules} />
            <Metric icon={<LockKeyhole />} label="Critical active" value={criticalActive} />
            <Metric icon={<Gauge />} label="Provider flags" value={flags.filter((flag) => flag.source !== 'Local').length} />
            <Metric icon={<Webhook />} label={connectedProviders ? 'Live providers' : 'Demo mode'} value={connectedProviders || 'sample data'} />
          </div>

          <section className="release-board">
            <div className="board-column">
              <span>Dev</span>
              <strong>{flags.length}</strong>
              <small>editable flags</small>
            </div>
            <div className="board-column">
              <span>QA</span>
              <strong>{policyChecks.filter((check) => check.status !== 'block').length}/{policyChecks.length}</strong>
              <small>checks passable</small>
            </div>
            <div className="board-column">
              <span>Stage</span>
              <strong>{evaluations.filter(({ result }) => result.reason === 'rollout').length}</strong>
              <small>rollout evaluated</small>
            </div>
            <div className={`board-column ${releaseState.state}`}>
              <span>Prod Gate</span>
              <strong>{releaseState.label}</strong>
              <small>{release.changeTicket}</small>
            </div>
          </section>

          <section className="table-panel">
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flags, owners, tickets, tags" />
              </div>
              <span>
                <ListFilter size={15} aria-hidden="true" />
                {visibleEvaluations.length} shown
              </span>
            </div>
            <div className="flag-table">
              {flags.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 48 }}>🧭</div>
                  <div>
                    <h3 style={{ color: '#e6edf3', margin: '0 0 8px', fontSize: 16 }}>No flags loaded yet</h3>
                    <p style={{ color: '#8b949e', fontSize: 13, margin: '0 0 24px', maxWidth: 360 }}>
                      Load the demo to see Compass Ultra in action, or import your own flags from LaunchDarkly, Statsig, Firebase, or any JSON export.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={loadDemo} style={{ background: '#ffb800', color: '#07090e', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={15} />
                      Try the Demo
                    </button>
                    <button type="button" onClick={() => importRef.current?.click()} style={{ background: 'none', color: '#e6edf3', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Upload size={15} />
                      Import Flags
                    </button>
                  </div>
                </div>
              )}
              {visibleEvaluations.map(({ flag, result }) => (
                <article className={`flag-row ${selectedFlag?.key === flag.key ? 'is-selected' : ''}`} key={flag.key} onClick={() => setSelectedKey(flag.key)}>
                  <div className="flag-primary">
                    <button
                      className={`switch ${flag.enabled ? 'is-on' : ''}`}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateFlag(flag.key, { enabled: !flag.enabled });
                        record(`${flag.name} ${flag.enabled ? 'disabled' : 'enabled'}`);
                      }}
                      aria-pressed={flag.enabled}
                    >
                      <span />
                    </button>
                    <div>
                      <h3>{flag.name}</h3>
                      <p>{flag.key}</p>
                    </div>
                  </div>
                  <span className={`criticality ${flag.criticality}`}>{flag.criticality}</span>
                  <span className="source-pill">{flag.source}</span>
                  <span className={`value-pill ${String(result.value) === 'true' ? 'yes' : String(result.value) === 'false' ? 'no' : ''}`}>
                    {formatValue(result.value)}
                  </span>
                  <span className="reason-pill">{result.reason}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      copyText(flag.key, `${flag.key} copied`);
                    }}
                    aria-label={`Copy ${flag.key}`}
                    title="Copy flag key"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d4451', padding: '0 4px' }}
                  >
                    <Clipboard size={13} aria-hidden="true" />
                  </button>
                  <button
                    className="icon-danger"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFlag(flag.key);
                    }}
                    aria-label={`Remove ${flag.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="policy-panel">
            <div className="panel-heading">
              <ListChecks size={18} aria-hidden="true" />
              <h2>Enterprise Policy Checks</h2>
            </div>
            <div className="policy-list">
              {policyChecks.map((check) => (
                <article className={`policy-item ${check.status}`} key={check.id}>
                  {check.status === 'pass' ? <CheckCircle2 size={18} /> : check.status === 'warn' ? <AlertTriangle size={18} /> : <XCircle size={18} />}
                  <div>
                    <strong>{check.title}</strong>
                    <p>{check.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="policy-panel">
            <div className="panel-heading">
              <Webhook size={18} aria-hidden="true" />
              <h2>Live Integrations</h2>
            </div>
            <div className="integration-console">
              {integrations.map((integration) => (
                <article className="integration-row" key={integration.id}>
                  <div>
                    <strong>{integration.name}</strong>
                    <span>{integration.kind === 'provider' ? (
                      ['launchdarkly','statsig','firebase'].includes(integration.id)
                        ? 'Paste your API key — flags sync directly via secure server proxy'
                        : 'Read provider JSON through a secure proxy/export URL'
                    ) : integration.id === 'slack'
                      ? 'Copy Slack-ready blocks or post through a configured workflow/proxy endpoint'
                      : 'Copy or post the generated release payload'}</span>
                  </div>
                  {['launchdarkly','statsig','firebase'].includes(integration.id) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label>
                        API key
                        <input
                          type="password"
                          value={integration.apiKey || ''}
                          disabled={!canAdmin}
                          onChange={(e) => updateIntegration(integration.id, { apiKey: e.target.value, status: e.target.value ? 'configured' : 'ready' })}
                          placeholder={integration.secretHint}
                        />
                      </label>
                      {integration.id === 'launchdarkly' && (
                        <label>
                          project / env
                          <input
                            value={`${integration.projectKey || 'default'} / ${integration.envKey || 'production'}`}
                            disabled={!canAdmin}
                            onChange={(e) => {
                              const [proj, env] = e.target.value.split('/').map(s => s.trim());
                              updateIntegration(integration.id, { projectKey: proj || 'default', envKey: env || 'production' });
                            }}
                            placeholder="default / production"
                          />
                        </label>
                      )}
                      {integration.id === 'firebase' && (
                        <label>
                          project ID
                          <input
                            value={integration.projectId || ''}
                            disabled={!canAdmin}
                            onChange={(e) => updateIntegration(integration.id, { projectId: e.target.value })}
                            placeholder="your-firebase-project-id"
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <label>
                      endpoint
                      <input
                        value={integration.endpoint}
                        disabled={!canAdmin}
                        onChange={(event) => updateIntegration(integration.id, { endpoint: event.target.value, status: event.target.value ? 'configured' : 'not configured' })}
                        placeholder={integration.secretHint}
                      />
                    </label>
                  )}
                  <span className={`connector-status ${slugKey(integration.status)}`}>{integration.status}</span>
                  <small>{integration.lastSync}</small>
                  <div className="connector-actions">
                    {integration.kind === 'provider' ? (
                      <button type="button" onClick={() => syncProvider(integration)}>
                        <RefreshCw size={15} aria-hidden="true" />
                        Pull
                      </button>
                    ) : (
                      <button type="button" onClick={() => sendIntegrationPayload(integration)}>
                        <Send size={15} aria-hidden="true" />
                        Send
                      </button>
                    )}
                    <button type="button" onClick={() => copyText(JSON.stringify(integrationPayloads[integration.id] || integrationPayloads.generic, null, 2), `${integration.name} payload copied`)}>
                      <Clipboard size={15} aria-hidden="true" />
                      Copy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="inspector">
          {selectedFlag && (
            <section className="panel inspector-panel">
              <div className="panel-heading">
                <BadgeCheck size={18} aria-hidden="true" />
                <h2>Flag Inspector</h2>
                {selectedFlag && (
                  <button type="button" onClick={() => copyText(selectedFlag.key, `${selectedFlag.key} copied`)} title="Copy flag key" aria-label="Copy flag key">
                    <Clipboard size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
              <label>
                name
                <input value={selectedFlag.name} onChange={(event) => updateFlag(selectedFlag.key, { name: event.target.value })} />
              </label>
              <label>
                owner
                <input value={selectedFlag.owner} onChange={(event) => updateFlag(selectedFlag.key, { owner: event.target.value })} />
              </label>
              <label>
                jira/change
                <input value={selectedFlag.jira} onChange={(event) => updateFlag(selectedFlag.key, { jira: event.target.value })} />
              </label>
              <label>
                approver
                <input value={selectedFlag.approver} onChange={(event) => updateFlag(selectedFlag.key, { approver: event.target.value })} />
              </label>
              <label>
                criticality
                <select value={selectedFlag.criticality} onChange={(event) => updateFlag(selectedFlag.key, { criticality: event.target.value })}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="critical">critical</option>
                </select>
              </label>
              <label>
                expires
                <input value={selectedFlag.expiresAt} onChange={(event) => updateFlag(selectedFlag.key, { expiresAt: event.target.value })} />
              </label>
              <label>
                rollout
                <input type="range" min="0" max="100" value={selectedFlag.rollout} onChange={(event) => updateFlag(selectedFlag.key, { rollout: Number(event.target.value) })} />
                <span className="range-readout">{selectedFlag.rollout}%</span>
              </label>
              <label>
                override
                <select value={serializeOverride(selectedFlag.overrideValue)} onChange={(event) => setOverride(selectedFlag, deserializeOverride(event.target.value, selectedFlag))}>
                  <option value="__null__">use rules</option>
                  {overrideOptions(selectedFlag).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rule-editor">
                <h3>Target Rule</h3>
                <div className="rule-grid">
                  <select value={selectedFlag.rules?.[0]?.attribute || 'plan'} onChange={(event) => updateRule(selectedFlag, { attribute: event.target.value })}>
                    {Object.keys(context).map((key) => (
                      <option key={key}>{key}</option>
                    ))}
                  </select>
                  <select value={selectedFlag.rules?.[0]?.operator || 'equals'} onChange={(event) => updateRule(selectedFlag, { operator: event.target.value })}>
                    <option value="equals">equals</option>
                    <option value="notEquals">not equals</option>
                    <option value="contains">contains</option>
                  </select>
                  <input value={selectedFlag.rules?.[0]?.value || ''} onChange={(event) => updateRule(selectedFlag, { value: event.target.value })} />
                </div>
              </div>

              <label>
                rollback
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input value={selectedFlag.rollback} onChange={(event) => updateFlag(selectedFlag.key, { rollback: event.target.value })} style={{ flex: 1 }} />
                  <button type="button" onClick={() => copyText(selectedFlag.rollback, 'Rollback copied!')} title="Copy rollback" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', padding: 0, flexShrink: 0 }}>
                    <Clipboard size={13} />
                  </button>
                </div>
              </label>

              <div className="evaluation-card">
                <span>current value</span>
                <strong>{formatValue(selectedEvaluation?.value)}</strong>
                <small>{selectedEvaluation?.detail}</small>
              </div>
            </section>
          )}

          <section className="panel code-panel">
            <div className="panel-heading">
              <BookOpenCheck size={18} aria-hidden="true" />
              <h2>Release Runbook</h2>
              <button type="button" onClick={() => copyText(runbook, 'Runbook copied')} aria-label="Copy release runbook">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{runbook}</pre>
          </section>

          <section className="panel code-panel">
            <div className="panel-heading">
              <Braces size={18} aria-hidden="true" />
              <h2>Workspace JSON</h2>
              <button type="button" onClick={() => copyText(workspaceText, 'JSON copied')} aria-label="Copy workspace JSON">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{workspaceText}</pre>
          </section>

          <section className="panel code-panel">
            <div className="panel-heading">
              <FileJson size={18} aria-hidden="true" />
              <h2>SDK Payload</h2>
              <button type="button" onClick={() => copyText(sdkSnippet, 'SDK payload copied')} aria-label="Copy SDK payload">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{sdkSnippet}</pre>
          </section>

          {showDiff && (
            <section className="panel code-panel">
              <div className="panel-heading">
                <GitCompare size={18} aria-hidden="true" />
                <h2>Snapshot Diff</h2>
                <button type="button" onClick={() => setShowDiff(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e' }}>✕</button>
              </div>
              {diffSnapshots.length < 2 ? (
                <p style={{ fontSize: 11, color: '#8b949e' }}>Save at least 2 cloud snapshots to compare them.</p>
              ) : (
                <>
                  {demoMode && cloudSnapshots.length < 2 && (
                    <p style={{ fontSize: 11, color: '#8b949e', marginBottom: 10 }}>Demo mode uses two sample snapshots so you can try the diff viewer without logging in.</p>
                  )}
                  <label style={{ fontSize: 10, color: '#8b949e', display: 'block', marginBottom: 6 }}>
                    Snapshot A (before)
                    <select style={{ width: '100%', background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', color: '#e6edf3', padding: '4px 6px', borderRadius: 4, marginTop: 4, fontSize: 10 }}
                      value={diffA?.id || ''} onChange={e => setDiffA(diffSnapshots.find(s => s.id === e.target.value) || null)}>
                      <option value=''>Select snapshot…</option>
                      {diffSnapshots.map(s => <option key={s.id} value={s.id}>{s.name} — {new Date(s.created_at).toLocaleString()}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 10, color: '#8b949e', display: 'block', marginBottom: 10 }}>
                    Snapshot B (after)
                    <select style={{ width: '100%', background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', color: '#e6edf3', padding: '4px 6px', borderRadius: 4, marginTop: 4, fontSize: 10 }}
                      value={diffB?.id || ''} onChange={e => setDiffB(diffSnapshots.find(s => s.id === e.target.value) || null)}>
                      <option value=''>Select snapshot…</option>
                      {diffSnapshots.map(s => <option key={s.id} value={s.id}>{s.name} — {new Date(s.created_at).toLocaleString()}</option>)}
                    </select>
                  </label>
                  {diffA && diffB && (() => {
                    const aFlags = diffA.snapshot_data?.flags || [];
                    const bFlags = diffB.snapshot_data?.flags || [];
                    const allKeys = [...new Set([...aFlags.map(f => f.key), ...bFlags.map(f => f.key)])];
                    const diffs = allKeys.map(key => {
                      const a = aFlags.find(f => f.key === key);
                      const b = bFlags.find(f => f.key === key);
                      if (!a) return { key, type: 'added', b };
                      if (!b) return { key, type: 'removed', a };
                      const changes = [];
                      ['enabled','rollout','criticality','overrideValue','expiresAt','owner','approver'].forEach(field => {
                        if (JSON.stringify(a[field]) !== JSON.stringify(b[field])) {
                          changes.push({ field, from: a[field], to: b[field] });
                        }
                      });
                      return changes.length ? { key, type: 'changed', changes } : null;
                    }).filter(Boolean);

                    if (diffs.length === 0) return <p style={{ fontSize: 11, color: '#3fb950' }}>✓ No differences found between these snapshots.</p>;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>{diffs.length} difference{diffs.length !== 1 ? 's' : ''} found</p>
                        {diffs.map(diff => (
                          <div key={diff.key} style={{ background: '#161b22', border: `1px solid ${diff.type === 'added' ? '#3fb950' : diff.type === 'removed' ? '#f85149' : '#ffb800'}`, borderRadius: 4, padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <strong style={{ fontSize: 10, color: '#e6edf3' }}>{diff.key}</strong>
                              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: diff.type === 'added' ? '#3fb950' : diff.type === 'removed' ? '#f85149' : '#ffb800', color: '#07090e', fontWeight: 700 }}>
                                {diff.type.toUpperCase()}
                              </span>
                            </div>
                            {diff.type === 'changed' && diff.changes.map(c => (
                              <div key={c.field} style={{ fontSize: 9, marginTop: 3 }}>
                                <span style={{ color: '#8b949e' }}>{c.field}: </span>
                                <span style={{ color: '#f85149', textDecoration: 'line-through', marginRight: 6 }}>{JSON.stringify(c.from)}</span>
                                <span style={{ color: '#3fb950' }}>{JSON.stringify(c.to)}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}
            </section>
          )}

          <section className="panel audit-panel">
            <div className="panel-heading">
              <Cloud size={18} aria-hidden="true" />
              <h2>Cloud Snapshots</h2>
              {isAuthenticated && (
                <button type="button" onClick={loadCloudSnapshots} aria-label="Refresh cloud snapshots">
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              )}
            </div>
            {!isAuthenticated && (
              <button className="full-button" type="button" onClick={() => loginWithEmail()}>
                <LogIn size={16} aria-hidden="true" />
                Login to save &amp; load snapshots
              </button>
            )}
            {isAuthenticated && (
              <>
                {cloudNotice && <p style={{ fontSize: 11, color: '#3fb950', marginBottom: 8 }}>{cloudNotice}</p>}
                {cloudLoading && <p style={{ fontSize: 11, color: '#8b949e' }}>Loading…</p>}
                {cloudSnapshots.length === 0 && !cloudLoading && (
                  <p style={{ fontSize: 11, color: '#8b949e' }}>No cloud snapshots yet. Hit the cloud icon in the toolbar to save one.</p>
                )}
                {cloudSnapshots.map((snap) => (
                  <article className="audit-item snapshot-card" key={snap.id} style={{ cursor: 'pointer' }}>
                    <span>{new Date(snap.created_at).toLocaleDateString()}</span>
                    <div style={{ flex: 1 }}>
                      <strong>{snap.name}</strong>
                    </div>
                    <button type="button" onClick={() => restoreFromCloud(snap)} title="Restore" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3fb950', padding: 0 }}>
                      <RefreshCw size={13} />
                    </button>
                    <button type="button" onClick={() => shareCloudSnapshot(snap.id)} title="Copy share link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#58a6ff', padding: 0, marginLeft: 8 }}>
                      <Share2 size={13} />
                    </button>
                    <button type="button" onClick={() => deleteCloudSnapshot(snap.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f85149', padding: 0, marginLeft: 8 }}>
                      <Trash2 size={13} />
                    </button>
                  </article>
                ))}
              </>
            )}
          </section>

          <section className="panel audit-panel">
            <div className="panel-heading">
              <Activity size={18} aria-hidden="true" />
              <h2>Audit</h2>
              <button type="button" onClick={() => canExportAudit ? copyText(JSON.stringify(audit, null, 2), 'Audit copied') : requirePlan('Team', 'Audit log export')} aria-label="Copy structured audit history" title={canExportAudit ? 'Copy audit log' : 'Audit export (Team)'} style={{ color: canExportAudit ? undefined : '#3d4451' }}>
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            {audit.map((event) => (
              <article className="audit-item" key={event.id}>
                <span>{event.time}</span>
                <div>
                  <strong>{event.action}</strong>
                  <small>{formatAuditMeta(event)}</small>
                </div>
              </article>
            ))}
          </section>
        </aside>
      </section>

      {showRollbackModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowRollbackModal(false)}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 28, maxWidth: 480, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRollbackModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 18 }}>X</button>
            <div style={{ color: '#f85149', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Rollback Workspace</div>
            <div style={{ color: '#8b949e', fontSize: 12, marginBottom: 20 }}>Select a saved snapshot to restore. This replaces your current workspace state.</div>
            {cloudSnapshots.length === 0 ? (
              <div style={{ color: '#8b949e', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No saved snapshots found. Save a snapshot first to enable rollback.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cloudSnapshots.map(snap => (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => { restoreFromCloud(snap); setShowRollbackModal(false); setCloudNotice(`Rolled back to: ${snap.name}`); record(`Rollback to snapshot: ${snap.name}`); }}
                    style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(88,166,255,0.4)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <div>
                      <div style={{ color: '#e6edf3', fontSize: 13, fontWeight: 600 }}>{snap.name}</div>
                      <div style={{ color: '#8b949e', fontSize: 11, marginTop: 2 }}>{new Date(snap.created_at).toLocaleString()}</div>
                    </div>
                    <span style={{ color: '#58a6ff', fontSize: 12, fontWeight: 700 }}>Restore -&gt;</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showSnapshotModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowSnapshotModal(false)}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(88,166,255,0.25)', borderRadius: 12, padding: 28, maxWidth: 420, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSnapshotModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 18 }}>X</button>
            <div style={{ color: '#58a6ff', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
              <Cloud size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Save Snapshot
            </div>
            <div style={{ color: '#8b949e', fontSize: 12, marginBottom: 16 }}>Give this snapshot a name so you can find it later.</div>
            <input
              type="text"
              value={snapshotDraftName}
              onChange={e => setSnapshotDraftName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmSnapshotSave(); if (e.key === 'Escape') setShowSnapshotModal(false); }}
              autoFocus
              placeholder="Snapshot name"
              style={{ width: '100%', boxSizing: 'border-box', background: '#161b22', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '9px 12px', color: '#e6edf3', fontSize: 13, outline: 'none', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowSnapshotModal(false)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 16px', color: '#8b949e', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={confirmSnapshotSave} disabled={!snapshotDraftName.trim()} style={{ background: snapshotDraftName.trim() ? '#1f6feb' : '#1f6feb44', border: 'none', borderRadius: 7, padding: '7px 16px', color: snapshotDraftName.trim() ? '#fff' : '#8b949e', fontSize: 12, fontWeight: 600, cursor: snapshotDraftName.trim() ? 'pointer' : 'default', transition: 'background 0.15s' }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 40, maxWidth: 520, width: '100%', position: 'relative' }}>
            {/* Step dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 32 }}>
              {[1,2,3].map(n => (
                <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n === onboardStep ? '#58a6ff' : 'rgba(255,255,255,0.15)' }} />
              ))}
            </div>

            {onboardStep === 1 && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🧭</div>
                  <h2 style={{ color: '#e6edf3', fontSize: 22, margin: '0 0 12px' }}>Welcome to Compass Ultra</h2>
                  <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6 }}>Your release command center. Evaluate feature flags, enforce enterprise policies, and get AI-powered risk analysis — all before a single change hits production.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => { applySamplePack('dcg'); setDemoMode(true); setOnboardStep(2); }}
                    style={{ background: '#58a6ff', color: '#000', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                  >Load the Demo — See It in Action</button>
                  <button
                    onClick={() => { importRef.current?.click(); finishOnboarding(); }}
                    style={{ background: 'none', color: '#8b949e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 0', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
                  >Import My Own Flags</button>
                  <button onClick={finishOnboarding} style={{ background: 'none', border: 'none', color: '#484f58', fontSize: 12, cursor: 'pointer', marginTop: 4 }}>Skip for now</button>
                </div>
              </>
            )}

            {onboardStep === 2 && (
              <>
                <h2 style={{ color: '#e6edf3', fontSize: 20, margin: '0 0 24px', textAlign: 'center' }}>Here's what you're looking at</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                  {[
                    { icon: '🏁', title: 'Release Control', desc: 'Set your change ticket, release train, captain, and deploy window. Every artifact auto-fills from here.' },
                    { icon: '⚡', title: 'Flag Evaluation', desc: 'Your flags are evaluated live against a real user context — plan, role, region, device. See exactly what each user gets.' },
                    { icon: '🛡️', title: 'Policy Checks', desc: '9 automated checks run continuously. They tell you if your release is safe to ship or needs review.' },
                  ].map(item => (
                    <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{item.title}</div>
                        <div style={{ color: '#8b949e', fontSize: 12, lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setOnboardStep(3)}
                  style={{ width: '100%', background: '#58a6ff', color: '#000', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >Next →</button>
              </>
            )}

            {onboardStep === 3 && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
                  <h2 style={{ color: '#e6edf3', fontSize: 20, margin: '0 0 12px' }}>You're ready to ship with confidence</h2>
                  <p style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.6 }}>A few things to try first:</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { icon: '🔍', text: 'Click the brain circuit icon in the toolbar to run risk analysis' },
                    { icon: '💾', text: 'Hit the cloud icon to save your first snapshot' },
                    { icon: '📄', text: 'Click the PDF icon to generate a release runbook' },
                    { icon: '💰', text: 'Click the $ icon to explore plan options' },
                  ].map(item => (
                    <div key={item.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#161b22', borderRadius: 8, padding: '10px 14px' }}>
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ color: '#8b949e', fontSize: 12, lineHeight: 1.5 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={finishOnboarding}
                  style={{ width: '100%', background: '#3fb950', color: '#000', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >Let's go →</button>
              </>
            )}
          </div>
        </div>
      )}

      {showPricing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowPricing(false)}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 40, maxWidth: 860, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPricing(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 20 }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ color: '#ffb800', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Compass Ultra</span>
              <h2 style={{ color: '#e6edf3', fontSize: 28, margin: '8px 0 12px' }}>Pricing for teams that can't afford messy releases</h2>
              {gateNotice
                ? <p style={{ color: '#ffb800', fontSize: 14, fontWeight: 600 }}>🔒 {gateNotice} Upgrade to unlock it.</p>
                : <p style={{ color: '#8b949e', fontSize: 14 }}>One bad rollout costs more than a month of Compass Ultra.</p>
              }
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                {
                  name: 'Free', price: '$0', period: 'forever',
                  color: '#3d4451',
                  description: 'For demos, onboarding, and evaluating local release workflows.',
                  features: ['3 saved snapshots', 'Local workspace', 'PDF runbook export', 'Flag evaluation engine', 'Policy checks'],
                  cta: 'Get started', highlight: false,
                },
{
                   name: 'Solo', price: '$49', period: 'per month',
                   color: '#e3b341',
                   description: 'For independent developers and freelancers managing production flags.',
                   features: ['7-day free trial, no credit card', 'Downgrades to Free automatically', 'Everything in Free', '1 user seat', 'Unlimited snapshots', 'Cloud save & sync', 'Risk analyzer', 'Snapshot diff viewer', 'Flag expiration alerts', 'Shareable public links', 'Audit log export'],
                   cta: 'Start Free Trial', highlight: false, plan: 'solo',
                 },
                {
                  name: 'Pro', price: '$149', period: 'per month',
                  color: '#58a6ff',
                  description: 'For small teams managing release risk together.',
                  features: ['7-day free trial, no credit card', 'Downgrades to Free automatically', 'Everything in Solo', 'Up to 5 team seats', 'Team RBAC', 'Slack workflow payloads', 'Shared team workspace', 'Priority support'],
                  cta: 'Start Free Trial', highlight: false, plan: 'pro',
                },
                {
                  name: 'Team', price: '$299', period: 'per month',
                  color: '#3fb950',
                  description: 'For release teams that need shared visibility and audit-ready workflows.',
                  features: ['7-day free trial, no credit card', 'Downgrades to Free automatically', 'Everything in Pro', 'Up to 15 team seats', 'Risk analyzer', 'Flag expiration alerts', 'Team RBAC', 'Slack workflow payloads', 'Audit log export', 'Release readiness scoring', 'Shared team workspace', 'Priority support'],
                  cta: 'Start Free Trial', highlight: true, plan: 'team',
                },
                {
                  name: 'Enterprise', price: 'Custom', period: 'contact sales',
                  color: '#bc8cff',
                  description: 'For organizations that need security review, onboarding, and custom workflows.',
                  features: ['Everything in Team', 'Custom seats', 'Custom security review', 'SLA targets', 'Dedicated onboarding', 'Custom workflows', 'Custom integrations'],
                  cta: 'Talk to Sales', highlight: false, plan: 'enterprise',
                },
              ].map(tier => {
                const isCurrent = tier.plan === userPlan || (!tier.plan && userPlan === 'free');
                const planOrder = { free: 0, solo: 0.5, pro: 1, team: 2, enterprise: 3 };
                const isUpgrade = tier.plan && planOrder[tier.plan] > planOrder[userPlan];
                const isDowngrade = tier.plan && planOrder[tier.plan] < planOrder[userPlan];
                const alreadyPaid = userPlan !== 'free';
                const ctaLabel = isCurrent ? 'Current plan' : isUpgrade && alreadyPaid ? 'Upgrade via portal' : isDowngrade && alreadyPaid ? 'Downgrade via portal' : tier.cta;
                return (
                <div key={tier.name} style={{ background: isCurrent ? 'rgba(88,166,255,0.05)' : tier.highlight ? 'rgba(63,185,80,0.05)' : '#161b22', border: `1px solid ${isCurrent ? '#58a6ff' : tier.highlight ? tier.color : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                  {isCurrent && <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#58a6ff', color: '#000', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10, letterSpacing: 1 }}>YOUR PLAN</span>}
                  {!isCurrent && tier.highlight && <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#3fb950', color: '#07090e', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10, letterSpacing: 1 }}>BEST FOR TEAMS</span>}
                  <div>
                    <div style={{ color: tier.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{tier.name}</div>
                    <div style={{ color: '#e6edf3', fontSize: 28, fontWeight: 800 }}>{tier.price}</div>
                    <div style={{ color: '#8b949e', fontSize: 11 }}>{tier.period}</div>
                    <div style={{ color: '#8b949e', fontSize: 12, lineHeight: 1.45, marginTop: 10 }}>{tier.description}</div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                    {tier.features.map(f => (
                      <li key={f} style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: tier.color }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    disabled={isCurrent}
                    style={{ background: isCurrent ? 'rgba(255,255,255,0.05)' : tier.highlight ? '#3fb950' : 'none', color: isCurrent ? '#484f58' : tier.highlight ? '#07090e' : tier.color, border: `1px solid ${isCurrent ? 'rgba(255,255,255,0.1)' : tier.color}`, borderRadius: 6, padding: '9px 0', fontWeight: 700, fontSize: 13, cursor: isCurrent ? 'default' : 'pointer', marginTop: 8 }}
                    onClick={async () => {
                      if (isCurrent) return;
                      if (tier.plan === 'enterprise') { window.location.href = 'mailto:hello@compassultra.com?subject=Compass Ultra Enterprise Plan Inquiry'; return; }
                      if (tier.plan === 'free' || !tier.plan) { setShowPricing(false); return; }
                      if (!isAuthenticated) { loginWithEmail(); return; }
                      if (alreadyPaid && (isUpgrade || isDowngrade)) {
                        try {
                          const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
                          const { url } = await api.openPortal(token);
                          window.location.href = url;
                        } catch (e) { alert('Could not open portal. Please try again.'); }
                        return;
                      }
                      try {
                        const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
                        const { url } = await api.createCheckout(token, tier.plan);
                        window.location.href = url;
                      } catch (e) { alert('Checkout error: ' + (e.message || 'Please try again.')); }
                    }}
                  >
                    {ctaLabel}
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {killToast && <div className="kill-switch-toast">{killToast}</div>}

      <button
        type="button"
        className="kill-switch-fab"
        onClick={() => setShowKillSwitch(true)}
        title="Emergency Kill Switch — roll back all flags to last known safe state"
        aria-label="Emergency Kill Switch"
      >
        <AlertTriangle size={18} />
        KILL SWITCH
      </button>

      {showKillSwitch && (
        <div className="kill-switch-overlay" onClick={() => setShowKillSwitch(false)}>
          <div className="kill-switch-modal" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowKillSwitch(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 18 }}>×</button>
            <h2>Emergency Kill Switch</h2>
            <p>
              This will immediately roll back all flags to the last known good state saved in your browser.
              Current flags will be saved as an emergency checkpoint. A Slack alert will be sent.
            </p>
            <div className="kill-info" style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 12, color: '#8b949e' }}>
              <div style={{ marginBottom: 4 }}>Active flags to revert: <strong style={{ color: '#e6edf3' }}>{flags.filter(f => f.enabled).length}</strong></div>
              <div style={{ marginBottom: 4 }}>Critical flags active: <strong style={{ color: '#f85149' }}>{criticalActive}</strong></div>
              <div>Last checkpoint: <strong style={{ color: '#e6edf3' }}>{localStorage.getItem('compass-ultra-last-known-good') ? 'Available' : 'Not saved yet — will reset workspace'}</strong></div>
            </div>
            <div className="kill-actions">
              <button type="button" className="kill-cancel" onClick={() => setShowKillSwitch(false)}>Cancel</button>
              <button type="button" className="kill-confirm" onClick={executeKillSwitch}>
                <AlertTriangle size={15} />
                Activate Kill Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({ icon, label, value }) {
  return (
    <article className="metric">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function WorkspaceGuide() {
  const sections = [
    {
      title: '1. Connect Your Flag Data',
      icon: <BookOpenCheck size={17} aria-hidden="true" />,
      body: [
        'Compass Ultra integrates with LaunchDarkly, Statsig, Firebase Remote Config, and any JSON-based flag provider. Import your flag export directly from your provider dashboard — your full flag inventory loads in seconds.',
        'Fill in the Release Control panel — change ticket, release train, captain, and deployment window. These fields populate every generated artifact, runbook, and integration payload automatically.',
        'Every workspace state persists to the cloud. Named snapshots let you checkpoint a release at any stage and return to it exactly as you left it — across devices, across your team.',
      ],
    },
    {
      title: '2. Set Your Team and Permissions',
      icon: <Users size={17} aria-hidden="true" />,
      body: [
        'Compass Ultra enforces three access tiers. Admins control integrations, team configuration, and release ownership. Operators manage flag state and release metadata. Viewers have full read access with a complete audit trail.',
        'Every permission boundary is hard-enforced and logged. Blocked actions are recorded with the actor, role, timestamp, and the specific gate that denied access — no silent failures, no undocumented overrides.',
        'RBAC is built for real release reviews — not just access control. Stakeholders and external auditors get exactly the visibility they need without the ability to mutate release state.',
      ],
    },
    {
      title: '3. Evaluate Flags Against Real User Segments',
      icon: <UserRound size={17} aria-hidden="true" />,
      body: [
        'The Evaluation Context engine resolves all flag rules against a specific user profile — environment, plan tier, role, region, device type, and arbitrary custom attributes you define.',
        'Saved context presets let you instantly replay your flag configuration for any customer segment: enterprise, free trial, EU region, mobile-only, or any internal persona your team has defined.',
        'Every flag evaluation shows its resolution reason — whether the value came from a targeting rule, a manual override, a rollout bucket, or a default. No guesswork about why a flag is on or off for a given user.',
      ],
    },
    {
      title: '4. Review Risk Before You Ship',
      icon: <ShieldCheck size={17} aria-hidden="true" />,
      body: [
        'The flag table surfaces evaluated value, criticality, source provider, rollout percentage, and resolution reason for every flag in your release — in one view, before any change touches production.',
        'Policy Checks run automatically across your entire flag set: change ticket coverage, approver assignments, expiration date compliance, canary rollout thresholds, dependency chain integrity, and provider health.',
        'The Risk Analyzer generates a structured release assessment from the current workspace state. It uses the live backend AI service when configured and falls back to a deterministic local risk engine when the service is unavailable.',
      ],
    },
    {
      title: '5. Save and Share Snapshots',
      icon: <CloudCog size={17} aria-hidden="true" />,
      body: [
        'Cloud snapshots capture the complete release state — flag configuration, evaluation context, release metadata, policy check results, and audit history — timestamped and stored under your account.',
        'The Snapshot Diff viewer compares any two snapshots side by side. Added, removed, and changed flags are highlighted individually so you can see exactly what shifted between your last checkpoint and now.',
        'Any snapshot can be shared as a public link. Recipients load the exact workspace state — no account required. Built for handoffs to change advisory boards, on-call engineers, or external auditors.',
      ],
    },
    {
      title: '6. Generate DevOps Handoff Artifacts',
      icon: <Rocket size={17} aria-hidden="true" />,
      body: [
        'PDF Release Runbooks include gate status, policy check results, active flag evaluations, and per-flag rollback procedures. Formatted for management review, CAB submission, or incident war room reference.',
        'Integration payloads for GitHub Issues, Jira change tickets, and Slack workflow-compatible updates are generated from live workspace state. POST via a configured workflow/proxy endpoint or copy the JSON for manual submission. A full installed Slack app can come later.',
        'The SDK Payload delivers machine-readable evaluated flag values with ownership, ticket references, criticality ratings, and evaluation reasons attached — ready for downstream applications and deployment pipelines.',
      ],
    },
  ];

  return (
    <section className="workspace-guide" aria-label="Compass Ultra documentation">
      <details className="guide-dropdown">
        <summary>
          <span className="guide-kicker">Compass Ultra - Release Intelligence Platform</span>
          <strong>How Compass Ultra works</strong>
          <small>Open the release intelligence guide</small>
        </summary>
      <div className="guide-intro">
        <div>
          <span className="guide-kicker">Compass Ultra — Release Intelligence Platform</span>
          <h1>Ship with confidence. Every flag, every risk, every time.</h1>
          <p>
            Compass Ultra gives engineering and DevOps teams a single control plane for feature flag releases — live flag evaluation, enterprise policy enforcement, AI-powered risk analysis, and automated handoff artifacts, all before a single change touches production.
          </p>
        </div>
      </div>
      <div className="guide-tabs">
        {sections.map((section) => (
          <details key={section.title}>
            <summary>
              <span>{section.icon}</span>
              <strong>{section.title}</strong>
            </summary>
            <div className="guide-body">
              {section.body.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
      </details>
    </section>
  );
}

function loadWorkspace() {
  if (typeof window === 'undefined') return hydrateWorkspace({});

  const fromUrl = readWorkspaceFromUrl();
  if (fromUrl) return hydrateWorkspace(fromUrl);

  try {
    return hydrateWorkspace(JSON.parse(window.localStorage.getItem(storageKey)));
  } catch {
    return hydrateWorkspace({});
  }
}

function makeDemoSnapshots(flags, context, release) {
  const beforeFlags = flags.map((flag) => ({ ...flag, rollout: Math.min(flag.rollout, 25), overrideValue: null }));
  const afterFlags = flags.map((flag) => {
    if (flag.key === 'checkout.express_pay') return { ...flag, rollout: 45 };
    if (flag.key === 'promos.flash_sale_engine') return { ...flag, enabled: true, rollout: 100 };
    if (flag.key === 'payments.stripe_v4') return { ...flag, enabled: false };
    return flag;
  });

  return [
    {
      id: 'demo-before',
      name: 'Demo baseline checkpoint',
      created_at: '2026-05-01T14:00:00.000Z',
      snapshot_data: {
        workspaceName: 'Demo Retail — Baseline',
        release: { ...release, changeTicket: 'CHG-1840' },
        context,
        flags: beforeFlags,
      },
    },
    {
      id: 'demo-after',
      name: 'Demo peak-sale rollout',
      created_at: '2026-05-01T16:30:00.000Z',
      snapshot_data: {
        workspaceName: 'Demo Retail — Peak Sale Release',
        release: { ...release, changeTicket: 'CHG-1850' },
        context,
        flags: afterFlags,
      },
    },
  ];
}

function makeDemoAiAnalysis(workspaceName, release, context, flags, policyChecks) {
  const blocked = policyChecks.filter((check) => check.status === 'block');
  const warnings = policyChecks.filter((check) => check.status === 'warn');
  const evaluations = flags.map((flag) => ({ flag, result: evaluateFlag(flag, context) }));
  const activeHighRisk = evaluations.filter(({ flag, result }) => ['critical', 'high'].includes(flag.criticality) && Boolean(result.value));
  const canaryBreaches = flags.filter((flag) => flag.enabled && flag.canaryRequired && flag.rollout > 50 && context.environment === 'production');
  const brokenDeps = flags.flatMap((flag) =>
    flag.enabled
      ? flag.dependencies
        .filter((dependency) => !flags.find((item) => item.key === dependency && item.enabled))
        .map((dependency) => ({ flag, dependency }))
      : []
  );
  const prodOverrides = flags.filter((flag) => flag.overrideValue !== null && context.environment === 'production');
  const staleOrMissingExpiry = flags.filter((flag) => flag.enabled && !flag.expiresAt);
  const ruleMatches = evaluations.filter(({ result }) => result.reason === 'rule');
  const rolloutMatches = evaluations.filter(({ result }) => result.reason === 'rollout');
  const blockerScore = blocked.length * 3 + brokenDeps.length * 3 + prodOverrides.length * 2 + canaryBreaches.length + warnings.length;
  const riskLevel = blockerScore >= 8 || (activeHighRisk.length >= 5 && canaryBreaches.length >= 2)
    ? 'CRITICAL'
    : blockerScore >= 4 || brokenDeps.length > 0 || blocked.length > 0
      ? 'HIGH'
      : blockerScore >= 1 || activeHighRisk.length > 0
        ? 'MEDIUM'
        : 'LOW';
  const decision = riskLevel === 'LOW' ? 'SHIP' : riskLevel === 'MEDIUM' ? 'SHIP WITH CAUTION' : 'HOLD';
  const topFlagNames = (items) => items.slice(0, 3).map((item) => item.flag?.key || item.key).join(', ');
  const findings = [];

  if (blocked.length) findings.push(`${blocked.length} blocking policy gate(s): ${blocked.map((check) => check.title).join('; ')}.`);
  if (warnings.length) findings.push(`${warnings.length} warning gate(s): ${warnings.map((check) => check.title).join('; ')}.`);
  if (activeHighRisk.length) findings.push(`${activeHighRisk.length} high or critical flags evaluate active for ${context.role || 'user'} in ${context.environment || 'production'}: ${topFlagNames(activeHighRisk)}.`);
  if (canaryBreaches.length) findings.push(`Canary limits are exceeded by ${canaryBreaches.map((flag) => `${flag.key} at ${flag.rollout}%`).join(', ')}.`);
  if (brokenDeps.length) findings.push(`Dependency gap: ${brokenDeps.map(({ flag, dependency }) => `${flag.key} needs ${dependency}`).join('; ')}.`);
  if (prodOverrides.length) findings.push(`Production override active on ${prodOverrides.map((flag) => flag.key).join(', ')}.`);
  if (staleOrMissingExpiry.length) findings.push(`Missing expiration metadata on ${staleOrMissingExpiry.map((flag) => flag.key).join(', ')}.`);
  if (!findings.length) findings.push('No blockers found for the current context, rollout, dependency, and policy state.');

  const actions = [];
  if (brokenDeps.length) actions.push(`Enable or remove the dependency before rollout: ${brokenDeps.map(({ dependency }) => dependency).join(', ')}.`);
  if (canaryBreaches.length) actions.push(`Reduce canary-required rollouts to 50% or lower: ${canaryBreaches.map((flag) => flag.key).join(', ')}.`);
  if (blocked.length) actions.push(`Clear blocking gates: ${blocked.map((check) => check.title).join(', ')}.`);
  if (warnings.length && !blocked.length) actions.push(`Review warning gates before approving: ${warnings.map((check) => check.title).join(', ')}.`);
  if (prodOverrides.length) actions.push(`Remove production overrides on ${prodOverrides.map((flag) => flag.key).join(', ')}.`);
  if (!actions.length) actions.push('Save a clean snapshot, export the runbook, and proceed with normal release approval.');

  return [
    `# ${workspaceName || 'Demo Retail Release'} Risk Analysis`,
    '',
    `## RISK LEVEL: ${riskLevel}`,
    '',
    `Decision: ${decision}.`,
    `Change ticket ${release.changeTicket || 'CHG-DEMO'} currently has ${blocked.length} blocking gate(s), ${warnings.length} warning gate(s), and ${activeHighRisk.length} active high-risk evaluation path(s).`,
    `Context evaluated: ${context.environment || 'production'} / ${context.tenant || 'demo-retail-prod'} / ${context.role || 'role'} / ${context.region || 'region'} / ${context.device || 'device'}.`,
    '',
    '## Key Findings',
    ...findings.slice(0, 6).map((finding) => `- ${finding}`),
    '',
    '## Immediate Fix List',
    ...actions.map((action) => `- ${action}`),
    '',
    '## Evidence Snapshot',
    `- Enabled flags: ${flags.filter((flag) => flag.enabled).length}/${flags.length}.`,
    `- Rule matches: ${ruleMatches.length}; rollout evaluations: ${rolloutMatches.length}.`,
    `- Selected release train: ${release.train || 'not set'}; window: ${release.window || 'not set'}.`,
    `- Highest-risk flags: ${activeHighRisk.slice(0, 5).map(({ flag }) => `${flag.key} (${flag.criticality})`).join(', ') || 'none active'}.`,
    '',
    'This public-demo analysis is generated from the current workspace state, so toggles, rollouts, dependencies, and policy gates change the result.',
  ].join('\n');
}

function hydrateWorkspace(input, fallbackName = 'My production workspace') {
  const importedFlags = normalizeImportedFlags(input);
  return {
    workspaceName: input?.workspaceName || input?.name || fallbackName,
    release: { ...defaultRelease, ...(input?.release || {}) },
    team: normalizeTeam(input?.team),
    integrations: normalizeIntegrations(input?.integrations),
    context: { ...defaultContext, ...(input?.context || {}) },
    flags: importedFlags.length ? importedFlags.map(normalizeFlag) : [],
    audit: normalizeAudit(input?.audit),
  };
}

function normalizeTeam(team) {
  const nextTeam = { ...defaultTeam, ...(team || {}) };
  const members = Array.isArray(team?.members) && team.members.length ? team.members : defaultTeam.members;
  const activeMemberId = members.some((member) => member.id === nextTeam.activeMemberId)
    ? nextTeam.activeMemberId
    : members[0]?.id || defaultTeam.activeMemberId;

  return { ...nextTeam, members, activeMemberId };
}

function normalizeIntegrations(integrations) {
  if (!Array.isArray(integrations)) return defaultIntegrations;
  return defaultIntegrations.map((defaultIntegration) => ({
    ...defaultIntegration,
    ...(integrations.find((item) => item.id === defaultIntegration.id) || {}),
  }));
}

function normalizeAudit(audit) {
  if (!Array.isArray(audit) || !audit.length) {
    return [{ id: 'boot', time: timeNow(), actor: 'System', role: 'system', level: 'info', action: 'Workspace ready', detail: 'Local audit initialized' }];
  }

  return audit.map((event) => ({
    id: event.id || `${Date.now()}-${Math.random()}`,
    time: event.time || timeNow(),
    actor: event.actor || 'System',
    role: event.role || 'system',
    level: event.level || 'info',
    action: event.action || 'Event',
    detail: event.detail || '',
  }));
}

function normalizeImportedFlags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.flags)) return input.flags;
  if (Array.isArray(input.items)) return input.items.map(fromLaunchDarkly);
  if (Array.isArray(input.feature_gates)) return input.feature_gates.map(fromStatsig);
  if (Array.isArray(input.gates)) return input.gates.map(fromStatsig);
  if (input.parameters && typeof input.parameters === 'object') return Object.entries(input.parameters).map(fromFirebase);
  return [];
}

function fromLaunchDarkly(item) {
  return {
    key: item.key,
    name: item.name || item.key,
    owner: item.tags?.[0] || 'LaunchDarkly',
    type: typeof item.fallthrough?.variation === 'number' ? 'variant' : 'boolean',
    enabled: item.on ?? true,
    defaultValue: Boolean(item.offVariation),
    rollout: item.fallthrough?.rollout?.variations?.[0]?.weight ? Math.round(item.fallthrough.rollout.variations[0].weight / 1000) : 100,
    criticality: item.key?.includes('checkout') || item.key?.includes('privacy') ? 'high' : 'medium',
    jira: 'IMPORT-001',
    approver: 'Provider Owner',
    expiresAt: '2026-12-31',
    rollback: `Disable ${item.key}.`,
    canaryRequired: true,
    dependencies: [],
    tags: item.tags || ['launchdarkly'],
    source: 'LaunchDarkly',
  };
}

function fromStatsig(item) {
  return {
    key: item.name || item.id,
    name: item.description || item.name || item.id,
    owner: 'Statsig',
    type: 'boolean',
    enabled: item.isEnabled ?? item.enabled ?? true,
    defaultValue: false,
    rollout: item.rollout || 100,
    criticality: item.name?.includes('sso') ? 'critical' : 'medium',
    jira: 'IMPORT-001',
    approver: 'Experiment Owner',
    expiresAt: '2026-12-31',
    rollback: `Disable ${item.name || item.id}.`,
    canaryRequired: true,
    dependencies: [],
    tags: ['statsig'],
    source: 'Statsig',
  };
}

function fromFirebase([key, value]) {
  const raw = value?.defaultValue?.value ?? value?.defaultValue ?? false;
  return {
    key,
    name: key,
    owner: 'Firebase',
    type: raw === 'true' || raw === 'false' ? 'boolean' : 'variant',
    enabled: true,
    defaultValue: raw === 'true' ? true : raw === 'false' ? false : raw,
    rollout: 100,
    criticality: key.includes('paywall') ? 'high' : 'low',
    jira: 'IMPORT-001',
    approver: 'Mobile Owner',
    expiresAt: '2026-12-31',
    rollback: `Restore Firebase default for ${key}.`,
    canaryRequired: key.includes('paywall'),
    dependencies: [],
    tags: ['firebase', 'mobile'],
    source: 'Firebase',
  };
}

function normalizeFlag(flag) {
  const type = flag.type || inferType(flag.defaultValue);
  const normalized = {
    key: slugKey(flag.key || flag.id || flag.name),
    name: flag.name || flag.key || flag.id || 'Untitled flag',
    owner: flag.owner || 'Product',
    type,
    enabled: flag.enabled ?? true,
    defaultValue: normalizeValue(flag.defaultValue ?? false, type),
    overrideValue: flag.overrideValue === undefined ? null : normalizeValue(flag.overrideValue, type),
    rollout: clamp(Number(flag.rollout ?? flag.exposure ?? 100), 0, 100),
    criticality: flag.criticality || 'medium',
    jira: flag.jira || 'DCG-untracked',
    approver: flag.approver || 'Release Captain',
    expiresAt: flag.expiresAt || '2026-12-31',
    rollback: flag.rollback || `Disable ${flag.key || flag.name}.`,
    canaryRequired: Boolean(flag.canaryRequired),
    dependencies: Array.isArray(flag.dependencies) ? flag.dependencies : [],
    tags: Array.isArray(flag.tags) ? flag.tags : [],
    rules: Array.isArray(flag.rules) ? flag.rules : [],
    variants: Array.isArray(flag.variants) ? flag.variants : undefined,
    source: flag.source || 'Imported',
  };

  if (normalized.type === 'variant' && !normalized.variants) {
    normalized.variants = uniqueValues([normalized.defaultValue, normalized.overrideValue, 'control', 'treatment'].filter((item) => item !== null));
  }

  return normalized;
}

function evaluateFlag(flag, context) {
  if (!flag.enabled) return { value: flag.defaultValue, reason: 'disabled', detail: 'Flag is disabled' };
  if (flag.overrideValue !== null) return { value: flag.overrideValue, reason: 'override', detail: 'Manual override is active' };

  const matchedRule = flag.rules?.find((rule) => matchesRule(rule, context));
  if (matchedRule) {
    return {
      value: normalizeValue(matchedRule.valueWhenMatched ?? defaultRuleValue(flag), flag.type),
      reason: 'rule',
      detail: `${matchedRule.attribute} ${matchedRule.operator} ${matchedRule.value}`,
    };
  }

  if (flag.type === 'boolean') {
    const bucket = hashBucket(`${context.key || context.email || 'anonymous'}:${flag.key}`);
    const value = bucket < flag.rollout;
    return { value, reason: 'rollout', detail: `bucket ${bucket} of 100` };
  }

  return { value: flag.defaultValue, reason: 'default', detail: 'Default variation' };
}

function makePolicyChecks(flags, evaluations, context, release, integrations = defaultIntegrations) {
  const today = new Date();
  const activeCritical = evaluations.filter(({ flag, result }) => ['critical', 'high'].includes(flag.criticality) && Boolean(result.value));
  const missingChange = flags.filter((flag) => !flag.jira || flag.jira === 'DCG-untracked');
  const expired = flags.filter((flag) => flag.enabled && new Date(`${flag.expiresAt}T00:00:00`) < today);
  const prodOverrides = context.environment === 'production' ? flags.filter((flag) => flag.overrideValue !== null) : [];
  const canaryBreaches = flags.filter((flag) => flag.enabled && flag.canaryRequired && flag.rollout > 50 && context.environment === 'production');
  const brokenDeps = flags.filter((flag) =>
    flag.enabled && flag.dependencies.some((dependency) => !flags.find((item) => item.key === dependency && item.enabled))
  );
  const configuredProviders = integrations.filter((integration) => integration.kind === 'provider' && (integration.endpoint || integration.apiKey)).length;
  const configuredOutbound = integrations.filter((integration) => integration.kind === 'outbound' && integration.endpoint).length;

  return [
    {
      id: 'change-ticket',
      status: release.changeTicket ? 'pass' : 'block',
      title: 'Change ticket attached',
      detail: release.changeTicket ? `${release.changeTicket} controls this rollout.` : 'Add a CHG or Jira ticket before production.',
    },
    {
      id: 'critical-approvals',
      status: activeCritical.every(({ flag }) => flag.approver && flag.approver !== 'Release Captain') ? 'pass' : 'block',
      title: 'Critical flags have approvers',
      detail: `${activeCritical.length} high or critical active evaluation paths checked.`,
    },
    {
      id: 'missing-change',
      status: missingChange.length ? 'warn' : 'pass',
      title: 'Every flag has traceability',
      detail: missingChange.length ? `${missingChange.length} flags need Jira/change IDs.` : 'All flags have traceable IDs.',
    },
    {
      id: 'expires',
      status: expired.length ? 'block' : 'pass',
      title: 'No expired flags enabled',
      detail: expired.length ? `${expired.length} enabled flags are past expiration.` : 'Flag expiration dates are clean.',
    },
    {
      id: 'prod-overrides',
      status: prodOverrides.length ? 'warn' : 'pass',
      title: 'Production override discipline',
      detail: prodOverrides.length ? `${prodOverrides.length} manual overrides active in production.` : 'No manual prod overrides.',
    },
    {
      id: 'canary',
      status: canaryBreaches.length ? 'block' : 'pass',
      title: 'Canary rollout limit',
      detail: canaryBreaches.length ? `${canaryBreaches.length} canary-required flags exceed 50%.` : 'Canary-required flags stay within policy.',
    },
    {
      id: 'dependencies',
      status: brokenDeps.length ? 'block' : 'pass',
      title: 'Dependencies enabled',
      detail: brokenDeps.length ? `${brokenDeps.length} enabled flags have disabled dependencies.` : 'Flag dependency graph is satisfied.',
    },
    {
      id: 'provider-adapters',
      status: configuredProviders ? 'pass' : 'warn',
      title: 'Live provider adapters configured',
      detail: configuredProviders ? `${configuredProviders} read-only provider endpoints configured.` : 'Add proxy/export URLs for live LaunchDarkly, Statsig, or Firebase sync.',
    },
    {
      id: 'outbound-hooks',
      status: configuredOutbound ? 'pass' : 'warn',
      title: 'Outbound DevOps hooks configured',
      detail: configuredOutbound ? `${configuredOutbound} GitHub/Jira/Slack webhook endpoints configured.` : 'Payload copy works now; configure webhooks for one-click posting.',
    },
  ];
}

function getReleaseState(checks) {
  const blocked = checks.filter((check) => check.status === 'block').length;
  const warnings = checks.filter((check) => check.status === 'warn').length;
  const passed = checks.filter((check) => check.status === 'pass').length;
  const score = Math.round((passed / checks.length) * 100);

  if (blocked) return { state: 'blocked', label: 'Blocked', score, icon: <XCircle size={16} aria-hidden="true" /> };
  if (warnings) return { state: 'warn', label: 'Needs review', score, icon: <AlertTriangle size={16} aria-hidden="true" /> };
  return { state: 'ready', label: 'Ready', score, icon: <CheckCircle2 size={16} aria-hidden="true" /> };
}

function makeRunbook(workspaceName, release, context, evaluations, checks) {
  const active = evaluations.filter(({ result }) => Boolean(result.value)).slice(0, 12);
  const failed = checks.filter((check) => check.status !== 'pass');

  return [
    `# ${workspaceName}`,
    '',
    `Change: ${release.changeTicket}`,
    `Train: ${release.train}`,
    `Captain: ${release.releaseCaptain}`,
    `Approver: ${release.approver}`,
    `Window: ${release.window}`,
    `Incident channel: ${release.incidentChannel}`,
    '',
    '## Context',
    ...Object.entries(context).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Gate Status',
    ...(failed.length
      ? failed.map((check) => `- ${check.status.toUpperCase()}: ${check.title} - ${check.detail}`)
      : ['- PASS: all enterprise checks passed']),
    '',
    '## Active Evaluations',
    ...active.map(({ flag, result }) => `- ${flag.key}: ${formatValue(result.value)} (${result.reason}) owner=${flag.owner} ticket=${flag.jira}`),
    '',
    '## Rollback',
    ...active.map(({ flag }) => `- ${flag.key}: ${flag.rollback}`),
  ].join('\n');
}

function makeIntegrationPayloads(workspaceName, release, context, evaluations, checks, runbook) {
  const failed = checks.filter((check) => check.status !== 'pass');
  const summary = {
    workspaceName,
    changeTicket: release.changeTicket,
    releaseTrain: release.train,
    environment: context.environment,
    gateStatus: failed.length ? 'needs-review' : 'ready',
    failedChecks: failed.map((check) => ({ id: check.id, status: check.status, title: check.title, detail: check.detail })),
    activeFlags: evaluations
      .filter(({ result }) => Boolean(result.value))
      .map(({ flag, result }) => ({
        key: flag.key,
        value: result.value,
        reason: result.reason,
        owner: flag.owner,
        ticket: flag.jira,
        criticality: flag.criticality,
      })),
  };

  return {
    generic: summary,
    github: {
      title: `${release.changeTicket}: ${workspaceName} release gate`,
      labels: ['compass-ultra', 'release-readiness', summary.gateStatus],
      body: runbook,
    },
    jira: {
      fields: {
        project: { key: 'DCG' },
        summary: `${workspaceName} release gate - ${summary.gateStatus}`,
        issuetype: { name: 'Change' },
        description: runbook,
        labels: ['compass-ultra', release.train],
      },
    },
    slack: {
      text: `${workspaceName} is ${summary.gateStatus} for ${release.changeTicket}`,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: 'Compass-Ultra release gate' } },
        { type: 'section', text: { type: 'mrkdwn', text: `*${workspaceName}*\nChange: ${release.changeTicket}\nStatus: ${summary.gateStatus}` } },
        { type: 'section', text: { type: 'mrkdwn', text: failed.length ? failed.map((check) => `*${check.status}* ${check.title}`).join('\n') : 'All enterprise checks passed.' } },
      ],
    },
    launchdarkly: summary,
    statsig: summary,
    firebase: summary,
  };
}

function formatAuditMeta(event) {
  const actor = event.actor || 'System';
  const role = event.role || 'system';
  const detail = event.detail ? ` - ${event.detail}` : '';
  return `${actor} (${role})${detail}`;
}

function matchesRule(rule, context) {
  const actual = String(context[rule.attribute] ?? '').toLowerCase();
  const expected = String(rule.value ?? '').toLowerCase();
  if (rule.operator === 'notEquals') return actual !== expected;
  if (rule.operator === 'contains') return actual.includes(expected);
  return actual === expected;
}

function makeSdkSnippet(workspaceName, context, flags) {
  const payload = {
    workspace: workspaceName,
    context,
    evaluations: flags.reduce((acc, flag) => {
      const result = evaluateFlag(flag, context);
      acc[flag.key] = {
        value: result.value,
        reason: result.reason,
        owner: flag.owner,
        ticket: flag.jira,
        criticality: flag.criticality,
      };
      return acc;
    }, {}),
  };

  return `window.__COMPASS_ULTRA__ = ${JSON.stringify(payload, null, 2)};`;
}

function overrideOptions(flag) {
  if (flag.type === 'boolean') {
    return [
      { value: 'true', label: 'true' },
      { value: 'false', label: 'false' },
    ];
  }

  if (flag.type === 'json') {
    return [
      { value: JSON.stringify(flag.defaultValue), label: 'default json' },
      { value: '{"enabled":true}', label: 'enabled json' },
    ];
  }

  return uniqueValues([...(flag.variants || []), flag.defaultValue]).map((value) => ({
    value: String(value),
    label: String(value),
  }));
}

function serializeOverride(value) {
  return value === null ? '__null__' : typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function deserializeOverride(value, flag) {
  if (value === '__null__') return null;
  return normalizeValue(value, flag.type);
}

function parseTypedValue(value, type) {
  if (type === 'boolean') return value === true || String(value).toLowerCase() === 'true';
  if (type === 'json') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return String(value || 'control');
}

function normalizeValue(value, type) {
  if (value === null) return null;
  if (type === 'boolean') return value === true || String(value).toLowerCase() === 'true';
  if (type === 'json') {
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return String(value);
}

function defaultRuleValue(flag) {
  if (flag.type === 'boolean') return true;
  if (flag.type === 'json') return flag.defaultValue;
  return flag.variants?.[1] || 'treatment';
}

function inferType(value) {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'object') return 'json';
  return 'variant';
}

function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function slugKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
}

function hashBucket(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value)))];
}

function timeNow() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function toSlackMrkdwn(text) {
  return text
    .replace(/^# (.+)$/gm, '*$1*')
    .replace(/^## (.+)$/gm, '*$1*')
    .replace(/^### (.+)$/gm, '_$1_')
    .replace(/^- /gm, '• ')
    .replace(/\*\*(.+?)\*\*/g, '*$1*');
}

function encodeWorkspace(workspace) {
  const bytes = new TextEncoder().encode(JSON.stringify(workspace));
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function readWorkspaceFromUrl() {
  try {
    const encoded = new URLSearchParams(window.location.search).get('workspace');
    if (!encoded) return null;
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
