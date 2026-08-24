# Antigravity Private Cockpit 技术规格与改动监督执行规范 (agent.md)

> **版本**：v1.0.49 | **原则**：100% 本地物理隔离计算、会话级与全局级分层清晰、拒绝混淆。

---

## 1. 会话级 (Active) vs 全局级 (Global) 数据源物理采集规范

| 维度 / 指标 | 数据源 | 统计口径与隔离机制 | 准确性与隐私等级 |
| :--- | :--- | :--- | :--- |
| **1. 💎 当前活跃会话 (Active Session)** | `conversations/<active-id>.db` + `brain/<active-id>/` | **严格只统计当前正在交互的单一会话**。按最新 mtime 动态捕获当前活跃会话 ID（如 `550897b1...`）。 | **100% 单会话物理隔离** |
| **2. 🌐 本机历史全局累计 (Global Total)** | 本机所有 `conversations/*.db` + `brain/*/` | 统计本机历史上所有开发会话的物理总和（例如 2 个会话共计 30.1M）。 | **100% 全量物理磁盘事实** |
| **3. 📥 输入 Token (Input)** | 活跃会话历史与工程上下文 | 统计当前活跃会话发送给模型的累计上下文规模（包含 98.6% 前缀缓存命中）。 | **100% 物理真实交互** |
| **4. 📤 输出 Token (Output)** | 活跃会话轨迹载荷与制品 | 统计模型在当前活跃会话中实际生成的思考过程（Thinking Traces）、代码文件与制品。 | **100% 物理真实生成** |
| **5. 官方配额同步** | `language_server_windows_x64.exe` (本地 IPC) | `netstat -ano` PID 精准端口映射 + 本地 HTTPS POST `/RetrieveUserQuotaSummary` | **100% 官方原生实时数据** |
| **6. 亚秒级流速感知** | SQLite-WAL 事务修改时间戳 | 差值 < 4.5s 判定流式状态，动态计算 TPS | **100% 本地物理文件感知** |

---

## 2. 5 道发布监督门禁（5-Gate Quality Gates）

1. **Gate 1 - Zero Privacy Leakage**：0 绝对路径、0 用户名泄露、0 外部遥测网络请求；
2. **Gate 2 - Syntax & Logic Integrity**：Node.js AST 校验 100% 通过，当前会话与全局累计逻辑隔离严格；
3. **Gate 3 - Airtight i18n Isolation**：中英文双语 100% 隔离，无漏译或硬编码拼接；
4. **Gate 4 - Brand & Schema Harmonization**：`package.json`、`README.md`、`CHANGELOG.md` 版本号强一致；
5. **Gate 5 - Distribution & Local Health**：本地 `.antigravity-ide/extensions` 插件目录与 Open VSX 强同步。
