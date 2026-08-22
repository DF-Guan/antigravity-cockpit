# 🛸 Antigravity Private Cockpit
### 🔒 100% Offline & Zero-Telemetry AI Quota Monitor for Antigravity IDE

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.4-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
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

### 2. 📊 Smart 3-Tier Status Bar Monitor
Always visible in your status bar with intelligent color alerts:
- 🟢 **Healthy (>50%)**: Quiet, clean monitor
- 🟡 **Warning (<50%)**: Orange warning indicator
- 🔴 **Critical (<20%)**: High-contrast red alert

### 3. 🎨 Brand-Accurate Visual Cockpit Dashboard
- **Vector Brand Visuals**: Official Google Gemini aurora star and Anthropic Claude sunburst SVG icons.
- **Fluid Layout**: Seamlessly transitions from narrow sidebars (280px) to ultra-wide 4K displays.
- **Theme Adaptive**: Uses native VS Code CSS variables (`var(--vscode-*)`) to match Dark, Light, and High-Contrast themes.
- **Bilingual i18n**: One-click instant toggle between 🌐 English and 中文 across all views.

---

## 🚀 Installation

### Option 1: Install from Open VSX Marketplace (Recommended)
1. In Antigravity IDE / VS Code, open Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **`Antigravity Cockpit`**.
3. Click **Install**.

### Option 2: Install from VSIX (Offline Package)
1. Download the latest `antigravity-cockpit-x.x.x.vsix` from [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases).
2. Press `Ctrl+Shift+P` ➔ `Extensions: Install from VSIX...` ➔ Select the downloaded file.

---

## 🛠️ Commands

| Command | Action |
|:---|:---|
| `Antigravity Cockpit: Open Quota Dashboard` | Opens the full visual cockpit |
| `Antigravity Cockpit: Quick Quota Overview` | Shows quick summary in command palette |
| `Antigravity Cockpit: Refresh Quota` | Force-syncs live quota from local Language Server |
| `Antigravity Cockpit: Toggle Language (中/EN)` | Toggles display language globally |
| `Antigravity Cockpit: Open Settings` | Opens extension configuration |

---

## ⚙️ Configuration

You can open the extension configuration panel via any of the following ways:
1. **Option 1 (Recommended)**: Click the **`⚙️ Settings`** button directly at the top of the Cockpit Dashboard;
2. **Option 2**: Press `Ctrl + Shift + P` (or `Cmd + Shift + P`) and execute **`Antigravity Cockpit: Open Settings`**;
3. **Option 3**: In Extensions view (`Ctrl + Shift + X`), click the gear icon on Antigravity Cockpit ➔ **`Extension Settings`**.

### Available Configuration Options:

- `agPrivateCockpit.refreshIntervalSeconds`: Auto-refresh interval in seconds (default: `15`).
- `agPrivateCockpit.compactStatusBar`: Compact status bar mode with abbreviated names (default: `false`).
- `agPrivateCockpit.warningThreshold`: Quota % for orange warning alert (default: `50`).
- `agPrivateCockpit.criticalThreshold`: Quota % for red critical alert (default: `20`).
- `agPrivateCockpit.defaultLanguage`: Language preference (`auto` / `en` / `zh`).
- `agPrivateCockpit.showGemini`: Toggle Gemini quota visibility on status bar (default: true).
- `agPrivateCockpit.showClaude`: Toggle Claude/GPT quota visibility on status bar (default: true).

---

## 📄 License

MIT License © 2026 [DF-Guan](https://github.com/DF-Guan)
