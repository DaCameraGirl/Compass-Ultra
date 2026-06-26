# 🧭 Compass Ultra 

> **フィーチャーフラグの裏でリリースするチーム向けのリリースインテリジェンス。**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-6366f1?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra は、フィーチャーフラグ付きソフトウェア向けのリリース管制室です。本番変更が公開される前に、フラグの状態、ポリシーゲート、ロールアウトリスク、スナップショット差分、AI 支援のリスク分析、監査対応のリリース証跡を確認できます。

[🚀 ライブアプリ](https://www.compassultra.com) · [🎮 デモを試す](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ なぜ Compass Ultra か？

フィーチャーフラグは、リリースをより安全にするはずです。

しかし時間が経つと、それ自体がリリース面のリスクになることがあります：

* 🧟 古い、または期限切れのフラグ
* 🎲 リスクの高いロールアウト率
* 👤 オーナーや承認者の欠如
* 🕸️ 見えないフラグ依存関係
* 🚨 本番環境のオーバーライド
* 💬 Slack スレッドを監査証跡の代わりに使う
* 🧩 リリース判断が多すぎるツールに分散

**Compass Ultra は、フィーチャーフラグの混乱を、再現可能なリリースレビューワークフローに変えます。**

こう聞くのではなく：

> 「リリースして大丈夫？」

チームは次のように答えられます：

* ✅ 何が有効になっているか？
* 👥 誰に影響するか？
* 🔄 何が変わったか？
* 💥 何が壊れる可能性があるか？
* 🖊️ 誰が承認したか？
* 🧯 先に何を修正すべきか？
* 📄 QA、DevOps、経営層、コンプライアンスに何を証明できるか？

---

## ⚡ 短い説明

Compass Ultra は、リリース前にリリース準備状況をレビューし、証明するのを支援します。

典型的なリリースレビューは次の流れです：

1. 📦 リリースワークスペースを読み込む、またはインポートする。
2. 👤 実際のユーザーコンテキストに対してフラグを評価する。
3. 🛡️ ポリシーゲートとリスク分析を実行する。
4. 🔍 リリーススナップショットを比較する。
5. 📄 リリースランブックをエクスポートする。
6. 🚀 本番変更が公開される前に証跡を共有する。

---

## 🎮 ライブデモ

デモはアカウント不要で利用できます：

**デモ：** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

デモは、小売向けの高リスクリリース（ブラックフライデー前夜、`peak-sale-2026.11`）をシミュレートします：

* 🏁 LaunchDarkly、Statsig、Firebase にまたがる 10 個のフィーチャーフラグ
* 🛒 高リスクのチェックアウト、フラッシュセール、当日配送フラグ
* 🚧 ポリシーブロッカーと警告（依存関係の欠落、カナリア違反）
* 🔗 依存関係グラフのチェック
* 🧾 スナップショット比較
* 📄 PDF ランブックのエクスポート
* 🔌 GitHub、Jira、Slack ペイロード生成
* 🧯 デモ状態向けの kill-switch ロールバックフロー
* 💰 ピークトラフィック時のデプロイウィンドウにおける財務影響の見積もり

---

## 🧠 コア機能

### 🚦 リリースリスクアナライザー

Compass Ultra は現在のリリースワークスペースをレビューし、実用的なリリース評価を返します：

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

ライブ AI サービスと決定論的フォールバックで動作 — AI サービスが利用できない場合でも、分析はブロックされません。

次のような問題を検出できます：

* 🔥 高リスクの有効フラグ
* 🔗 依存関係の競合
* 👻 承認者の欠如
* ⏰ 期限切れ、またはオーナーのないフラグ
* 🐤 カナリアロールアウト違反
* 🚨 本番環境のオーバーライド
* 🧾 コンプライアンスに敏感なロールアウトパターン
* 💰 ピークトラフィック時のデプロイウィンドウにおける財務影響の見積もり

---

### 🎯 フラグ評価エンジン

特定のユーザーコンテキストに対してすべてのフラグを評価します。

| フィールド | 説明 |
| --- | --- |
| 👤 User key | 一意のユーザー識別子 |
| 📧 Email | ユーザーのメールアドレス |
| 🏢 Tenant | 顧客またはアカウントのテナント |
| 💳 Plan | 料金またはエンタイトルメントプラン |
| 🛂 Role | ユーザーロールまたは権限グループ |
| 🌎 Region | 地理的、またはインフラ領域 |
| 🏳️ Country | 国レベルのターゲティング |
| 📱 Device | デバイスまたはプラットフォーム種別 |
| 🌐 Environment | 開発、ステージング、本番、またはカスタム環境 |

各フラグには次が表示されます：

* 🎚️ 評価値
* 🧠 解決理由（ルール一致、ロールアウトバケット、デフォルト、またはオーバーライド）
* 🧩 一致したルールまたは条件
* 📌 評価時に使用された関連コンテキスト

保存済みのコンテキストプリセット — Production admin、EU customer、Mobile guest — を切り替えて、セグメントごとのフラグの挙動を確認できます。

---

### 🛡️ エンタープライズポリシーゲート（9 チェック）

Compass Ultra は、ワークスペース状態が変わるたびに自動リリースチェックを実行します。

| 🔒 ゲート | チェック内容 |
| --- | --- |
| 🎟️ Change ticket attached | 本番前に CHG または Jira チケットが存在する |
| 👥 Critical flags have approvers | 高/クリティカルな有効フラグすべてに承認者が指定されている |
| 🧬 Every flag has traceability | すべてのフラグに Jira/変更 ID がある |
| ⏳ No expired flags enabled | 有効化された期限切れフラグがない |
| 🚫 Production override discipline | 本番環境に手動オーバーライドがない |
| 🐤 Canary rollout limit | カナリア必須フラグは 50% ロールアウト以内 |
| 🔗 Dependencies enabled | 有効フラグに無効な依存関係がない |
| 🔌 Live provider adapters configured | 少なくとも 1 つのプロバイダートークンが接続されている |
| 📤 Outbound DevOps hooks configured | GitHub/Jira/Slack エンドポイントが設定されている |

---

### 🤖 AI DevOps チャットウィジェット

1 つのスクリプトタグで任意のページに埋め込める、フローティング AI チャットアシスタント：

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 自然言語でリリースに関する質問ができる
* 🔍 ライブワークスペース状態を自動で読み取る
* 📊 セッションカウンターで利用した訪問者数を表示
* ⚡ AI サービスが利用できない場合の優雅なフォールバック
* 🧠 同一セッション内でメッセージ間のチャット履歴を保持

ライブで試す：[https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 プロバイダー統合（読み取り専用同期）

サーバープロキシ経由で、顧客所有の読み取り専用トークンを使い、フラグプロバイダーからライブフラグ状態をインポートします。

| 🏴 Provider | 種別 |
| --- | --- |
| 🚀 LaunchDarkly | Provider sync |
| 📊 Statsig | Provider sync |
| 🔓 Unleash | Provider sync |
| 🏳️ Flagsmith | Provider sync |
| 🔥 Firebase Remote Config | Provider sync |

🔒 API キーはバックエンドプロキシから出ません。ブラウザは Compass Ultra API のみを呼び出します。

---

### 📤 アウトバウンド DevOps 統合

ワンクリックでペイロードをコピー、または既存ツールへ POST：

| 🔌 Integration | 種別 |
| --- | --- |
| 🐙 GitHub Issues | リリース証跡 issue |
| 🎫 Jira Change | CHG チケット更新 |
| 💬 Slack War Room | リリースブロック / リッチメッセージ |

---

### 🔍 スナップショット差分

2 つのリリースチェックポイントを比較し、何が変わったかを正確に確認できます。

差分で識別できる内容：

* ➕ 追加されたフラグ
* ➖ 削除されたフラグ
* 📈 ロールアウト変更
* 🚨 クリティカル度の変更
* 👤 オーナーまたは承認者の変更
* 🛠️ オーバーライド変更

---

### 📄 PDF リリースランブックと証明書

QA、経営層、DevOps、監査レビュー向けに CAB 対応の PDF をエクスポートできます。

ランブックには次が含まれます：

* 🏷️ リリースメタデータとデプロイウィンドウ
* 🎯 フラグ評価とロールアウト状態
* 🛡️ ポリシーゲート結果
* 🧠 リスクサマリーと財務影響
* 🧯 フラグごとのロールバックメモ
* ✍️ 承認者サインオフ一覧
* 🧾 監査履歴

---

### 🐙 GitHub Action CI ゲート

リリースリスクが設定閾値を超えた場合、CI でデプロイをブロックします：

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 ブロッカーが見つかった場合、アクションはワークフローを自動的に失敗させます — 「マージ前にフラグを確認し忘れた」はもうありません。

---

### 👥 RBAC（4 ロール）

| 🎭 Role | 権限 |
| --- | --- |
| 🔑 Admin | フルアクセス — フラグ、リリース、チーム、統合 |
| ✅ Approver | リリース承認、すべて閲覧 |
| 🛠️ Operator | フラグとリリースメタデータの編集 |
| 👁️ Viewer | 読み取り専用 |

ブロックされたすべてのアクションは、実行者、ロール、トリガーされたゲート、正確なタイムスタンプとともに記録されます。

---

## 🧭 プロダクトポジショニング

Compass Ultra はフィーチャーフラグプロバイダー**ではありません**。

フィーチャーフラグを取り巻く**リリースレビューレイヤー**です。

次の問いに明確に答える必要があるときに使ってください：

> 「このフィーチャーフラグ付きリリースを安全に出せるか、そしてそれを証明できるか？」

---

## 💸 料金

| プラン | 価格 | シート | 最適な用途 |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | ローカルのみ | ワークスペースとローカルリリースレビューの試用 |
| 🧍 Solo | $49/mo | 1 シート | クラウド同期、リスク分析、スナップショット、エクスポートが必要な個人運用者 |
| 🚀 Pro | $149/mo | 最大 5 シート | 共有リリースレビューと差分比較が必要な小規模チーム |
| 👥 Team | $299/mo | 最大 15 シート | RBAC、監査エクスポート、アラート、組織ワークフローが必要なリリースチーム |
| 🏢 Enterprise | Custom | Custom | セキュリティレビュー、オンボーディング、カスタム条項、統合 |

有料プランは **7 日間の無料トライアル** から始まります。

クレジットカードは不要です。顧客が契約しない限り、トライアルは自動的に Free にダウングレードされます。

---

## 🛠️ 技術スタック

| レイヤー | 技術 |
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
| 🧱 Backend | バックエンドリポジトリの Express API |
| 🐘 Database | バックエンド経由の PostgreSQL |
| 🤖 AI risk analysis | 決定論的フォールバック付きバックエンド AI サービス |
| ☁️ Hosting | Vercel（フロントエンド）· Railway（バックエンド） |

---

## 📦 ソースコード

この公開リポジトリには、Compass Ultra のローンチページ、ドキュメント、GitHub Pages アセット、公開向けプロジェクト資料が含まれます。

本番アプリケーションとバックエンドは別途管理されています。一般ユーザーは、非公開の実装リポジトリへのアクセスなしに、ライブアプリとデモを探索できます。

---

## 🔒 セキュリティモデル

Compass Ultra はリリースレビューレイヤーとして設計されています。

* 🧪 ローカルデモはログイン不要で動作します。
* 🔐 クラウドスナップショットには認証が必要です。
* 🔌 プロバイダー同期はバックエンドプロキシ経由の読み取り専用トークンを使用 — API キーはブラウザを通過しません。
* 🛡️ すべてのレスポンスにセキュリティヘッダー：`X-Frame-Options`、`Content-Security-Policy`、`Strict-Transport-Security`、`X-Content-Type-Options`。
* 💳 カードデータは Stripe が処理します。
* 🪪 Auth0 が ID プロバイダーです。
* 🔗 共有リンクはワークスペース状態をエンコードしており、機密情報には使用しないでください。
* 🏢 エンタープライズ顧客は、ライブプロバイダーロールアウト前にセキュリティレビューとカスタム条項を行うべきです。

---

## 🗺️ ロードマップ

* 🧾 バックエンドで強制されるシート制限
* 🧪 カード不要トライアルライフサイクルの自動化
* 🚦 メール、ドメイン、利用状況によるトライアル悪用対策
* 👥 チーム招待フロー
* 🏢 組織ワークスペース
* 🔌 さらなるプロバイダーアダプター
* 💬 Slack アプリワークフロー
* 🐙 GitHub Action リリースゲートの拡張
* 📤 さらなるエクスポート形式
* 🔒 エンタープライズ向けセキュリティレビューパッケージ
* 📊 AI DevOps ウィジェット向けのライブバックエンドセッション・メッセージ数

---

## ✅ ステータス

Compass Ultra は稼働中です：

**本番環境：** [https://www.compassultra.com](https://www.compassultra.com)

**デモ：** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker：** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 対象ユーザー

速くリリースしつつ、本番前に証明が必要なチーム。

**自信を持ってリリース。証拠でレビュー。すべてのリリースを証明。** 🧭