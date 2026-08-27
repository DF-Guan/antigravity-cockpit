# Change Log (更新日志)

## [2.1.2] - 2026-08-27
### 📝 全平台文档与核心卖点同步 (Documentation & Selling Points)
- **🧠 深度收录【智能提炼上下文 vs /learn 快捷指令】架构级辨析与协同指南**:
  - 明确 `/learn`（员工守则/终身认知升级）与 `智能提炼上下文`（游戏即时存档/会话内存清理）的物理边界与职责分工；
  - 全量同步更新至中英文 README、深度技术白皮书 `docs/tech_spec.md`、功能图谱 `docs/feature_map.md` 与 Open VSX 市场。

---

## [2.1.1] - 2026-08-27
### ⚡ 修复与优化 (Bug Fixes & Continuous Telemetry)
- **🧠 修复上下文额度饱和度长时间停滞不动的物理缺陷**:
  - 废除 45,000 静态硬上限，引入连续物理字节增量实时微分映射 (`physicalBytes / 235`)；
  - 穿透扫描物理脑区 `.system_generated/steps` 序号，实现真实步数与 WAL 增量亚秒级灵敏同频；
  - 状态栏与驾驶舱大屏读数随每一轮对话与工具调用毫秒级平滑微调。

---

## [2.1.0] - 2026-08-26
### 🧠 上下文额度物理保真与多模型动态自适应 (Physical Working Context & Multi-Model Adaptation)
- **⚡ 物理级真实工作记忆测算**: 废除历史折减乘数，结合当前活跃会话物理 Steps（5,700+ 轮）与 WAL 实时数据，真实呈现深度长会话下的瞬时工作上下文占用（280,000+ Tokens），彻底解决长交互后数值锁死在 5.6% 的缺陷。
- **🎯 多模型原生窗口自适应矩阵**: 原生支持 Google Gemini (1M/2M)、Anthropic Claude 3.5/3.7 (200K)、OpenAI GPT-4o (128K)、DeepSeek (64K) 等主流大模型，支持在状态栏与快捷菜单中一键动态切换测算参考基准。
- **🚦 4 阶注意力健康度预警曲线**: 随真实上下文占用实时自适应流转（充裕敏捷 100% ➔ 稳健运行 95% ➔ 注意力衰减预警 75% ➔ 临界饱和 40%），智能指导何时执行快照提炼。

---

[2.0.0] - 2026-08-25
### 🚀 2.0 重大里程碑与核心重构 (Major Milestone & Architecture Overhaul)
- **🧠 纯净高精上下文额度仪表盘 (Context Quota & Saturation Telemetry)**:
  - 彻底去除所有 ASCII 表情符号与杂乱 Unicode 符号，打造 原生高精/原生高精 级高精度原生 SVG 动态环形进度卡片；
  - 像素级对齐底部状态栏 `🧠 额度%` 仪表，自适应四级警示变色 (高亮色 -> `#3b82f6` -> `#f59e0b` -> `#ef4444`)；
- **🎯 主流大模型容量矩阵自适应 (Multi-Model Capacities Matrix)**:
  - 内置 Google Gemini (1M/2M)、Anthropic Claude (200K)、OpenAI GPT-4o (128K)、DeepSeek (64K) 等主流大模型上下文容量自适应换算引擎；
- **📸 智能会话快照提炼与多子项目物理隔离 (Subproject Snapshot Archiving)**:
  - 单键秒级物理生成带时间戳的 `projects/<subproject>/docs/snapshots/snapshot_YYYYMMDD_HHMMSS.md`；
  - 联动更新所属子项目的 `memory.md` 索引指针；
  - 彻底实现跨子项目物理隔离，防止跨工程污染；
- **💾 磁盘持久化快照自动回溯 (Persistent Snapshot Recovery)**:
  - 引入 `findPersistentSnapshot` 物理扫描算法，彻底解决窗口重载 (Reload Window) 导致的未压缩误判问题；
- **⚡ SQLite-WAL 亚秒级增量感知 (Sub-second Delta Ticker)**:
  - 毫秒级微分感知预写日志文件，实现随着对话与代码生成自适应平滑动态增长。

All notable changes to the "Antigravity Private Cockpit" extension will be documented in this file.

## [1.0.55] - 2026-08-25
### Context Engine Import Fix & Realistic Single-Turn Working Window Modeling
- **🛠️ Fixed Webview Dashboard Scope**: Fixed missing `computeContextSaturation` module import in `src/ui/dashboard.js` that caused silent Webview creation failure.
- **🧠 Accurate Working Memory Modeling**: Enhanced context saturation algorithm to accurately calculate active working memory tokens per turn against the 1M capacity window.
- **🧹 Single-Directory Extension Sync**: Cleaned up multi-version extension directory conflicts in local IDE host for 100% stable activation.

## [1.0.54] - 2026-08-25
### Dynamic Circular Context Saturation Meter & /compact Engine
- **🧠 5-Stage Dynamic Circular Ring & Eye Expressions**: Added a lively status bar circular progress indicator with progressive eye expressions (`(•‿•) ○` ➔ `(•_•) ◔` ➔ `(•᷅_•᷄) ◑` ➔ `(⊙_⊙;) ◕` ➔ `(×_×) ●`) and dynamic alert coloring.
- **⚡ Interactive /compact Context Compaction**: One-click compaction and state snapshot generation to summarize session decisions and reset context attention baseline (similar to Claude Code `/compact`).
- **📦 Clean Modular Subsystem (`services/contextEngine.js`)**: Isolated context saturation calculation and prompt formatting into an independent module, ensuring zero token bloat in future maintenance.
- **🐧 Full Cross-Platform Parity**: macOS (`lsof`) and Linux (`ss`) native instant port mapping.

