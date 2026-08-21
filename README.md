# 🛸 Antigravity Private Cockpit
### 🔒 纯本地零泄露 · AI 配额实时驾驶舱 (Zero-Telemetry AI Quota Monitor)

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.3-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-为什么选择-private-cockpit-隐私安全宣言)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-为什么选择-private-cockpit-隐私安全宣言)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## ✨ 核心亮点功能 (Key Features)

### 1. ⚡ 原生进程实时同频 (100% Local Real-Time Detection)
通过本地回环端口（Loopback IPC）自动同频 Antigravity IDE 核心进程，毫秒级响应额度变化，**无需手动复制粘贴**，精准呈现剩余百分比与重置倒计时。

### 2. 📊 常驻状态栏智能监控 (Smart Status Bar Monitor)
状态栏清晰显示各大模型当前额度，内置 **3 阶智能预警色谱**：
- 🟢 **健康状态 (>50%)**：常驻静默展示
- 🟡 **注意状态 (<50%)**：状态栏橙色提醒
- 🔴 **极危状态 (<20%)**：状态栏高亮警报

### 3. 🎨 官方品牌矢量双语驾驶舱 (Visual Cockpit Dashboard)
- **品牌级视觉**：内置 Google Gemini 极光星芒与 Anthropic 破晓星徽官方矢量 SVG；
- **原生主题自适应**：完美适配 Dark / Light / High-Contrast 主题；
- **全动态自适应流**：无论是窄至 280px 的侧边栏还是 4K 带宽屏，排版均丝滑自适应；
- **中英双语无感切换**：支持一键在 🌐 中文 / English 之间全局热切换。

---

## 🚀 安装指南 (Installation)

### 方式 1：Open VSX 市场一键安装（推荐）
1. 在 Antigravity IDE / VS Code 中按 `Ctrl + Shift + X` 打开插件中心；
2. 搜索 **`Antigravity Cockpit`**；
3. 点击 **安装（Install）** 即可。

### 方式 2：GitHub Releases 离线安装
1. 前往 [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases) 下载最新的 `antigravity-cockpit-x.x.x.vsix`；
2. 在 IDE 中按 `Ctrl + Shift + P` ➔ 输入并选择 `从 VSIX 安装...` ➔ 选择下载好的文件。

---

## ⚙️ 自由定制设置 (Custom Configuration)

在 IDE 设置中搜索 **`Antigravity Cockpit`** 即可个性化调整：

- `agPrivateCockpit.refreshIntervalSeconds`: 自动刷新频率（默认: `15` 秒）
- `agPrivateCockpit.compactStatusBar`: 开启紧凑模式以节省状态栏空间（默认: `关闭`）
- `agPrivateCockpit.warningThreshold`: 橙色告警触发阈值（默认: `50%`）
- `agPrivateCockpit.criticalThreshold`: 红色极危告警触发阈值（默认: `20%`）
- `agPrivateCockpit.defaultLanguage`: 默认语言偏好（`auto` 自动跟随系统 / `zh` 中文 / `en` 英文）
- `agPrivateCockpit.showGemini`: 是否在状态栏显示 Gemini 配额
- `agPrivateCockpit.showClaude`: 是否在状态栏显示 Claude/GPT 配额

---

## 🛡️ 开源协议 (License)

本项目遵循 [MIT License](LICENSE) 开源协议。代码 100% 开源透明，欢迎代码审计与 Star ⭐️ 支持！

Copyright (c) 2026 [DF-Guan](https://github.com/DF-Guan)
