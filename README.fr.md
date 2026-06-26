# 🧭 Compass Ultra 

> **Intelligence de release pour les équipes qui livrent derrière des feature flags.**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-6366f1?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra est une salle de contrôle de release pour les logiciels pilotés par feature flags. Examinez l'état des flags, les portes de politique, le risque de déploiement, les diffs de snapshots, l'analyse de risque assistée par IA et les preuves de release prêtes pour l'audit — avant que les changements en production ne soient effectifs.

[🚀 Live App](https://www.compassultra.com) · [🎮 Try the Demo](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ Pourquoi Compass Ultra ?

Les feature flags sont censés rendre les releases plus sûres.

Mais avec le temps, ils peuvent devenir une surface de release à part entière :

* 🧟 Flags obsolètes ou expirés
* 🎲 Pourcentages de déploiement risqués
* 👤 Propriétaires et approbateurs manquants
* 🕸️ Dépendances cachées entre flags
* 🚨 Overrides en production
* 💬 Fils Slack faisant office de piste d'audit
* 🧩 Décisions de release dispersées dans trop d'outils

**Compass Ultra transforme le chaos des feature flags en un flux de revue de release reproductible.**

Au lieu de demander :

> « Est-ce qu'on peut livrer ? »

Votre équipe peut répondre :

* ✅ Qu'est-ce qui est activé ?
* 👥 Qui est affecté ?
* 🔄 Qu'est-ce qui a changé ?
* 💥 Qu'est-ce qui peut casser ?
* 🖊️ Qui l'a approuvé ?
* 🧯 Qu'est-ce qu'il faut corriger en premier ?
* 📄 Quelle preuve pouvons-nous remettre à QA, DevOps, la direction ou la conformité ?

---

## ⚡ La version courte

Compass Ultra aide les équipes à examiner et prouver la préparation au release avant la livraison.

Une revue de release typique ressemble à ceci :

1. 📦 Charger ou importer un workspace de release.
2. 👤 Évaluer les flags selon un contexte utilisateur réel.
3. 🛡️ Exécuter les portes de politique et l'analyse de risque.
4. 🔍 Comparer les snapshots de release.
5. 📄 Exporter un runbook de release.
6. 🚀 Partager la preuve avant que les changements en production ne soient effectifs.

---

## 🎮 Démo en direct

La démo fonctionne sans compte :

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

La démo simule une release retail à haut risque (veille du Black Friday, `peak-sale-2026.11`) avec :

* 🏁 10 feature flags sur LaunchDarkly, Statsig et Firebase
* 🛒 Flags à haut risque pour le checkout, les ventes flash et la livraison le jour même
* 🚧 Bloqueurs et avertissements de politique (lacunes de dépendances, violations canary)
* 🔗 Vérifications du graphe de dépendances
* 🧾 Comparaison de snapshots
* 📄 Export de runbook PDF
* 🔌 Génération de payloads GitHub, Jira et Slack
* 🧯 Flux de rollback kill-switch pour l'état de la démo
* 💰 Estimation d'impact financier pour la fenêtre de déploiement à trafic de pointe

---

## 🧠 Fonctionnalités principales

### 🚦 Analyseur de risque de release

Compass Ultra examine le workspace de release actuel et renvoie une évaluation pratique du release :

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

Alimenté par un service IA en direct avec un repli déterministe — l'analyse n'est jamais bloquée même lorsque le service IA est indisponible.

Il peut détecter des problèmes tels que :

* 🔥 Flags actifs à haut risque
* 🔗 Conflits de dépendances
* 👻 Approbateurs manquants
* ⏰ Flags expirés ou sans propriétaire
* 🐤 Violations de déploiement canary
* 🚨 Overrides en production
* 🧾 Modèles de déploiement sensibles à la conformité
* 💰 Estimations d'impact financier pour les fenêtres de déploiement à trafic de pointe

---

### 🎯 Moteur d'évaluation des flags

Évaluez chaque flag selon un contexte utilisateur spécifique.

| Champ | Description |
| --- | --- |
| 👤 User key | Identifiant utilisateur unique |
| 📧 Email | Adresse e-mail de l'utilisateur |
| 🏢 Tenant | Tenant client ou compte |
| 💳 Plan | Plan tarifaire ou de droits |
| 🛂 Role | Rôle utilisateur ou groupe de permissions |
| 🌎 Region | Région géographique ou d'infrastructure |
| 🏳️ Country | Ciblage au niveau pays |
| 📱 Device | Type d'appareil ou de plateforme |
| 🌐 Environment | Développement, staging, production ou environnement personnalisé |

Chaque flag affiche :

* 🎚️ Valeur évaluée
* 🧠 Raison de résolution (correspondance de règle, bucket de rollout, valeur par défaut ou override)
* 🧩 Règle ou condition correspondante
* 📌 Contexte pertinent utilisé pendant l'évaluation

Basculez entre les préréglages de contexte enregistrés — Production admin, EU customer, Mobile guest — pour voir comment les flags se comportent par segment.

---

### 🛡️ Portes de politique entreprise (9 vérifications)

Compass Ultra exécute des vérifications de release automatisées à chaque changement d'état du workspace.

| 🔒 Gate | Ce qu'elle vérifie |
| --- | --- |
| 🎟️ Change ticket attached | Un ticket CHG ou Jira est présent avant la production |
| 👥 Critical flags have approvers | Tous les flags actifs haute/critique ont des approbateurs nommés |
| 🧬 Every flag has traceability | Tous les flags ont des IDs Jira/changement |
| ⏳ No expired flags enabled | Aucun flag activé n'est au-delà de son expiration |
| 🚫 Production override discipline | Aucun override manuel actif en production |
| 🐤 Canary rollout limit | Les flags nécessitant un canary restent dans une limite de rollout de 50 % |
| 🔗 Dependencies enabled | Aucun flag activé n'a de dépendance désactivée |
| 🔌 Live provider adapters configured | Au moins un jeton de fournisseur est connecté |
| 📤 Outbound DevOps hooks configured | Les endpoints GitHub/Jira/Slack sont configurés |

---

### 🤖 Widget de chat AI DevOps

Un assistant de chat IA flottant qui peut être intégré sur n'importe quelle page avec une seule balise script :

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 Posez des questions sur les releases en langage naturel
* 🔍 Lit automatiquement l'état du workspace en direct
* 📊 Le compteur de session indique combien de visiteurs l'ont utilisé
* ⚡ Repli gracieux lorsque le service IA est indisponible
* 🧠 Conserve l'historique du chat entre les messages de la même session

Essayez-le en direct : [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 Intégrations fournisseurs (synchronisation en lecture seule)

Importez l'état des flags en direct depuis votre fournisseur de flags via un jeton en lecture seule appartenant au client, via le proxy serveur.

| 🏴 Provider | Type |
| --- | --- |
| 🚀 LaunchDarkly | Provider sync |
| 📊 Statsig | Provider sync |
| 🔓 Unleash | Provider sync |
| 🏳️ Flagsmith | Provider sync |
| 🔥 Firebase Remote Config | Provider sync |

🔒 Les clés API ne quittent jamais le proxy backend. Le navigateur n'appelle que l'API Compass Ultra.

---

### 📤 Intégrations DevOps sortantes

Copie de payload en un clic ou POST vers vos outils existants :

| 🔌 Integration | Type |
| --- | --- |
| 🐙 GitHub Issues | Release evidence issue |
| 🎫 Jira Change | CHG ticket update |
| 💬 Slack War Room | Release blocks / rich message |

---

### 🔍 Diff de snapshots

Comparez deux points de contrôle de release et voyez exactement ce qui a changé.

Les diffs peuvent identifier :

* ➕ Flags ajoutés
* ➖ Flags supprimés
* 📈 Changements de rollout
* 🚨 Changements de criticité
* 👤 Changements de propriétaire ou d'approbateur
* 🛠️ Changements d'override

---

### 📄 Runbooks et certificats de release PDF

Exportez des PDF prêts pour le CAB pour QA, la direction, DevOps ou la revue d'audit.

Les runbooks incluent :

* 🏷️ Métadonnées de release et fenêtre de déploiement
* 🎯 Évaluations de flags et états de rollout
* 🛡️ Résultats des portes de politique
* 🧠 Résumé des risques et impact financier
* 🧯 Notes de rollback par flag
* ✍️ Liste des signatures des approbateurs
* 🧾 Historique d'audit

---

### 🐙 Porte CI GitHub Action

Bloquez les déploiements en CI lorsque le risque de release dépasse un seuil configuré :

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 L'action fait échouer le workflow automatiquement si des bloqueurs sont trouvés — fini le « on a oublié de vérifier les flags avant le merge ».

---

### 👥 RBAC (4 rôles)

| 🎭 Role | Permissions |
| --- | --- |
| 🔑 Admin | Full access — flags, release, team, integrations |
| ✅ Approver | Approve releases, view all |
| 🛠️ Operator | Edit flags and release metadata |
| 👁️ Viewer | Read only |

Toutes les actions bloquées sont journalisées avec l'acteur, le rôle, la porte déclenchée et l'horodatage exact.

---

## 🧭 Positionnement produit

Compass Ultra **n'est pas** un fournisseur de feature flags.

C'est la **couche de revue de release** autour des feature flags.

Utilisez-le lorsque vous avez besoin d'une réponse claire à :

> « Pouvons-nous livrer en toute sécurité cette release avec feature flags, et pouvons-nous le prouver ? »

---

## 💸 Tarification

| Plan | Prix | Sièges | Idéal pour |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | Local only | Essayer le workspace et la revue de release locale |
| 🧍 Solo | $49/mo | 1 seat | Opérateurs solo ayant besoin de sync cloud, analyse de risque, snapshots et exports |
| 🚀 Pro | $149/mo | Up to 5 seats | Petites équipes ayant besoin de revue de release partagée et de diffs |
| 👥 Team | $299/mo | Up to 15 seats | Équipes de release ayant besoin de RBAC, export d'audit, alertes et workflows organisationnels |
| 🏢 Enterprise | Custom | Custom | Revue de sécurité, onboarding, conditions personnalisées et intégrations |

Les plans payants commencent par un **essai gratuit de 7 jours**.

Aucune carte de crédit requise. Les essais repassent automatiquement en Free sauf si le client s'abonne.

---

## 🛠️ Stack technique

| Couche | Technologie |
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

## 📦 Code source

Ce dépôt public contient la page de lancement Compass Ultra, la documentation, les assets GitHub Pages et les supports publics du projet.

L'application de production et le backend sont maintenus séparément. Les utilisateurs publics peuvent explorer l'app en direct et la démo sans accès aux dépôts d'implémentation privés.

---

## 🔒 Modèle de sécurité

Compass Ultra est conçu comme une couche de revue de release.

* 🧪 La démo locale fonctionne sans connexion.
* 🔐 Les snapshots cloud nécessitent une authentification.
* 🔌 La synchronisation fournisseur utilise des jetons en lecture seule via le proxy backend — les clés API ne transitent jamais par le navigateur.
* 🛡️ En-têtes de sécurité sur toutes les réponses : `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
* 💳 Stripe gère les données de carte.
* 🪪 Auth0 est le fournisseur d'identité.
* 🔗 Les liens de partage encodent l'état du workspace et ne doivent pas être utilisés pour des secrets.
* 🏢 Les clients Enterprise doivent utiliser une revue de sécurité et des conditions personnalisées avant le déploiement fournisseur en direct.

---

## 🗺️ Feuille de route

* 🧾 Limites de sièges entièrement appliquées côté backend
* 🧪 Automatisation du cycle de vie d'essai sans carte
* 🚦 Contrôles anti-abus d'essai par e-mail, domaine et utilisation
* 👥 Flux d'invitation d'équipe
* 🏢 Workspaces organisationnels
* 🔌 Plus d'adaptateurs fournisseurs
* 💬 Workflow d'application Slack
* 🐙 Extension de la porte de release GitHub Action
* 📤 Plus de formats d'export
* 🔒 Package de revue de sécurité pour Enterprise
* 📊 Compteurs de sessions et messages backend en direct pour le widget AI DevOps

---

## ✅ Statut

Compass Ultra est en ligne :

**Production:** [https://www.compassultra.com](https://www.compassultra.com)

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker:** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 Conçu pour

Les équipes qui livrent vite et ont encore besoin de preuves avant la production.

**Livrez en confiance. Revoyez avec des preuves. Prouvez chaque release.** 🧭