# Antigravity 隐私配额驾驶舱 (antigravity-cockpit) - 项目说明与运行手册 (agent.md)

## 🎯 1. 项目目标 (Project Goals)
- **定位**: 专为 Antigravity IDE 打造的高端原生状态栏监控与隐私配额可视化驾驶舱插件。
- **核心功能**:
  1. **双核心官方配额实时同步**: 原生对接 Google Gemini 与 Anthropic Claude & GPT 双系列模型配额池，支持周周期重置与 5 小时冲刺刷新感知；
  2. **双层物理 Token 审计**: 严格隔离当前活跃会话（Active Session）与本机历史全局累计（Global Total），100% 取自本地 SQLite 轨迹数据库与 Brain 物理文件；
  3. **亚秒级流速感知**: 监听 SQLite-WAL 事务时间戳，毫秒级感知模型流式生成状态与 TPS 吞吐速率；
  4. **100% 纯本地离线隐私**: 零外部网络依赖，零隐私数据外流，无外部遥测。

---

## 🛠️ 2. 技术栈与环境依赖 (Tech Stack)
- **运行环境**: VS Code / Antigravity IDE Extension Host (CommonJS)
- **核心技术**: Node.js `https` (本地回环直连), `child_process` (`powershell` / `netstat`), SQLite-WAL 时间戳监听
- **界面架构**: 原生 Webview Panel (Vanilla HTML5 / CSS3 变量自适应 / 响应式多断点适配)
- **国际化**: 中英双语 (ZH/EN) 100% 隔离与运行时动态无感切换

---

## 🚀 3. 运行、调试与测试指令 (Runbook & Commands)
- **本地自动化回归测试 (8 项全量硬断言)**:
  ```bash
  node scratch/test_regression.js
  ```
- **本地扩展热加载与重载**:
  - IDE 中按下快捷键 `F1` ➔ 输入 `Developer: Reload Window`
- **打包 VSIX 安装包**:
  ```bash
  vsce package --out "dist/antigravity-cockpit-<version>.vsix" --no-dependencies
  ```
- **发布至 Open VSX (需通过 5 道发布门禁)**:
  ```bash
  ovsx publish "dist/antigravity-cockpit-<version>.vsix" --pat <OVSX_TOKEN>
  ```

---

## 📐 4. 专属开发规则与交付标准 (Project Rules & Standards)
1. **100% 真实物理数据原则 (Fact Grounding)**:
   - 严禁任何算法模拟或虚假加权，所有指标必须基于 Language Server 原生 IPC 接口与本地物理磁盘文件。
2. **会话级与全局级严格隔离 (Scope Isolation)**:
   - 4 宫格与活跃指标严格仅绑定当前活跃会话，全局汇总指标独立分区，杜绝数据口径混淆。
3. **零回退与全量硬断言门禁 (Zero Regression Gate)**:
   - 每次代码修改必须通过 `test_regression.js` 的 8 项硬断言测试，严禁修复 A 功能时隐式破坏 B 功能。
4. **交付规范**:
   - 任务完成后按标准格式汇报：【功能/UI 改动】➔【回归断言测试结果】➔【同步更新 memory.md 看板】。
