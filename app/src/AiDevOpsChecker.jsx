import { useMemo, useState } from 'react';
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, CircleAlert, FileDown, GitBranch, MessageSquareText, RefreshCw, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from './api.js';
import './AiDevOpsChecker.css';

const STORAGE_KEY = 'compass-ultra-workspace-v4';

const demoWorkspace = {
  workspaceName: 'Demo Retail - Peak Sale Command',
  release: {
    train: 'peak-sale-2026.11',
    environment: 'production',
    changeTicket: 'CHG-20261120',
    window: 'Thu 23:00-01:00 ET',
  },
  flags: [
    { key: 'checkout.express_pay', enabled: true, criticality: 'high', rollout: 45, owner: 'Growth', expiresAt: '2026-12-01', dependencies: ['payments.stripe_v4'] },
    { key: 'payments.stripe_v4', enabled: true, criticality: 'critical', rollout: 100, owner: 'Payments', expiresAt: '2026-11-30', dependencies: [] },
    { key: 'inventory.realtime_sync', enabled: true, criticality: 'high', rollout: 60, owner: 'Platform', expiresAt: '2026-11-28', dependencies: [] },
    { key: 'search.ai_rankings', enabled: true, criticality: 'medium', rollout: 35, owner: 'Search', expiresAt: '2027-01-15', dependencies: [] },
    { key: 'promos.flash_sale_engine', enabled: false, criticality: 'high', rollout: 0, owner: 'Growth', expiresAt: 'not set', dependencies: ['inventory.realtime_sync'] },
  ],
};

const quickPrompts = [
  'Run a live release readiness check.',
  'What should block this release?',
  'Build me a rollback plan.',
  'What should the GitHub, Jira, and Slack payloads include?',
];

function safeWorkspaceFromStorage() {
  if (typeof window === 'undefined') return { ...demoWorkspace, source: 'demo fallback' };

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    if (parsed && Array.isArray(parsed.flags) && parsed.flags.length) {
      return {
        ...demoWorkspace,
        ...parsed,
        release: { ...demoWorkspace.release, ...(parsed.release || {}) },
        flags: parsed.flags,
        source: 'live app workspace',
      };
    }
  } catch {
    // Fall through to the demo workspace if local storage is unavailable or malformed.
  }

  return { ...demoWorkspace, source: 'demo fallback' };
}

function makeChecks(flags, release) {
  const highRollout = flags.filter((flag) => flag.enabled && ['high', 'critical'].includes(String(flag.criticality).toLowerCase()) && Number(flag.rollout || 0) >= 70);
  const missingExpiry = flags.filter((flag) => flag.enabled && (!flag.expiresAt || flag.expiresAt === 'not set'));
  const brokenDeps = flags.filter((flag) => flag.enabled && Array.isArray(flag.dependencies) && flag.dependencies.some((dep) => !flags.find((item) => item.key === dep && item.enabled)));
  const missingOwner = flags.filter((flag) => flag.enabled && !flag.owner);

  return [
    { label: 'Change ticket attached', status: release?.changeTicket ? 'pass' : 'block', detail: release?.changeTicket || 'Missing change ticket' },
    { label: 'High-risk rollout exposure', status: highRollout.length ? 'warn' : 'pass', detail: highRollout.length ? `${highRollout.length} high-risk rollout(s) at 70%+` : 'No high-risk rollout over policy threshold' },
    { label: 'Flag expirations', status: missingExpiry.length ? 'block' : 'pass', detail: missingExpiry.length ? `${missingExpiry.length} enabled flag(s) missing expiration` : 'Expiration metadata present' },
    { label: 'Dependencies enabled', status: brokenDeps.length ? 'block' : 'pass', detail: brokenDeps.length ? `${brokenDeps.length} dependency gap(s)` : 'Dependency graph is satisfied' },
    { label: 'Owners assigned', status: missingOwner.length ? 'warn' : 'pass', detail: missingOwner.length ? `${missingOwner.length} enabled flag(s) missing owner` : 'Owners present' },
  ];
}

function markdownToBlocks(text) {
  return String(text || '').split('\n').filter(Boolean);
}

