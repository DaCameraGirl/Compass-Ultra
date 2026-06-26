# 🧭 Compass Ultra 

> **Release-Intelligence für Teams, die hinter Feature Flags ausliefern.**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-6366f1?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra ist ein Release-Kontrollraum für Software mit Feature Flags. Prüfen Sie Flag-Status, Policy-Gates, Rollout-Risiko, Snapshot-Diffs, KI-gestützte Risikoanalyse und auditfähige Release-Nachweise — bevor Produktionsänderungen live gehen.

[🚀 Live App](https://www.compassultra.com) · [🎮 Try the Demo](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ Warum Compass Ultra?

Feature Flags sollen Releases sicherer machen.

Mit der Zeit können sie jedoch zu einer eigenen Release-Oberfläche werden:

* 🧟 Veraltete oder abgelaufene Flags
* 🎲 Riskante Rollout-Prozentsätze
* 👤 Fehlende Owner und Approver
* 🕸️ Versteckte Flag-Abhängigkeiten
* 🚨 Produktions-Overrides
* 💬 Slack-Threads als Audit-Trail-Ersatz
* 🧩 Release-Entscheidungen über zu viele Tools verstreut

**Compass Ultra verwandelt Feature-Flag-Chaos in einen wiederholbaren Release-Review-Workflow.**

Statt zu fragen:

> „Können wir ausliefern?“

Kann Ihr Team antworten:

* ✅ Was ist aktiviert?
* 👥 Wer ist betroffen?
* 🔄 Was hat sich geändert?
* 💥 Was kann kaputtgehen?
* 🖊️ Wer hat es genehmigt?
* 🧯 Was muss zuerst behoben werden?
* 📄 Welchen Nachweis können wir QA, DevOps, Führung oder Compliance übergeben?

---

## ⚡ Die Kurzfassung

Compass Ultra hilft Teams, die Release-Bereitschaft vor dem Ausliefern zu prüfen und nachzuweisen.

Ein typischer Release-Review sieht so aus:

1. 📦 Release-Workspace laden oder importieren.
2. 👤 Flags gegen einen echten Benutzerkontext evaluieren.
3. 🛡️ Policy-Gates und Risikoanalyse ausführen.
4. 🔍 Release-Snapshots vergleichen.
5. 📄 Release-Runbook exportieren.
6. 🚀 Den Nachweis teilen, bevor Produktionsänderungen live gehen.

---

## 🎮 Live-Demo

Die Demo funktioniert ohne Konto:

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

Die Demo simuliert ein riskantes Retail-Release (Abend vor Black Friday, `peak-sale-2026.11`) mit:

* 🏁 10 Feature Flags über LaunchDarkly, Statsig und Firebase
* 🛒 Hochriskante Checkout-, Flash-Sale- und Same-Day-Shipping-Flags
* 🚧 Policy-Blocker und Warnungen (Abhängigkeitslücken, Canary-Verstöße)
* 🔗 Abhängigkeitsgraph-Prüfungen
* 🧾 Snapshot-Vergleich
* 📄 PDF-Runbook-Export
* 🔌 GitHub-, Jira- und Slack-Payload-Generierung
* 🧯 Kill-Switch-Rollback-Flow für den Demo-Zustand
* 💰 Finanzielle Impact-Schätzung für das Peak-Traffic-Deploy-Fenster

---

## 🧠 Kernfunktionen

### 🚦 Release-Risiko-Analysator

Compass Ultra prüft den aktuellen Release-Workspace und liefert eine praktische Release-Bewertung:

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

Angetrieben von einem Live-KI-Service mit deterministischem Fallback — die Analyse wird nie blockiert, auch wenn der KI-Service nicht verfügbar ist.

Er kann Probleme erkennen wie:

* 🔥 Hochriskante aktive Flags
* 🔗 Abhängigkeitskonflikte
* 👻 Fehlende Approver
* ⏰ Abgelaufene oder ownerlose Flags
* 🐤 Canary-Rollout-Verstöße
* 🚨 Produktions-Overrides
* 🧾 Compliance-sensible Rollout-Muster
* 💰 Finanzielle Impact-Schätzungen für Peak-Traffic-Deploy-Fenster

---

### 🎯 Flag-Evaluierungs-Engine

Evaluieren Sie jedes Flag gegen einen spezifischen Benutzerkontext.

| Feld | Beschreibung |
| --- | --- |
| 👤 User key | Eindeutige Benutzerkennung |
| 📧 Email | E-Mail-Adresse des Benutzers |
| 🏢 Tenant | Kunden- oder Account-Tenant |
| 💳 Plan | Preis- oder Berechtigungsplan |
| 🛂 Role | Benutzerrolle oder Berechtigungsgruppe |
| 🌎 Region | Geografische oder Infrastruktur-Region |
| 🏳️ Country | Länderbezogenes Targeting |
| 📱 Device | Geräte- oder Plattformtyp |
| 🌐 Environment | Entwicklung, Staging, Produktion oder benutzerdefinierte Umgebung |

Jedes Flag zeigt:

* 🎚️ Evaluierter Wert
* 🧠 Auflösungsgrund (Regel-Treffer, Rollout-Bucket, Standard oder Override)
* 🧩 Passende Regel oder Bedingung
* 📌 Relevanter Kontext während der Evaluierung

Wechseln Sie zwischen gespeicherten Kontext-Presets — Production admin, EU customer, Mobile guest — um zu sehen, wie sich Flags pro Segment verhalten.

---

### 🛡️ Enterprise Policy Gates (9 Prüfungen)

Compass Ultra führt bei jeder Workspace-Statusänderung automatisierte Release-Prüfungen aus.

| 🔒 Gate | Was es prüft |
| --- | --- |
| 🎟️ Change ticket attached | CHG- oder Jira-Ticket ist vor Produktion vorhanden |
| 👥 Critical flags have approvers | Alle hoch/kritischen aktiven Flags haben benannte Approver |
| 🧬 Every flag has traceability | Alle Flags haben Jira-/Change-IDs |
| ⏳ No expired flags enabled | Keine aktivierten Flags sind über dem Ablaufdatum |
| 🚫 Production override discipline | Keine manuellen Overrides in Produktion aktiv |
| 🐤 Canary rollout limit | Canary-pflichtige Flags bleiben innerhalb von 50 % Rollout |
| 🔗 Dependencies enabled | Kein aktiviertes Flag hat eine deaktivierte Abhängigkeit |
| 🔌 Live provider adapters configured | Mindestens ein Provider-Token ist verbunden |
| 📤 Outbound DevOps hooks configured | GitHub/Jira/Slack-Endpunkte sind konfiguriert |

---

### 🤖 AI DevOps Chat Widget

Ein schwebender KI-Chat-Assistent, der mit einem einzigen Script-Tag auf jeder Seite eingebettet werden kann:

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 Release-Fragen in natürlicher Sprache stellen
* 🔍 Liest automatisch den Live-Workspace-Status
* 📊 Sitzungszähler zeigt, wie viele Besucher es genutzt haben
* ⚡ Graceful Fallback, wenn der KI-Service nicht verfügbar ist
* 🧠 Behält den Chat-Verlauf über Nachrichten in derselben Sitzung bei

Live ausprobieren: [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 Provider-Integrationen (Read-Only Sync)

Importieren Sie den Live-Flag-Status von Ihrem Flag-Provider über ein kundeneigenes Read-Only-Token über den Server-Proxy.

| 🏴 Provider | Type |
| --- | --- |
| 🚀 LaunchDarkly | Provider sync |
| 📊 Statsig | Provider sync |
| 🔓 Unleash | Provider sync |
| 🏳️ Flagsmith | Provider sync |
| 🔥 Firebase Remote Config | Provider sync |

🔒 API-Schlüssel verlassen niemals den Backend-Proxy. Der Browser ruft nur die Compass Ultra API auf.

---

### 📤 Ausgehende DevOps-Integrationen

Payload-Kopie mit einem Klick oder POST an Ihre bestehenden Tools:

| 🔌 Integration | Type |
| --- | --- |
| 🐙 GitHub Issues | Release evidence issue |
| 🎫 Jira Change | CHG ticket update |
| 💬 Slack War Room | Release blocks / rich message |

---

### 🔍 Snapshot Diff

Vergleichen Sie zwei Release-Checkpoints und sehen Sie genau, was sich geändert hat.

Diffs können identifizieren:

* ➕ Hinzugefügte Flags
* ➖ Entfernte Flags
* 📈 Rollout-Änderungen
* 🚨 Kritikalitätsänderungen
* 👤 Owner- oder Approver-Änderungen
* 🛠️ Override-Änderungen

---

### 📄 PDF Release Runbooks & Certificates

Exportieren Sie CAB-fertige PDFs für QA, Führung, DevOps oder Audit-Review.

Runbooks enthalten:

* 🏷️ Release-Metadaten und Deploy-Fenster
* 🎯 Flag-Evaluierungen und Rollout-Status
* 🛡️ Policy-Gate-Ergebnisse
* 🧠 Risikozusammenfassung und finanzieller Impact
* 🧯 Rollback-Notizen pro Flag
* ✍️ Approver-Unterschriftenliste
* 🧾 Audit-Verlauf

---

### 🐙 GitHub Action CI Gate

Blockieren Sie Deployments in CI, wenn das Release-Risiko einen konfigurierten Schwellenwert überschreitet:

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 Die Action schlägt den Workflow automatisch fehl, wenn Blocker gefunden werden — kein „wir haben vergessen, die Flags vor dem Merge zu prüfen“ mehr.

---

### 👥 RBAC (4 Rollen)

| 🎭 Role | Permissions |
| --- | --- |
| 🔑 Admin | Full access — flags, release, team, integrations |
| ✅ Approver | Approve releases, view all |
| 🛠️ Operator | Edit flags and release metadata |
| 👁️ Viewer | Read only |

Alle blockierten Aktionen werden mit Akteur, Rolle, ausgelöstem Gate und exaktem Zeitstempel protokolliert.

---

## 🧭 Produktpositionierung

Compass Ultra ist **kein** Feature-Flag-Provider.

Es ist die **Release-Review-Schicht** um Feature Flags herum.

Nutzen Sie es, wenn Sie eine klare Antwort auf diese Frage brauchen:

> „Können wir dieses Feature-Flag-Release sicher ausliefern — und können wir es nachweisen?“

---

## 💸 Preise

| Plan | Preis | Plätze | Ideal für |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | Local only | Workspace und lokale Release-Review ausprobieren |
| 🧍 Solo | $49/mo | 1 seat | Solo-Operatoren, die Cloud-Sync, Risikoanalyse, Snapshots und Exporte brauchen |
| 🚀 Pro | $149/mo | Up to 5 seats | Kleine Teams, die gemeinsame Release-Review und Diffs brauchen |
| 👥 Team | $299/mo | Up to 15 seats | Release-Teams, die RBAC, Audit-Export, Alerts und Org-Workflows brauchen |
| 🏢 Enterprise | Custom | Custom | Security Review, Onboarding, individuelle Bedingungen und Integrationen |

Bezahlte Pläne starten mit einer **7-tägigen kostenlosen Testphase**.

Keine Kreditkarte erforderlich. Testphasen wechseln automatisch zu Free, sofern der Kunde nicht abonniert.

---

## 🛠️ Tech Stack

| Schicht | Technologie |
| --- | --- |
| ⚛️ Frontend | React, Vite |
| 🧭 Routing | React Router |
| ✂️ Code splitting | React.lazy + Suspense |
| 🎨 UI icons | Lucide React |
| 📄 PDF export | jsPDF |
| 🔐 Auth | Auth0 |
| 💳 Payments | Stripe |
| 📈 Analytics | Vercel Analytics |
| 🔒 Security headers | X-Frame-Options, CSP, HSTS, cache control |
| 🧱 Backend | Express API in the backend repo |
| 🐘 Database | PostgreSQL through backend |
| 🤖 AI risk analysis | Backend AI service with deterministic fallback |
| ☁️ Hosting | Vercel (frontend) · Railway (backend) |

---

## 📦 Quellcode

Dieses öffentliche Repository enthält die Compass Ultra Launch-Seite, Dokumentation, GitHub Pages Assets und öffentlich zugängliche Projektmaterialien.

Die Produktionsanwendung und das Backend werden separat gepflegt. Öffentliche Nutzer können die Live-App und Demo erkunden, ohne Zugang zu privaten Implementierungs-Repositories zu benötigen.

---

## 🔒 Sicherheitsmodell

Compass Ultra ist als Release-Review-Schicht konzipiert.

* 🧪 Lokale Demo funktioniert ohne Login.
* 🔐 Cloud-Snapshots erfordern Authentifizierung.
* 🔌 Provider-Sync nutzt Read-Only-Tokens über den Backend-Proxy — API-Schlüssel passieren niemals den Browser.
* 🛡️ Sicherheits-Header bei allen Antworten: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
* 💳 Stripe verarbeitet Kartendaten.
* 🪪 Auth0 ist der Identity Provider.
* 🔗 Share-Links kodieren den Workspace-Status und sollten nicht für Secrets verwendet werden.
* 🏢 Enterprise-Kunden sollten Security Review und individuelle Bedingungen vor dem Live-Provider-Rollout nutzen.

---

## 🗺️ Roadmap

* 🧾 Vollständig backend-erzwungene Sitzplatzlimits
* 🧪 No-Card-Trial-Lifecycle-Automatisierung
* 🚦 Trial-Missbrauchskontrollen nach E-Mail, Domain und Nutzung
* 👥 Team-Einladungsflow
* 🏢 Organisations-Workspaces
* 🔌 Weitere Provider-Adapter
* 💬 Slack-App-Workflow
* 🐙 GitHub Action Release Gate Erweiterung
* 📤 Weitere Exportformate
* 🔒 Security Review Paket für Enterprise
* 📊 Live Backend Session- und Nachrichtenzähler für das AI DevOps Widget

---

## ✅ Status

Compass Ultra ist live:

**Production:** [https://www.compassultra.com](https://www.compassultra.com)

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker:** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 Gebaut für

Teams, die schnell ausliefern und trotzdem Nachweise vor Produktion brauchen.

**Mit Vertrauen ausliefern. Mit Nachweisen prüfen. Jeden Release belegen.** 🧭