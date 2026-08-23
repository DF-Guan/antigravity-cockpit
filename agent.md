# Antigravity Private Cockpit 技术规格与改动监督执行规范 (agent.md)

> **版本**：v1.0.47 | **原则**：100% 本地物理文件事实、0 虚构模拟、0 营销浮夸、严谨工程验证。

---

## 1. 底层数据源物理采集规范（Data Source Spec）

| 模块 | 数据源 | 采集机制 | 准确性与隐私等级 |
| :--- | :--- | :--- | :--- |
| **1. 官方配额同步** | `language_server_windows_x64.exe` (本地 IPC 服务) | `netstat -ano` PID 精准端口映射 + 本地 HTTPS POST `/RetrieveUserQuotaSummary` | **100% 官方原生实时数据**，本地端口回环直连 |
| **2. 会话物理 Token 审计** | `~/.gemini/antigravity-ide/conversations/*.db` + `~/.gemini/antigravity-ide/brain/` | 真实统计会话轨迹数据库（52MB+）与 Brain 目录下物理文件字节数，计算真实 Input / Output Token | **100% 物理磁盘事实**，按真实 mtime 聚合 |
| **3. 亚秒级流速感知** | `~/.gemini/antigravity-ide/conversations/*.db-wal` | 轮询 SQLite-WAL 写入时间戳，差值 < 4.5s 判定流式状态 | **100% 本地物理文件感知**，毫秒级响应 |
| **4. 价值估算政策** | **已彻底移除推测性金额** | 杜绝任何未经官方支持的推测性金额换算，只展示纯粹物理 Token 事实 | **严禁任何虚拟金额与模拟权重** |

---

## 2. 5 道发布监督门禁（5-Gate Quality Gates）

1. **Gate 1 - Zero Privacy Leakage**：0 绝对路径、0 用户名泄露、0 外部遥测网络请求；
2. **Gate 2 - Syntax & Logic Integrity**：Node.js AST 校验 100% 通过，Netstat PID 端口引擎与多层物理文件审计逻辑无异常；
3. **Gate 3 - Airtight i18n Isolation**：中英文双语 100% 隔离，无漏译或硬编码拼接；
4. **Gate 4 - Brand & Schema Harmonization**：`package.json`、`README.md`、`CHANGELOG.md` 版本号强一致；
5. **Gate 5 - Distribution & Local Health**：本地 `.antigravity-ide/extensions` 插件目录与 Open VSX 强同步。
