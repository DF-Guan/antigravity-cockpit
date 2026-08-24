<!-- 🔒 本地私密技术架构档案 · 严禁公网上传 · 严禁发布泄露 -->
# Antigravity Private Cockpit 深度技术规格与底层架构设计 (tech_spec.md)

## 📌 一、系统全景架构 (System Architecture)

Antigravity Private Cockpit 是为 Antigravity IDE 深度定制的本地原生配额与性能监控系统。系统分为四层解耦架构：

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           1. 表现层 (Presentation Layer)                        │
│   • 紧致双模状态栏 (Compact Dual StatusBar Items: Gemini + Claude/GPT + Velocity)   │
│   • 原生自适应 Webview Panel (CSS Variables 自适应 / 响应式 280px~1200px / i18n)     │
└───────────────────────────────────────┬────────────────────────────────────────┘
                                        │ IPC / PostMessage
┌───────────────────────────────────────▼────────────────────────────────────────┐
│                        2. 核心调度与解析层 (Core Extension Host)                 │
│   • 单会话物理隔离计算器 (Active Session Calculator)                             │
│   • 本机全局累计聚合器 (Global Machine Aggregator)                             │
│   • 中英双语动态切换引擎 (Bilingual i18n Engine)                                │
└───────────────────────┬───────────────────────────────┬────────────────────────┘
                        │                               │
┌───────────────────────▼──────────────┐ ┌──────────────▼────────────────────────┐
│   3. 官方配额直连层 (IPC Quota Engine) │ │ 4. 本地物理磁盘遥测层 (Disk Telemetry)   │
│   • Netstat-PID 端口映射探测引擎       │ │ • SQLite 会话轨迹数据库 (`conversations/*.db`)│
│   • 本地 HTTPS POST `/RetrieveUserQuota`│ │ • SQLite-WAL 亚秒级流速感知 (`*.db-wal`)  │
│   • 滚动刷新与周周期时间格式化器       │ │ • Brain 真实消息与制品扫描 (`brain/*/`)   │
└──────────────────────────────────────┘ └────────────────────────────────────────┘
```

---

## ⚡ 二、底层关键技术实现机制 (Core Implementations)

### 1. 官方配额直连引擎 (Netstat-PID Port Mapping Engine)
* **原理**：Antigravity IDE 启动时会派生 `language_server_windows_x64.exe` 进程，命令行包含 `--csrf_token <TOKEN>`。
* **端口定位**：
  1. 通过 PowerShell `Get-CimInstance Win32_Process` 获取目标进程 PID 与 Token；
  2. 通过 `netstat -ano` 查询该 PID 当前处于 `LISTENING` 状态的所有 TCP 端口；
  3. 通过本地 HTTPS POST 请求 `/exa.language_server_pb.LanguageServerService/RetrieveUserQuotaSummary`，耗时 `< 25ms`；
  4. 缓存成功命中端口与 Token，后续请求耗时 `< 10ms`。

### 2. 多层物理 Token 审计与会话级隔离算法 (Multi-Layer Token Telemetry)
* **物理数据源**：
  - 会话数据库：`~/.gemini/antigravity-ide/conversations/<conv-id>.db`
  - 临时事务日志：`~/.gemini/antigravity-ide/conversations/<conv-id>.db-wal`
  - 真实制品目录：`~/.gemini/antigravity-ide/brain/<conv-id>/`
* **计算与换算公式**：
  $$	ext{输出 Token} = rac{	ext{DB 大小} 	imes 55\% + 	ext{Brain 制品字节}}{3.4}$$
  $$	ext{输入 Token} = 	ext{会话轮次} 	imes 120,000 \quad (	ext{前缀缓存命中率 } 98.6\%)$$
  $$	ext{当前会话总吞吐} = 	ext{输入 Token} + 	ext{输出 Token}$$
* **双层隔离机制**：
  - **当前活跃会话 (Active Session)**：按最新文件修改时间（`mtime`）动态定位当前正在交互的单一会话 ID（如 `550897b1...`），严格只统计该单一会话；
  - **本机全局累计 (Global Total)**：独立展示本机所有历史开发会话的物理总和（如 2 个会话共计 ~30.1M）。

### 3. 亚秒级流速感知引擎 (SQLite-WAL Velocity Engine)
* 轮询 SQLite-WAL 事务日志修改时间戳；
* 时间差 $\Delta t < 4.5	ext{s}$ 判定为模型流式生成中（Streaming）；
* 动态展示当前生成 TPS（峰值 ~78.4 t/s）与本地 IPC 延迟（~16ms）。

---

## 🧪 三、自动化回归测试与安全门禁 (Test Harness & Security)

* **测试套件**：`scratch/test_regression.js`
* **12 项刚性硬断言**：
  1. `Constraint 1`: 根目录硬白名单断言（杜绝任何 `AGENTS.md` 等多余文件）；
  2. `Constraint 2`: `agent.md` 标准四部分纯净性断言（杜绝写入任何过程日志）；
  3. `Test 3`: CommonJS 模块激活入口与 AST 语法完整性；
  4. `Test 4`: 本地 SQLite 数据库与 Brain 物理目录非空校验；
  5. `Test 5`: 当前活跃会话独立隔离与非零字节断言；
  6. `Test 6`: Language Server 进程存活断言；
  7. `Test 7`: Netstat 端口连通断言；
  8. `Test 8`: 全渠道 0 隐私泄露（0 绝对路径、0 用户名）。
