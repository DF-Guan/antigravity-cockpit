# 🛸 Antigravity Private Cockpit
### 🔒 纯本地零泄露 · AI 配额实时驾驶舱 (Zero-Telemetry AI Quota Monitor)

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.13-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-为什么选择-private-cockpit-隐私安全宣言)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-为什么选择-private-cockpit-隐私安全宣言)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🌐 **语言选择**: [English (英文)](README.md) | **简体中文**

> **专为注重隐私与数据安全的 Antigravity IDE 开发者打造。**  
> 实时监控 **Google Gemini** 与 **Anthropic Claude / GPT** 每周与 5 小时额度，**绝不外传任何字节数据，100% 本地闭环运行。**

---

## 🔒 为什么选择 Private Cockpit？（隐私安全宣言）

很多第三方插件会私自上传遥测数据、调用外部服务器甚至拦截 OAuth Token，存在不可预知的安全隐患。**本插件从架构第一天起，就确立了【零泄露、纯本地】的设计准则：**

| 安全与技术维度 | 传统第三方插件 | 🛸 Antigravity Private Cockpit |
|:---|:---:|:---:|
| 🌐 **外部网络请求** | ⚠️ 频繁外联三方服务器 / 收集用户遥测 | ✅ **0 外部网络请求（100% 本地 127.0.0.1 闭环）** |
| 🔑 **账号与凭证安全** | ⚠️ 容易截获并明文缓存 OAuth Token | ✅ **0 凭证存储，完全沙盒隔离，绝不触碰秘钥** |
| ⚡ **数据同步机制** | ❌ 易失效，经常报 No models available | ✅ **原生本地进程无损通信（Local IPC/RPC）** |
| 🪶 **运行体积与依赖** | ⚠️ 打包几百个 npm 依赖，占用大量内存 | ✅ **仅 56 KB 超轻量 · 0 第三方依赖 · 秒速启动** |
| 🎨 **UI 质感与国际化** | ❌ 界面简陋粗糙 / 仅支持单一语言 | ✅ **Google & Anthropic 官方品牌矢量视觉 + 中英一键秒切** |

---

## ✨ 核心亮点功能

### 1. ⚡ 原生进程实时同频 (无需手动复制粘贴)
通过本地回环端口（Loopback IPC）自动同频 Antigravity IDE 核心进程，毫秒级响应额度变化，精准呈现剩余百分比与重置倒计时。

### 2. 📊 仅百分比数字独立动态着色 (Digit-Only Alert Coloring)
模型名称等文字完全保留原生主题色，只有百分比数字本身根据各自额度独立变色：
- 🟢 **健康状态 (>50%)**：百分比数字呈活力翠绿 (`#3fb950`)
- 🟡 **预警状态 (<50%)**：百分比数字单独变为警示橙黄 (`#e3b341`)
- 🔴 **极危状态 (<20%)**：百分比数字单独变为极危绯红 (`#ff6b6b`)

### 3. 🎨 官方品牌矢量双语驾驶舱
- **品牌级视觉**：内置 Google Gemini 极光星芒与 Anthropic 破晓星徽官方矢量 SVG；
- **原生主题自适应**：完美适配 Dark / Light / High-Contrast 主题；
- **全动态自适应流**：无论是窄至 280px 的侧边栏还是 4K 带宽屏，排版均丝滑自适应；
- **中英双语无感切换**：支持一键在 🌐 中文 / English 之间全局热切换。

---

## 🚀 安装指南

### 方式 1：Open VSX 市场一键安装（推荐）
1. 在 Antigravity IDE / VS Code 中按 `Ctrl + Shift + X` 打开插件中心；
2. 搜索 **`Antigravity Private Cockpit`**（或 `antigravity-cockpit`）；
3. 点击 **安装（Install）** 即可。

### 方式 2：GitHub Releases 离线安装
1. 前往 [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases) 下载最新的 `antigravity-cockpit-x.x.x.vsix`；
2. 在 IDE 中按 `Ctrl + Shift + P` ➔ 输入并选择 `从 VSIX 安装...` ➔ 选择下载好的文件。

---

## 🛠️ 快捷指令与常用操作 (Commands)

按 `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）打开命令面板，输入 **`Antigravity Private Cockpit`** 即可执行：

| 命令面板输入名称 (Command Palette) | 快捷操作 / 功能说明 |
|:---|:---|
| **点击状态栏文字** | 直接打开可视化大屏配额驾驶舱 |
| `Antigravity Private Cockpit: Open Quota Dashboard` | 打开完整可视化配额驾驶舱 (支持深色/浅色自适应) |
| `Antigravity Private Cockpit: Quick Quota Overview` | 弹出快速配额总览菜单 (QuickPick 极简视图) |
| `Antigravity Private Cockpit: Refresh Quota` | 立即从本地 Language Server 强制刷新最新实时额度 |
| `Antigravity Private Cockpit: Toggle Language (中/EN)` | 一键全局切换中英双语显示 (即时生效) |
| `Antigravity Private Cockpit: Open Settings` | 打开插件专属设置面板 (自定义预警阈值与刷新率) |

---

## ⚙️ 自由定制设置 (Settings)

可通过以下任意方式进入插件专属配置面板：
1. **方式 1（最推荐）**：在配额驾驶舱仪表盘顶部，直接点击 **`⚙️ 设置`** 按钮；
2. **方式 2**：按 `Ctrl + Shift + P` 输入并执行 **`Antigravity Private Cockpit: Open Settings`**；
3. **方式 3**：在扩展管理列表（`Ctrl + Shift + X`）中找到本插件，点击齿轮图标 ➔ **`扩展设置 (Extension Settings)`**。

### 支持调整的配置项：

- `agPrivateCockpit.refreshIntervalSeconds`: 自动刷新频率（默认: `15` 秒，最低 `5` 秒）
- `agPrivateCockpit.compactStatusBar`: 开启紧凑模式以节省状态栏空间（默认: `关闭`）
- `agPrivateCockpit.warningThreshold`: 橙色告警触发阈值（默认: `50%`）
- `agPrivateCockpit.criticalThreshold`: 红色极危告警触发阈值（默认: `20%`）
- `agPrivateCockpit.defaultLanguage`: 默认语言偏好（`auto` 自动跟随系统 / `zh` 中文 / `en` 英文）
- `agPrivateCockpit.showGemini`: 是否在状态栏显示 Gemini 配额（默认: `开启`）
- `agPrivateCockpit.showClaude`: 是否在状态栏显示 Claude/GPT 配额（默认: `开启`）

---

## 🔒 隐私与安全保障

- **100% 本地离线**：绝不向任何外部服务器发送数据，0 遥测；
- **0 凭证存储**：绝不读取或存储任何用户 Token、密码或密钥；
- **回环端口通信**：所有 IPC 请求严格限制在 `127.0.0.1` 闭环。

---

## 📄 开源协议

本项目遵循 [MIT License](LICENSE) 开源协议。

Copyright (c) 2026 [DF-Guan](https://github.com/DF-Guan)
