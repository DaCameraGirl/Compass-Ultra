# 🧭 Compass Ultra 

> **为通过功能开关发布软件的团队提供发布情报。**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-6366f1?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra 是面向功能开关软件的发布控制室。在生产变更上线之前，审查开关状态、策略门禁、发布风险、快照差异、AI 辅助风险分析，以及可用于审计的发布证明。

[🚀 在线应用](https://www.compassultra.com) · [🎮 试用演示](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ 为什么选择 Compass Ultra？

功能开关本应让发布更安全。

但随着时间推移，它们本身也可能成为发布风险面：

* 🧟 陈旧或过期的开关
* 🎲 高风险的发布百分比
* 👤 缺少负责人和审批人
* 🕸️ 隐藏的开关依赖关系
* 🚨 生产环境覆盖（override）
* 💬 用 Slack 线程冒充审计记录
* 🧩 发布决策分散在过多工具中

**Compass Ultra 将功能开关的混乱转化为可重复的发布审查工作流。**

不再问：

> "可以发布了吗？"

您的团队可以回答：

* ✅ 启用了什么？
* 👥 影响了谁？
* 🔄 发生了什么变化？
* 💥 什么可能会出问题？
* 🖊️ 谁批准的？
* 🧯 需要先修复什么？
* 📄 我们可以向 QA、DevOps、管理层或合规团队提供什么证明？

---

## ⚡ 简短版

Compass Ultra 帮助团队在发布前审查并证明发布就绪状态。

典型的发布审查流程如下：

1. 📦 加载或导入发布工作区。
2. 👤 根据真实用户上下文评估开关。
3. 🛡️ 运行策略门禁和风险分析。
4. 🔍 比较发布快照。
5. 📄 导出发布运行手册。
6. 🚀 在生产变更上线前共享证明。

---

## 🎮 在线演示

演示无需账户即可使用：

**演示：** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

演示模拟了一个高风险的零售发布场景（黑色星期五前夕，`peak-sale-2026.11`），包含：

* 🏁 跨 LaunchDarkly、Statsig 和 Firebase 的 10 个功能开关
* 🛒 高风险的结账、闪购和当日达开关
* 🚧 策略阻塞项和警告（依赖缺失、金丝雀违规）
* 🔗 依赖关系图检查
* 🧾 快照比较
* 📄 PDF 运行手册导出
* 🔌 GitHub、Jira 和 Slack 载荷生成
* 🧯 演示状态的 kill-switch 回滚流程
* 💰 高峰流量部署窗口的财务影响估算

---

## 🧠 核心功能

### 🚦 发布风险分析器

Compass Ultra 审查当前发布工作区，并返回实用的发布评估：

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

由实时 AI 服务驱动，并配有确定性回退机制——即使 AI 服务不可用，分析也不会被阻断。

它可以检测以下问题：

* 🔥 高风险的活跃开关
* 🔗 依赖冲突
* 👻 缺少审批人
* ⏰ 已过期或无负责人的开关
* 🐤 金丝雀发布违规
* 🚨 生产环境覆盖
* 🧾 合规敏感的发布模式
* 💰 高峰流量部署窗口的财务影响估算

---

### 🎯 开关评估引擎

根据特定用户上下文评估每个开关。

| 字段 | 说明 |
| --- | --- |
| 👤 User key | 唯一用户标识符 |
| 📧 Email | 用户电子邮件地址 |
| 🏢 Tenant | 客户或账户租户 |
| 💳 Plan | 定价或权益计划 |
| 🛂 Role | 用户角色或权限组 |
| 🌎 Region | 地理或基础设施区域 |
| 🏳️ Country | 国家级定向 |
| 📱 Device | 设备或平台类型 |
| 🌐 Environment | 开发、预发布、生产或自定义环境 |

每个开关显示：

* 🎚️ 评估值
* 🧠 解析原因（规则匹配、发布分桶、默认值或覆盖）
* 🧩 匹配的规则或条件
* 📌 评估时使用的相关上下文

在已保存的上下文预设之间切换——Production admin、EU customer、Mobile guest——查看开关在不同细分人群中的行为。

---

### 🛡️ 企业策略门禁（9 项检查）

Compass Ultra 在工作区状态每次变更时运行自动化发布检查。

| 🔒 门禁 | 检查内容 |
| --- | --- |
| 🎟️ Change ticket attached | 生产环境前已附加 CHG 或 Jira 工单 |
| 👥 Critical flags have approvers | 所有高/关键活跃开关均有指定审批人 |
| 🧬 Every flag has traceability | 所有开关均有 Jira/变更 ID |
| ⏳ No expired flags enabled | 没有已启用的过期开关 |
| 🚫 Production override discipline | 生产环境中没有活跃的手动覆盖 |
| 🐤 Canary rollout limit | 需要金丝雀的开关保持在 50% 发布比例以内 |
| 🔗 Dependencies enabled | 没有已启用开关的依赖项处于禁用状态 |
| 🔌 Live provider adapters configured | 至少连接了一个提供商令牌 |
| 📤 Outbound DevOps hooks configured | 已配置 GitHub/Jira/Slack 端点 |

---

### 🤖 AI DevOps 聊天小部件

一个可嵌入任意页面的浮动 AI 聊天助手，只需一个脚本标签：

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 用自然语言提问发布相关问题
* 🔍 自动读取实时工作区状态
* 📊 会话计数器显示有多少访客使用过
* ⚡ AI 服务不可用时优雅降级
* 🧠 在同一会话中跨消息保持聊天历史

在线试用：[https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 提供商集成（只读同步）

通过服务器代理，使用客户自有的只读令牌从您的开关提供商导入实时开关状态。

| 🏴 Provider | 类型 |
| --- | --- |
| 🚀 LaunchDarkly | Provider sync |
| 📊 Statsig | Provider sync |
| 🔓 Unleash | Provider sync |
| 🏳️ Flagsmith | Provider sync |
| 🔥 Firebase Remote Config | Provider sync |

🔒 API 密钥永远不会离开后端代理。浏览器仅调用 Compass Ultra API。

---

### 📤 出站 DevOps 集成

一键复制载荷或 POST 到您现有的工具：

| 🔌 Integration | 类型 |
| --- | --- |
| 🐙 GitHub Issues | 发布证据 issue |
| 🎫 Jira Change | CHG 工单更新 |
| 💬 Slack War Room | 发布阻塞 / 富文本消息 |

---

### 🔍 快照差异

比较两个发布检查点，精确查看发生了什么变化。

差异可识别：

* ➕ 新增的开关
* ➖ 移除的开关
* 📈 发布比例变更
* 🚨 关键性变更
* 👤 负责人或审批人变更
* 🛠️ 覆盖变更

---

### 📄 PDF 发布运行手册与证书

导出适用于 CAB 的 PDF，供 QA、管理层、DevOps 或审计审查使用。

运行手册包含：

* 🏷️ 发布元数据和部署窗口
* 🎯 开关评估和发布状态
* 🛡️ 策略门禁结果
* 🧠 风险摘要和财务影响
* 🧯 每个开关的回滚说明
* ✍️ 审批人签字列表
* 🧾 审计历史

---

### 🐙 GitHub Action CI 门禁

当发布风险超过配置阈值时，在 CI 中阻止部署：

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 如果发现阻塞项，该 action 会自动使工作流失败——告别"合并前忘了检查开关"。

---

### 👥 RBAC（4 种角色）

| 🎭 Role | 权限 |
| --- | --- |
| 🔑 Admin | 完全访问——开关、发布、团队、集成 |
| ✅ Approver | 批准发布，查看全部 |
| 🛠️ Operator | 编辑开关和发布元数据 |
| 👁️ Viewer | 只读 |

所有被阻止的操作都会记录操作者、角色、触发的门禁和精确时间戳。

---

## 🧭 产品定位

Compass Ultra **不是**功能开关提供商。

它是围绕功能开关的**发布审查层**。

当您需要明确回答以下问题时，请使用它：

> "我们能否安全地发布这个带功能开关的版本，并且能否证明这一点？"

---

## 💸 定价

| 计划 | 价格 | 席位 | 最适合 |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | 仅本地 | 试用工作区和本地发布审查 |
| 🧍 Solo | $49/mo | 1 席位 | 需要云同步、风险分析、快照和导出的个人运营者 |
| 🚀 Pro | $149/mo | 最多 5 席位 | 需要共享发布审查和差异对比的小型团队 |
| 👥 Team | $299/mo | 最多 15 席位 | 需要 RBAC、审计导出、告警和组织工作流的发布团队 |
| 🏢 Enterprise | Custom | Custom | 安全审查、入门引导、定制条款和集成 |

付费计划提供 **7 天免费试用**。

无需信用卡。除非客户订阅，否则试用将自动降级为 Free。

---

## 🛠️ 技术栈

| 层级 | 技术 |
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
| 🧱 Backend | backend 仓库中的 Express API |
| 🐘 Database | 通过 backend 使用 PostgreSQL |
| 🤖 AI risk analysis | 带确定性回退的后端 AI 服务 |
| ☁️ Hosting | Vercel（前端）· Railway（后端） |

---

## 📦 源代码

此公开仓库包含 Compass Ultra 发布页、文档、GitHub Pages 资源和面向公众的项目材料。

生产应用和后端单独维护。公众用户无需访问私有实现仓库即可探索在线应用和演示。

---

## 🔒 安全模型

Compass Ultra 被设计为发布审查层。

* 🧪 本地演示无需登录。
* 🔐 云快照需要身份验证。
* 🔌 提供商同步通过后端代理使用只读令牌——API 密钥不会经过浏览器。
* 🛡️ 所有响应均含安全头：`X-Frame-Options`、`Content-Security-Policy`、`Strict-Transport-Security`、`X-Content-Type-Options`。
* 💳 Stripe 处理卡片数据。
* 🪪 Auth0 是身份提供商。
* 🔗 分享链接编码工作区状态，不应用于传递机密信息。
* 🏢 企业客户应在上线提供商集成前完成安全审查并签署定制条款。

---

## 🗺️ 路线图

* 🧾 后端强制执行席位限制
* 🧪 无需信用卡的试用生命周期自动化
* 🚦 按邮箱、域名和使用情况的试用滥用控制
* 👥 团队邀请流程
* 🏢 组织工作区
* 🔌 更多提供商适配器
* 💬 Slack 应用工作流
* 🐙 GitHub Action 发布门禁扩展
* 📤 更多导出格式
* 🔒 企业版安全审查包
* 📊 AI DevOps 小部件的实时后端会话和消息计数

---

## ✅ 状态

Compass Ultra 已上线：

**生产环境：** [https://www.compassultra.com](https://www.compassultra.com)

**演示：** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker：** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 面向对象

发布速度快、但仍需在生产前拿出证明的团队。

**自信发布。有据审查。证明每一次发布。** 🧭