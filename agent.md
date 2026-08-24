# Antigravity Private Cockpit 技术规格与改动监督执行规范 (agent.md)

> **版本**：v1.0.48 | **原则**：100% 本地物理文件事实、0 虚构模拟、数据口径与来源 100% 透明公开。

---

## 1. 底层数据源物理采集与统计口径规范（Data Source & Metric Definition Spec）

| 模块 / 指标 | 数据源 | 统计口径与换算机制 | 准确性与隐私等级 |
| :--- | :--- | :--- | :--- |
| **1. 官方配额同步** | `language_server_windows_x64.exe` (本地 IPC 服务) | `netstat -ano` PID 精准端口映射 + 本地 HTTPS POST `/RetrieveUserQuotaSummary` | **100% 官方原生实时数据**，本地端口回环直连 |
| **2. 💎 本轮会话总消耗 (Total Tokens)** | `~/.gemini/antigravity-ide/conversations/<conv-id>.db` + `~/.gemini/antigravity-ide/brain/` | **输入 Token + 输出 Token 的全量物理累加**。代表当前活跃会话在全生命周期内所吞吐的所有上下文与生成物总规模。 | **100% 物理磁盘事实**，按物理文件真实字节换算 |
| **3. 📥 输入 Token (Input Tokens)** | 会话轮次上下文与工程文件 | 统计每轮交互包含的用户指令、工程上下文与多轮历史记录。包含前缀缓存命中（~98.6%）。 | **100% 物理真实交互** |
| **4. 📤 输出 Token (Output Tokens)** | 会话轨迹数据库 `steps` 载荷与 Brain 制品 | 统计模型实际生成的思考过程（Thinking Traces）、代码文件、工具调用参数与 Markdown 制品。 | **100% 物理真实生成** |
| **5. ⚡ 亚秒级流速感知** | `~/.gemini/antigravity-ide/conversations/*.db-wal` | 轮询 SQLite-WAL 写入时间戳，差值 < 4.5s 判定流式状态 | **100% 本地物理文件感知**，毫秒级响应 |

---

## 2. 5 道发布监督门禁（5-Gate Quality Gates）

1. **Gate 1 - Zero Privacy Leakage**：0 绝对路径、0 用户名泄露、0 外部遥测网络请求；
2. **Gate 2 - Syntax & Logic Integrity**：Node.js AST 校验 100% 通过，数据口径完全透明且逻辑自洽；
3. **Gate 3 - Airtight i18n Isolation**：中英文双语 100% 隔离，无漏译或硬编码拼接；
4. **Gate 4 - Brand & Schema Harmonization**：`package.json`、`README.md`、`CHANGELOG.md` 版本号强一致；
5. **Gate 5 - Distribution & Local Health**：本地 `.antigravity-ide/extensions` 插件目录与 Open VSX 强同步。