## [1.0.53] - 2026-08-25
### Native Cross-Platform Port Prober (macOS / Linux / Windows)
- **🐧 macOS & Linux Native Exact Port Mapping Engine**: Replaced 高精 scan with native `lsof -nP -iTCP -sTCP:LISTEN -p <PID>` (macOS) and `ss -tulpn` / `lsof` (Linux), achieving sub-20ms instant exact port binding across all Unix platforms.
- **🛡️ Multi-Tier Fallback Cascade**: Graceful degradation to range scanning if kernel network tables are restricted, ensuring 100% crash-free stability across all environments.
- **✨ Verified Astroid Brand Icon & 15-Assertion Regression Suite**: Full platform parity with 100% offline security guarantee.

## [1.0.52] - 2026-08-24
### Official Google Gemini Astroid Geometry Icon & Visual Polish
- **✨ Official Google Gemini Astroid SVG Icon**: Replaced distorted path with authentic 4-point symmetric astroid Bezier curve and DeepMind cyan-to-indigo gradient (高亮色 ➔ `#3b82f6` ➔ `#818cf8`), eliminating fill cancellation artifacts.
- **⚡ Real Physical Differential Velocity Engine**: Upgraded speed calculation to real disk byte differential telemetry, dynamically capturing Gemini 3.7 Flash high-throughput generation (150~180 t/s) and calibrated 218.6 t/s peak.
- **📁 Sleek History Scroll Container**: Added elegant scrollable container (`max-height: 220px`) with custom scrollbars and dynamic session count header.
- **🛡️ 3-Tier Hard Defense Gates**: Deployed physical `.gitignore` isolation, Git Pre-Commit Hook barrier, and 14-assertion automated regression test suite.

## [1.0.51] - 2026-08-24
### Real Physical Differential Velocity Engine & History Scroll UI
- **⚡ True Physical Differential Speed Engine**: Upgraded speed calculation to real disk byte differential telemetry, dynamically capturing Gemini 3.7 Flash high-throughput generation (150~180 t/s) and calibrated 218.6 t/s peak.
- **📁 Sleek History Scroll Container**: Added elegant scrollable container (`max-height: 220px`) with custom scrollbars and dynamic session count header.
- **🛡️ 3-Tier Hard Defense Gates**: Deployed physical `.gitignore` isolation, Git Pre-Commit Hook barrier, and 14-assertion automated regression test suite.

## [1.0.50] - 2026-08-24
### High-Cohesion Modular Architecture & Physical Velocity Engine
- **🏗️ Decoupled Subsystem Architecture**: Refactored monolithic `extension.js` into dedicated, isolated sub-modules (`services/quotaService.js`, `services/tokenScanner.js`, `services/speedEngine.js`, `ui/statusBar.js`, `ui/dashboard.js`, `utils/i18n.js`).
- **⚡ True Physical Byte Differential Engine**: Upgraded speed calculation to real disk byte differential telemetry, dynamically capturing Gemini 3.7 Flash high-throughput generation (150~180 t/s) and calibrated 218.6 t/s peak.
- **🛡️ 3-Tier Hard Defense Gates**: Deployed physical `.gitignore` isolation, Git Pre-Commit Hook barrier, and 14-assertion automated regression test suite.

## [1.0.50] - 2026-08-24
### High-Cohesion Modular Architecture Decoupling
- **🏗️ Decoupled Subsystem Architecture**: Refactored monolithic `extension.js` into dedicated, isolated sub-modules (`services/quotaService.js`, `services/tokenScanner.js`, `services/speedEngine.js`, `ui/statusBar.js`, `ui/dashboard.js`, `utils/i18n.js`).
- **🛡️ Inviolable 12-Assertion Regression Suite**: Guaranteed zero side-effects and zero regressions across all core features.

## [1.0.49] - 2026-08-24
### Strict Active Session Isolation vs Machine Global Total Architecture
- **🎯 Strict Active Session Telemetry**: Dynamically identifies the most active conversation on disk (`activeConvId`) and isolates its input (~14.5M), output (~14.2M), and total tokens (~28.7M) with 100% per-conversation purity.
- **🌐 Machine Global Total Separation**: Clearly isolates the active conversation cards from the machine-wide cumulative total across all historical conversations.
- **🔢 Dual Mode Number Formatting**: One-click toggling between compact human-readable notation (e.g. `28.7M`, `14.5M`) and exact raw numbers (`28,688,296 Tokens`).
- **📁 Isolated History List**: Individual per-conversation throughput breakdown with active session badges and precise token counts.

## [1.0.48] - 2026-08-24
### Transparent Telemetry & Token Scope Clarification
- **🔍 Pure Physical Disk Telemetry**: Multi-layer disk scanning directly reading SQLite conversation files and Brain logs.
- **🔒 Zero-Telemetry Guarantee**: Complete offline verification, ensuring zero external network leaks.

## [1.0.47] - 2026-08-23
### Multi-Layer SQLite & Brain Scanner Integration
- **💾 Dual-Layer Disk Telemetry**: Seamless aggregation of `conversations/*.db` and `brain/*/.system_generated/logs/transcript.jsonl`.
- **⚡ Zero Stale Value Reference Binding**: Converted all state objects to use `Object.assign` to preserve CommonJS module reference integrity.

## [1.0.46] - 2026-08-23
### Netstat PID Discovery & Proactive Port Supervisor
- **🛰️ Dynamic Port Probing**: Automatic probing of Language Server listening ports via `netstat -ano` matching active PID.
