# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.17-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-为什么选择-private-cockpit隐私安全宣言)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-为什么选择-private-cockpit隐私安全宣言)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **专为 Antigravity IDE / VS Code 打造的 100% 纯本地离线 AI 配额与 Token 流速监控驾驶舱。**  
> 零外部网络请求、零数据遥测上报、零 Token 泄露风险。直接与本地 Antigravity Language Server 守护进程直连，具备 **0ms 极速冷启动对齐**能力。

[🌐 **Switch to English Documentation (README.md)**](README.md)

---

## 🔒 为什么选择 Private Cockpit？（隐私安全宣言）

| 安全与技术维度 | 传统第三方插件 | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **网络请求** | 调用外部未知服务器/代理 API | 🚫 **0 外部网络请求（100% 本地环回 `127.0.0.1` 直连）** |
| **数据埋点与遥测** | 内置 Google/Mixpanel 统计代码 | 🚫 **0 遥测上报、0 行为追踪、0 任何日志上传** |
| **Token 凭据安全** | 可能存在中转或泄露风险 | 🔒 **CSRF Token 仅驻留本地运行内存，绝不外发** |
| **冷启动性能** | 每次频繁拉起后台扫描进程 | ⚡ **持久化端口与凭据缓存，0ms 极速秒级直出** |
| **开源透明度** | 闭源打包或代码混淆 | 📖 **100% 开源透明 (MIT License)，每一行代码皆可审计** |

---

## ✨ 核心特性

1. **📊 双模型双周期对称状态栏**：
   - **Google Gemini 原生系列**：并列呈现每周剩余额度（`96%`）与 5 小时冲刺额度（`86%`）；
   - **Anthropic Claude & GPT 系列**：并列呈现每周剩余额度（`84%`）与 5 小时冲刺额度（`54%`）；
   - **精细微距排版**：模型名称与百分比数字紧凑贴合，消除疏离感。

2. **⚡ 实时 Token 生成速率指示器 (TPS)**：
   - 动态捕获并计算最近一轮对话的 **Token 生成速率（`⚡ 68.4 t/s`）** 与产出规模；
   - 专属**电光青蓝高亮（`#38bdf8`）**，实时感受算力流动。

3. **🎨 仅百分比数字专属动态变色告警**：
   - 模型名称与标签始终跟随 IDE 原生主题色；
   - 4 个百分比数字各自独立计算健康状态色：
     - 🟢 **充沛状态 (>50%)**：活力翠绿 (`#3fb950`)
     - 🟡 **预警状态 (<50%)**：暖调橙黄 (`#e3b341`)
     - 🔴 **极危状态 (<20%)**：醒目深红 (`#ff6b6b`)

4. **🖥️ 官方品牌精调可视化大屏驾驶舱**：
   - 原生支持深色/浅色模式自适应，内置 Google Gemini 渐变与 Anthropic 矢量徽标；
   - 支持中英文一键全局即时切换（`中 / EN`）。

5. **⚡ 0ms 无缝冷启动与真实数据对齐**：
   - 自动持久化本地端口与安全凭据，IDE 启动瞬间毫秒级对齐，拒绝虚假占位数据。

---

## 🚀 安装指南

### 方式 1：Open VSX 市场一键安装（推荐）
1. 在 Antigravity IDE / VS Code 中按 `Ctrl + Shift + X`（macOS: `Cmd + Shift + X`）打开扩展中心；
2. 搜索 **`Antigravity Private Cockpit`**（或 `antigravity-cockpit`）；
3. 点击 **安装 (Install)** 即可。

### 方式 2：GitHub Releases 离线安装
1. 前往 [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases) 下载最新的 `antigravity-cockpit-1.0.17.vsix`；
2. 在 IDE 中按 `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）➔ 输入并选择 `扩展: 从 VSIX 安装...`（`Extensions: Install from VSIX...`）➔ 选择下载好的 `.vsix` 文件。

---

## ⌨️ 常用命令

按 `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）打开命令面板，输入 **`Antigravity Private Cockpit`** 即可执行：

| 命令 | 功能描述 |
| :--- | :--- |
| `Antigravity Private Cockpit: Open Quota Dashboard` | 打开完整可视化配额与流速驾驶舱 (深浅主题自适应) |
| `Antigravity Private Cockpit: Quick Quota Overview` | 弹出快速配额与流速总览菜单 (QuickPick 极简视图) |
| `Antigravity Private Cockpit: Refresh Quota` | 立即从本地 Language Server 强制刷新最新实时额度 |
| `Antigravity Private Cockpit: Toggle Language (中/EN)` | 一键全局切换中英双语显示 (即时生效) |
| `Antigravity Private Cockpit: Open Settings` | 打开插件专属设置面板 (自定义预警阈值与流速显示) |

---

## ⚙️ 自定义配置项

支持通过以下 3 种方式打开插件设置：
1. **方式 1（最便捷）**：在驾驶舱大屏顶部直接点击 **`⚙️ 设置`** 按钮；
2. **方式 2**：按 `Ctrl + Shift + P` 输入并执行 **`Antigravity Private Cockpit: Open Settings`**；
3. **方式 3**：在扩展管理列表（`Ctrl + Shift + X`）中找到 **`Antigravity Private Cockpit`**，点击齿轮图标 ➔ **`扩展设置 (Extension Settings)`**。

| 配置项 | 类型 | 默认值 | 说明 |
| :--- | :---: | :---: | :--- |
| `agPrivateCockpit.refreshIntervalSeconds` | `number` | `15` | 自动刷新频率（秒，最低 `5` 秒） |
| `agPrivateCockpit.compactStatusBar` | `boolean` | `false` | 开启紧凑模式以节省状态栏空间（`✨G:96%(86%) 🤖C:84%(54%) ⚡68t/s`） |
| `agPrivateCockpit.warningThreshold` | `number` | `50` | 橙色告警触发阈值（%） |
| `agPrivateCockpit.criticalThreshold` | `number` | `20` | 红色极危告警触发阈值（%） |
| `agPrivateCockpit.defaultLanguage` | `string` | `"auto"` | 默认语言偏好（`auto` 跟随系统 / `zh` 中文 / `en` 英文） |
| `agPrivateCockpit.showGemini` | `boolean` | `true` | 是否在状态栏显示 Gemini 配额 |
| `agPrivateCockpit.showClaude` | `boolean` | `true` | 是否在状态栏显示 Claude/GPT 配额 |
| `agPrivateCockpit.showTokenSpeed` | `boolean` | `true` | 是否在状态栏显示最近一轮 Token 生成速率（`⚡ t/s`） |

---

## 📄 开源许可证

MIT License © 2026 [DF-Guan](https://github.com/DF-Guan). 100% 免费、安全、纯本地开源。