export default function AiDevOpsChecker() {
  const [workspace, setWorkspace] = useState(safeWorkspaceFromStorage);
  const [message, setMessage] = useState('Run a live release readiness check.');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const release = workspace.release || demoWorkspace.release;
  const flags = Array.isArray(workspace.flags) ? workspace.flags : demoWorkspace.flags;
  const checks = useMemo(() => makeChecks(flags, release), [flags, release]);

  const readiness = useMemo(() => {
    const enabledHigh = flags.filter((flag) => flag.enabled && ['high', 'critical'].includes(String(flag.criticality).toLowerCase())).length;
    const issues = checks.filter((check) => check.status !== 'pass').length;
    return Math.max(34, 92 - enabledHigh * 10 - issues * 9);
  }, [checks, flags]);

  function refreshWorkspace() {
    const nextWorkspace = safeWorkspaceFromStorage();
    setWorkspace(nextWorkspace);
    setResult(null);
    setError('');
  }

  async function runCheck(nextMessage = message) {
    const nextWorkspace = safeWorkspaceFromStorage();
    const nextRelease = nextWorkspace.release || demoWorkspace.release;
    const nextFlags = Array.isArray(nextWorkspace.flags) ? nextWorkspace.flags : demoWorkspace.flags;
    const nextChecks = makeChecks(nextFlags, nextRelease);

    setWorkspace(nextWorkspace);
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const response = await api.aiDevOpsDemo({
        message: nextMessage,
        release: {
          train: nextRelease.train || 'demo-release',
          environment: nextWorkspace.context?.environment || nextRelease.environment || 'production',
          changeTicket: nextRelease.changeTicket || '',
          window: nextRelease.window || 'not set',
        },
        flags: nextFlags,
        checks: nextChecks,
      });
      setResult(response);
    } catch (err) {
      setError(err.message || 'AI DevOps checker failed');
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="ai-devops-page">
      <section className="ai-devops-hero">
        <a href="/" className="ai-devops-back">Compass Ultra</a>
        <div className="ai-devops-hero-grid">
          <div>
            <div className="ai-devops-badge"><Bot size={16} /> AI DevOps Live Checker</div>
            <h1>Ask the release checker if it is safe to ship.</h1>
            <p>
              A live Compass Ultra assistant that reviews flags, policy gates, rollout exposure,
              rollback evidence, and workflow handoffs before launch.
            </p>
            <div className="ai-devops-actions">
              <button onClick={() => runCheck()} disabled={running}>
                {running ? 'Checking...' : 'Run Live Check'} <ArrowRight size={16} />
              </button>
              <button type="button" onClick={refreshWorkspace} disabled={running}>
                Refresh Workspace <RefreshCw size={16} />
              </button>
              <a href="/app?demo=true">Open release demo</a>
            </div>
          </div>
          <div className="ai-devops-score-card">
            <span>{workspace.source || 'workspace'} readiness</span>
            <strong>{readiness}%</strong>
            <p>{checks.some((check) => check.status === 'block') ? 'HOLD' : checks.some((check) => check.status === 'warn') ? 'WITH CAUTION' : 'READY'}</p>
            <div className="ai-devops-meter"><i style={{ width: `${readiness}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="ai-devops-grid">
        <aside className="ai-devops-panel">
          <h2><ShieldCheck size={18} /> Release Inputs</h2>
          <div className="ai-devops-kv"><span>Workspace</span><strong>{workspace.workspaceName || 'Demo workspace'}</strong></div>
          <div className="ai-devops-kv"><span>Release</span><strong>{release.train || 'demo-release'}</strong></div>
          <div className="ai-devops-kv"><span>Environment</span><strong>{workspace.context?.environment || release.environment || 'production'}</strong></div>
          <div className="ai-devops-kv"><span>Change ticket</span><strong>{release.changeTicket || 'not set'}</strong></div>
          <div className="ai-devops-kv"><span>Window</span><strong>{release.window || 'not set'}</strong></div>

          <h3>Flags Under Review</h3>
          <div className="ai-devops-flags">
            {flags.map((flag) => (
              <div key={flag.key} className="ai-devops-flag">
                <span>{flag.key}</span>
                <strong className={`risk-${flag.criticality}`}>{flag.criticality || 'medium'}</strong>
              </div>
            ))}
          </div>
        </aside>

        <section className="ai-devops-panel ai-devops-chat">
          <h2><MessageSquareText size={18} /> Checker Chat</h2>
          <div className="ai-devops-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => { setMessage(prompt); runCheck(prompt); }}>
                {prompt}
              </button>
            ))}
          </div>
          <label htmlFor="ai-devops-message">Ask a release question</label>
          <textarea
            id="ai-devops-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
          />
          <button className="ai-devops-send" onClick={() => runCheck()} disabled={running}>
            <BrainCircuit size={16} /> {running ? 'Thinking...' : 'Ask AI DevOps'}
          </button>

          {error && <div className="ai-devops-error"><CircleAlert size={16} /> {error}</div>}

          <div className="ai-devops-result">
            {!result && !running && (
              <div className="ai-devops-empty">
                <Sparkles size={22} />
                <p>Run the checker to get a ship / with-caution / hold decision from the current workspace.</p>
              </div>
            )}
            {running && <div className="ai-devops-empty"><Rocket size={22} /><p>Checking flags, policy gates, and runbook evidence...</p></div>}
            {result && (
              <article>
                <div className="ai-devops-decision">
                  <span>{result.mode || 'checker'}</span>
                  <strong>{result.decision || 'WITH CAUTION'}</strong>
                </div>
                {markdownToBlocks(result.answer).map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </article>
            )}
          </div>
        </section>

        <aside className="ai-devops-panel">
          <h2><GitBranch size={18} /> What It Verifies</h2>
          {[
            ['AI risk analysis', 'Decision and blocker summary'],
            ['Policy gates', 'Pass, warn, and block status'],
            ['Snapshot diff', 'What changed before launch'],
            ['PDF runbook', 'CAB-ready evidence'],
            ['Workflow payloads', 'GitHub, Jira, and Slack handoff'],
          ].map(([title, detail]) => (
            <div className="ai-devops-check" key={title}>
              <CheckCircle2 size={16} />
              <span><strong>{title}</strong>{detail}</span>
            </div>
          ))}
          <div className="ai-devops-note">
            <FileDown size={16} />
            API keys stay on the backend. The browser only calls the Compass Ultra API.
          </div>
        </aside>
      </section>
    </main>
  );
}
