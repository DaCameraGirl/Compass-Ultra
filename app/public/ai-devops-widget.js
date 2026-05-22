(() => {
  const API_BASE = (window.__COMPASS_API_BASE__ || 'https://compass-ultra-backend-production.up.railway.app').replace(/\/+$/, '');
  const STORAGE_KEY = 'compass-ultra-workspace-v4';

  if (window.__compassAiDevOpsWidgetLoaded) return;
  window.__compassAiDevOpsWidgetLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .cu-ai-widget-button {
      position: fixed;
      right: 24px;
      bottom: 92px;
      z-index: 2147483000;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      border: 1px solid rgba(51, 214, 159, 0.42);
      border-radius: 999px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #101827, #162033);
      color: #f4f7fb;
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
      font: 800 13px/1.1 "Segoe UI", system-ui, sans-serif;
      cursor: pointer;
    }
    .cu-ai-widget-button:hover { border-color: #33d69f; transform: translateY(-1px); }
    .cu-ai-widget-button i {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border-radius: 999px;
      background: #33d69f;
      color: #061713;
      font-style: normal;
      font-size: 17px;
    }
    .cu-ai-widget-panel {
      position: fixed;
      right: 24px;
      bottom: 148px;
      z-index: 2147483001;
      display: none;
      width: min(420px, calc(100vw - 32px));
      max-height: min(720px, calc(100vh - 176px));
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      background: #0b1020;
      color: #f4f7fb;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
      font: 14px/1.45 "Segoe UI", system-ui, sans-serif;
    }
    .cu-ai-widget-panel.is-open { display: grid; grid-template-rows: auto 1fr auto; }
    .cu-ai-widget-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: #101827;
    }
    .cu-ai-widget-title { display: grid; gap: 2px; }
    .cu-ai-widget-title strong { font-size: 15px; }
    .cu-ai-widget-title span { color: #9aa7bd; font-size: 12px; }
    .cu-ai-widget-close {
      border: 0;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      background: #162033;
      color: #f4f7fb;
      cursor: pointer;
    }
    .cu-ai-widget-body {
      overflow: auto;
      padding: 14px;
      display: grid;
      gap: 12px;
    }
    .cu-ai-widget-card {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px;
      background: #101827;
    }
    .cu-ai-widget-card strong { display: block; margin-bottom: 5px; }
    .cu-ai-widget-card p { margin: 0; color: #d7e0ee; }
    .cu-ai-widget-prompts { display: flex; flex-wrap: wrap; gap: 8px; }
    .cu-ai-widget-prompts button,
    .cu-ai-widget-send {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      background: #162033;
      color: #f4f7fb;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12px;
    }
    .cu-ai-widget-composer {
      display: grid;
      gap: 10px;
      padding: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: #0f1726;
    }
    .cu-ai-widget-composer textarea {
      width: 100%;
      min-height: 82px;
      resize: vertical;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px;
      background: #080d19;
      color: #f4f7fb;
      font: inherit;
    }
    .cu-ai-widget-send {
      background: #33d69f;
      color: #061713;
      font-weight: 900;
    }
    .cu-ai-widget-answer {
      white-space: pre-wrap;
      color: #e8eef8;
    }
    .cu-ai-widget-meta {
      color: #9aa7bd;
      font-size: 12px;
      margin-top: 8px;
    }
    @media (max-width: 640px) {
      .cu-ai-widget-button { right: 16px; bottom: 80px; }
      .cu-ai-widget-panel { right: 16px; bottom: 136px; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'cu-ai-widget-button';
  button.type = 'button';
  button.innerHTML = '<i>🤖</i><span>AI DevOps</span>';

  const panel = document.createElement('section');
  panel.className = 'cu-ai-widget-panel';
  panel.innerHTML = `
    <div class="cu-ai-widget-head">
      <div class="cu-ai-widget-title">
        <strong>AI DevOps Checker</strong>
        <span>Reads this workspace and checks release readiness.</span>
      </div>
      <button class="cu-ai-widget-close" type="button" aria-label="Close AI DevOps checker">x</button>
    </div>
    <div class="cu-ai-widget-body">
      <div class="cu-ai-widget-card">
        <strong>Live workspace check</strong>
        <p id="cu-ai-widget-summary">Open the platform demo or workspace, then ask what should block the release.</p>
      </div>
      <div class="cu-ai-widget-prompts">
        <button type="button" data-prompt="Run a live release readiness check.">Run check</button>
        <button type="button" data-prompt="What should block this release?">Blockers</button>
        <button type="button" data-prompt="Build a rollback plan from the current flags.">Rollback</button>
        <button type="button" data-prompt="What should GitHub, Jira, and Slack receive?">Payloads</button>
      </div>
      <div id="cu-ai-widget-output" class="cu-ai-widget-card cu-ai-widget-answer">Ask the checker to review the current Compass Ultra workspace.</div>
    </div>
    <form class="cu-ai-widget-composer">
      <textarea name="message" placeholder="Ask the AI DevOps checker..."></textarea>
      <button class="cu-ai-widget-send" type="submit">Ask AI DevOps</button>
    </form>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  const output = panel.querySelector('#cu-ai-widget-output');
  const summary = panel.querySelector('#cu-ai-widget-summary');
  const form = panel.querySelector('form');
  const textarea = panel.querySelector('textarea');

  function getWorkspace() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function fallbackFlags() {
    return [
      { key: 'checkout.express_pay', enabled: true, criticality: 'high', rollout: 45, owner: 'Growth', expiresAt: '2026-12-01', dependencies: ['payments.stripe_v4'] },
      { key: 'payments.stripe_v4', enabled: true, criticality: 'critical', rollout: 100, owner: 'Payments', expiresAt: '2026-11-30', dependencies: [] },
      { key: 'inventory.realtime_sync', enabled: true, criticality: 'high', rollout: 60, owner: 'Platform', expiresAt: '2026-11-28', dependencies: [] },
      { key: 'promos.flash_sale_engine', enabled: false, criticality: 'high', rollout: 0, owner: 'Growth', expiresAt: 'not set', dependencies: ['inventory.realtime_sync'] },
    ];
  }

  function buildChecks(flags, release) {
    const highRollout = flags.filter(flag => flag.enabled && ['high', 'critical'].includes(String(flag.criticality).toLowerCase()) && Number(flag.rollout || 0) >= 70);
    const missingExpiry = flags.filter(flag => flag.enabled && (!flag.expiresAt || flag.expiresAt === 'not set'));
    const brokenDeps = flags.filter(flag => flag.enabled && Array.isArray(flag.dependencies) && flag.dependencies.some(dep => !flags.find(item => item.key === dep && item.enabled)));
    return [
      { label: 'Change ticket attached', status: release?.changeTicket ? 'pass' : 'block', detail: release?.changeTicket || 'Missing change ticket' },
      { label: 'High-risk rollout exposure', status: highRollout.length ? 'warn' : 'pass', detail: highRollout.length ? `${highRollout.length} high-risk rollout(s) at 70%+` : 'No high-risk rollout over policy threshold' },
      { label: 'Flag expirations', status: missingExpiry.length ? 'block' : 'pass', detail: missingExpiry.length ? `${missingExpiry.length} enabled flag(s) missing expiration` : 'Expiration metadata present' },
      { label: 'Dependencies enabled', status: brokenDeps.length ? 'block' : 'pass', detail: brokenDeps.length ? `${brokenDeps.length} dependency gap(s)` : 'Dependency graph is satisfied' },
    ];
  }

  function currentPayload(message) {
    const workspace = getWorkspace();
    const flags = Array.isArray(workspace.flags) && workspace.flags.length ? workspace.flags : fallbackFlags();
    const release = workspace.release || { train: 'peak-sale-2026.11', environment: 'production', changeTicket: 'CHG-DEMO', window: 'next production deploy' };
    const context = workspace.context || { environment: 'production' };
    summary.textContent = `${flags.length} flag(s), ${flags.filter(flag => flag.enabled).length} enabled, ${release.changeTicket || 'no change ticket'}.`;
    return {
      message,
      release: {
        train: release.train || 'demo-release',
        environment: context.environment || release.environment || 'production',
        changeTicket: release.changeTicket || '',
        window: release.window || 'not set',
      },
      flags,
      checks: buildChecks(flags, release),
    };
  }

  async function ask(message) {
    output.textContent = 'Checking this workspace...';
    try {
      const response = await fetch(`${API_BASE}/api/v1/ai-devops/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload(message)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      output.textContent = data.answer || data.summary || 'Checker completed.';
      if (data.mode) {
        const meta = document.createElement('div');
        meta.className = 'cu-ai-widget-meta';
        meta.textContent = `Mode: ${data.mode}${data.providerError ? ` · Provider fallback: ${data.providerError}` : ''}`;
        output.appendChild(meta);
      }
    } catch (error) {
      output.textContent = `The checker could not reach the backend yet. ${error.message}\n\nFallback: verify policy blockers, high-risk rollouts, missing expirations, dependency gaps, and rollback evidence before launch.`;
    }
  }

  button.addEventListener('click', () => {
    panel.classList.toggle('is-open');
    currentPayload('summary');
  });
  panel.querySelector('.cu-ai-widget-close').addEventListener('click', () => panel.classList.remove('is-open'));
  panel.querySelectorAll('[data-prompt]').forEach(promptButton => {
    promptButton.addEventListener('click', () => {
      textarea.value = promptButton.dataset.prompt;
      ask(promptButton.dataset.prompt);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = textarea.value.trim() || 'Run a live release readiness check.';
    ask(message);
  });

  currentPayload('summary');
})();
