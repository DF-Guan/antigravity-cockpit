# 🛸 Antigravity Private Cockpit
### 🔒 100% Offline & Zero-Telemetry AI Quota Monitor for Antigravity IDE

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.16-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🌐 **Language**: **English** | [简体中文 (Chinese)](README_zh.md)

> **Built for developers who value privacy and data sovereignty.**  
> Real-time monitoring of **Google Gemini** and **Anthropic Claude / GPT** weekly and 5-hour quota limits. **100% offline execution with zero external network requests and zero credential harvesting.**

---

## 🔒 Why Private Cockpit? (Security & Privacy Manifesto)

Many third-party extensions send analytics, phone home to external servers, or intercept OAuth credentials. **Antigravity Private Cockpit is architected from day one with a strict Zero-Leak principle:**

| Dimension | Typical 3rd-Party Extensions | 🛸 Antigravity Private Cockpit |
|:---|:---:|:---:|
| 🌐 **External Network Calls** | ⚠️ Sends telemetry to remote servers | ✅ **ZERO external network calls (100% Local 127.0.0.1 loopback)** |
| 🔑 **Tokens & Credentials** | ⚠️ May intercept / plaintext cache tokens | ✅ **ZERO credential storage; strictly sandboxed** |
| ⚡ **Data Synchronization** | ❌ Prone to "No models available" errors | ✅ **Native Local IPC/RPC with IDE Language Server daemon** |
| 🪶 **Bundle Size & Footprint** | ⚠️ Bloated with hundreds of npm packages | ✅ **Only 56 KB · ZERO dependencies · Instant launch** |
| 🎨 **UI Quality & Branding** | ❌ Clunky UI / Hardcoded styles | ✅ **Google & Anthropic official SVG graphics + fluid responsive theme** |

---

## ✨ Key Features

### 1. ⚡ Native IPC Real-Time Sync (No Copy-Pasting Required)
Directly probes the running Antigravity Language Server daemon via local loopback IPC (`127.0.0.1`). Real-time millisecond-level quota changes, remaining percentages, and countdown timers are synchronized automatically.

### 2. 📊 Digit-Only Dynamic Alert Coloring
Percentage digits dynamically reflect individual model health without altering label text colors:
- 🟢 **Healthy (>50%)**: Digits glow vibrant green (`#3fb950`)
- 🟡 **Warning (<50%)**: Digits turn alert orange (`#e3b341`)
- 🔴 **Critical (<20%)**: Digits turn urgent red (`#ff6b6b`)

### 3. 🎨 Brand-Accurate Visual Cockpit Dashboard
- **Vector Brand Visuals**: Official Google Gemini aurora star and Anthropic Claude sunburst SVG icons.
- **Fluid Layout**: Seamlessly transitions from narrow sidebars (280px) to ultra-wide 4K displays.
- **Theme Adaptive**: Uses native VS Code CSS variables (`var(--vscode-*)`) to match Dark, Light, and High-Contrast themes.
- **Bilingual i18n**: One-click instant toggle between 🌐 English and 中文 across all views.

---

## 🚀 Installation

### Option 1: Install from Open VSX Marketplace (Recommended)
1. In Antigravity IDE / VS Code, open Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **`Antigravity Private Cockpit`** (or `antigravity-cockpit`).
3. Click **Install**.

### Option 2: Install from VSIX (Offline Package)
1. Download the latest `antigravity-cockpit-x.x.x.vsix` from [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases).
2. Press `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) ➔ Type and select `Extensions: Install from VSIX...` ➔ Choose the downloaded `.vsix` file.

---

## 🛠️ Commands

按 `Ctrl + Shift + P`（macOS: `Cmd + Shift + P`）打开命令面板输入：

| Command | Action |
|:---|:---|
| `Antigravity Private Cockpit: Open Quota Dashboard` | Opens the full visual cockpit dashboard |
| `Antigravity Private Cockpit: Quick Quota Overview` | Shows quick summary in command palette menu |
| `Antigravity Private Cockpit: Refresh Quota` | Force-syncs live quota from local Language Server |
| `Antigravity Private Cockpit: Toggle Language (中/EN)` | Toggles display language globally (ZH / EN) |
| `Antigravity Private Cockpit: Open Settings` | Opens extension configuration panel |

---

## ⚙️ Configuration

You can open the extension configuration panel via any of the following ways:
1. **Option 1 (Recommended)**: Click the **`⚙️ Settings`** button directly at the top of the Cockpit Dashboard;
2. **Option 2**: Press `Ctrl + Shift + P` (or `Cmd + Shift + P`) and execute **`Antigravity Private Cockpit: Open Settings`**;
3. **Option 3**: In Extensions view (`Ctrl + Shift + X`), click the gear icon on **Antigravity Private Cockpit** ➔ **`Extension Settings`**.

### Available Configuration Options:

- `agPrivateCockpit.refreshIntervalSeconds`: Auto-refresh interval in seconds (default: `15`, minimum: `5`).
- `agPrivateCockpit.compactStatusBar`: Compact status bar mode with abbreviated names (default: `false`).
- `agPrivateCockpit.warningThreshold`: Quota % for orange warning alert (default: `50`).
- `agPrivateCockpit.criticalThreshold`: Quota % for red critical alert (default: `20`).
- `agPrivateCockpit.defaultLanguage`: Default display language (`auto` / `zh` / `en`).
- `agPrivateCockpit.showGemini`: Toggle Google Gemini quota visibility in the status bar (default: `true`).
- `agPrivateCockpit.showClaude`: Toggle Anthropic Claude/GPT quota visibility in the status bar (default: `true`).
- `agPrivateCockpit.showTokenSpeed`: Toggle recent conversation Token Speed (t/s) indicator in the status bar (default: `true`).

---

## 🔒 Privacy & Security Architecture

- **100% Offline**: Never contacts any third-party server or analytics service.
- **Zero Credentials**: Never stores, logs, or transmits API keys, passwords, or tokens.
- **Local-Only Loopback**: All IPC queries are strictly bound to `127.0.0.1`.

---

## 📄 License

MIT License © 2026 [DF-Guan](https://github.com/DF-Guan)
