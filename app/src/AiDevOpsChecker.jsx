import { useMemo, useState } from 'react';
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, CircleAlert, FileDown, GitBranch, MessageSquareText, Rocket, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from './api.js';
import './AiDevOpsChecker.css';

const demoFlags = [
  { key: 'checkout.express_pay', enabled: true, criticality: 'high', rollout: 45, owner: 'Growth', expiresAt: '2026-12-01', dependencies: ['payments.stripe_v4'] },
  { key: 'payments.stripe_v4', enabled: true, criticality: 'critical', rollout: 100, owner: 'Payments', expiresAt: '2026-11-30', dependencies: [] },
  { key: 'inventory.realtime_sync', enabled: true, criticality: 'high', rollout: 60, owner: 'Platform', expiresAt: '2026-11-28', dependencies: [] },
  { key: 'search.ai_rankings', enabled: true, criticality: 'medium', rollout: 35, owner: 'Search', expiresAt: '2027-01-15', dependencies: [] },
  { key: 'promos.flash_sale_engine', enabled: false, criticality: 'high', rollout: 0, owner: 'Growth', expiresAt: 'not set', dependencies: ['inventory.realtime_sync'] },
];

const demoChecks = [
  { label: 'Change ticket attached', status: 'pass', detail: 'CHG-20261120 present' },
  { label: 'Approver assigned', status: 'pass', detail: 'Platform Approver attached' },
  { label: 'Canary limits respected', status: 'warn', detail: 'payments.stripe_v4 is critical at 100%' },
  { label: 'Flag expirations', status: 'block', detail: 'promos.flash_sale_engine has no expiration date' },
  { label: 'Rollback plan', status: 'pass', detail: 'Per-flag rollback notes are available' },
];

const quickPrompts = [
  'Run a live release readiness check.',
  'What should block this release?',
  'Build me a rollback plan.',
  'What should the GitHub, Jira, and Slack payloads include?',
];

function markdownToBlocks(text) {
  return String(text || '').split('\n').filter(Boolean);
}

export default function AiDevOpsChecker() {
  const [message, setMessage] = useState('Run a live release readiness check.');
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const readiness = useMemo(() => {
    const enabledHigh = demoFlags.filter((flag) => flag.enabled && ['high', 'critical'].includes(flag.criticality)).length;
    const issues = demoChecks.filter((check) => check.status !== 'pass').length;
    return Math.max(34, 92 - enabledHigh * 10 - issues * 9);
  }, []);

  async function runCheck(nextMessage = message) {
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const response = await api.aiDevOpsDemo({
        message: nextMessage,
        release: {
          train: 'peak-sale-2026.11',
          environment: 'production',
          changeTicket: 'CHG-20261120',
          window: 'Thu 23:00-01:00 ET',
        },
        flags: demoFlags,
        checks: demoChecks,
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
              <a href="/app?demo=true">Open release demo</a>
            </div>
          </div>
          <div className="ai-devops-score-card">
            <span>Demo release readiness</span>
            <strong>{readiness}%</strong>
            <p>WITH CAUTION</p>
            <div className="ai-devops-meter"><i style={{ width: `${readiness}%` }} /></div>
          </div>
        </div>
      </section>

      <section className="ai-devops-grid">
        <aside className="ai-devops-panel">
          <h2><ShieldCheck size={18} /> Release Inputs</h2>
          <div className="ai-devops-kv"><span>Release</span><strong>peak-sale-2026.11</strong></div>
          <div className="ai-devops-kv"><span>Environment</span><strong>production</strong></div>
          <div className="ai-devops-kv"><span>Change ticket</span><strong>CHG-20261120</strong></div>
          <div className="ai-devops-kv"><span>Window</span><strong>Thu 23:00-01:00 ET</strong></div>

          <h3>Flags Under Review</h3>
          <div className="ai-devops-flags">
            {demoFlags.map((flag) => (
              <div key={flag.key} className="ai-devops-flag">
                <span>{flag.key}</span>
                <strong className={`risk-${flag.criticality}`}>{flag.criticality}</strong>
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
                <p>Run the checker to get a ship / with-caution / hold decision.</p>
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
