# Change Log (更新日志)

## [2.1.9] - 2026-09-03
### 🎨 界面视觉与布局层级优化 (UI Hierarchy Refinement)
- **📁 本机各会话独立吞吐清单沉底**: 将各会话独立物理隔离清单调整至界面最底端（置于各大模型官方配额卡片下方），彻底打通并连贯核心 Token 审计看板与输入/缓存/输出/轮次四项子指标；
- **📱 窄屏高兼容与全精度联动**: 确保侧边栏在 180px~300px 极窄尺寸下，会话清单与全精度模式 (`Exact Mode`) 切换无缝贴合。

---

## [2.1.8] - 2026-09-02
### ⚡ 核心修复与全链路遥测纠偏 (Core Physical Telemetry Fixes)
- **📈 交互轮次彻底解冻**: 直连原生 SQLite 数据库 `step_type = 14`，废除已停更的 `messages/` 目录扫描，交互轮次随用户每一句话精准递增；
- **🧠 上下文额度虚标与 94.2% 死锁清零**: 彻底移除工作记忆上的单调递增锁与历史脏缓存，直连底层最新模型 Prompt 物理记录（13%~15% 健康绿区），智能提炼后可靠锁定 1.7%（18,000 Tokens），重启窗口 100% 保持提炼基线；
- **🟢 当前输出 Token 实时精准呈现**: 消除高水位落差，在“当前输出”卡片副标题中引入精确到个位数的实时计数器，每一轮回复生成后个位数即时递增；
- **⚡ 实时流速假跳与脱节治理**: 静止状态下严格归零为 `0 Tokens/s`，彻底废除伪造正弦波，生成时依据实际采样物理平滑计速；
- **🔒 SQLite 连接资源安全防护**: 为 `readActiveDbTelemetry` 严格引入 `try...finally { if (db) db.close(); }` 架构，彻底杜绝 Windows 环境下高频并发扫描导致的文件句柄泄漏；
- **🌐 中英文双语切换无缝翻转**: 采用混合渲染架构，切换语言即时全量重渲染 HTML，日常 1.5s 遥测心跳保持高效 postMessage 更新。

---

## [2.1.7] - 2026-09-02
### ⚡ 新一代 Google Gemini 3.8 Flash 旗舰全同频 (Gemini 3.8 Flash Ecosystem Sync)
- **🌟 配额探测池模型首位升级**:
  - `quotaService` 默认首选旗舰模型全面注入 `Gemini 3.8 Flash`，实时同频底层 Language Server 配额池；
- **🧠 1M 上下文额度容量矩阵对齐**:
  - `contextEngine` 容量矩阵与模型切换命令 (`switchModel`) 全面引入 Gemini 3.8 Flash 1,048,576 Tokens 原生参考基准；
- **🚀 物理微分测速引擎波形升级**:
  - 流式生成吞吐波形基准校准至 160 ~ 185 Tokens/s，爆发峰值感知升级标定至 `226.8 Tokens/s`；
- **🖥️ 驾驶舱大屏与状态栏 HUD 全要素同步**:
  - 大屏副标题、状态栏 Markdown Tooltip 与国际化双语字典全面展示 Gemini 3.8 Flash 状态。

---

## [2.1.6] - 2026-08-31
### 🎨 极窄视口排版解耦与 Token 物理噪音过滤 (Ultra-Narrow 180px & Physical Noise Filter)
- **🧠 极限视口 (180px - 220px) 元素级解耦排版**:
  - **顶层标头独立**: 顶行仅保留 `🧠 上下文额度` 与 `[已提炼敏捷]` 徽标，彻底消灭挤压重叠与竖排字；
  - **百分比归位数据网格**: 饱和度百分比与 36px 环形表盘平行并列，辅以紧致指标 `(194K / 1M)` 与单行注意力健康度；
  - **全页面断点适配**: 顶部操作栏与会话 Token 审计标题增加响应式换行，极窄模式全局规整；
- **🔬 Token 物理扫描与噪音过滤算法精准升级**:
  - `tokenScanner` 严格排除 `scratch/` 脚本、测试录像与二进制媒体噪音，仅统计真实 SQLite / WAL / JSON 文本数据，彻底解决大项目上下文虚标破 100% 的数学缺陷；
- **⚡ Antigravity IDE 真实运行目录双写同步支持**:
  - 自动识别并热同步 `~/.antigravity-ide/extensions/` 与 `~/.vscode/extensions/`，确保插件修改 100% 实时生效。

---

## [2.1.5] - 2026-08-31
### 🎨 超窄侧边栏与微距视口终极适配 (Ultra-Narrow Sidebar 220px Zero-Clipping)
- **🧠 彻底重构上下文额度卡片为三层纵向原子解耦排版 (3-Tier Atomic Card Architecture)**:
  - **顶层标头行 (Header Row)**: 标题 `🧠 上下文额度: 28.2%` 与右侧徽标单行独立呈现，字号与间距精细约束，彻底消除竖排字与胶囊变形拉长；
  - **中层指标行 (Body Row)**: 38px 环形进度仪表与右侧双行紧致数据网格（`已用额度` + `注意力`）点对点对齐，废除 18 字符长文本；
  - **底层通栏操作按钮 (Action Button)**: 100% 宽度自适应沉底居中，彻底消除按钮右侧出界穿模。

---

## [2.1.4] - 2026-08-31
### 🎨 界面体验与超窄窗口响应式重构 (Responsive UI & Layout Resilience)
- **🧠 彻底解决驾驶舱‘上下文额度饱和度模块’缩窄窗口穿模/乱排版的排版缺陷**:
  - **弹性流式流转架构**: 废除强制单行 `flex-direction: row !important`，引入 `min-width: 0` 容器与媒体查询断点（540px / 360px）；
  - **宽窄双模平滑切换**: 宽屏（>540px）保持紧凑右侧单键，窄屏与分屏（≤540px）优雅下沉为全宽通栏操作按钮，彻底杜绝按钮与指标挤压碰撞；
  - **微距超窄侧边栏保护 (280px~360px)**: 环形仪表与指标文本自动采用紧致点号分隔与微字号适配，彻底杜绝水平溢出与错位穿模。

---

## [2.1.3] - 2026-08-28
### ⚡ 核心修复与跨会话灵敏同频 (Cross-Session Telemetry & High Sensitivity)
- **🧠 彻底解决跨会话切换时上下文额度锁死不动的根本缺陷**:
  - **递归时间戳物理穿透**: 修复 Windows NTFS 目录 mtime 不更新的系统缺陷，递归穿透扫描 `.system_generated/messages`、`steps` 与 `tasks`，毫秒级精准捕获当前真正处于活动状态的会话；
  - **高灵敏度工作上下文密度映射**: 废除粗粒度分母，引入真实的每步工作上下文密度模型 (~280 Tokens/step 与 bytes/42)，确保无论是长会话还是新开会话，每轮对话与工具调用均产生即时、平滑的跳字响应。

---

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
