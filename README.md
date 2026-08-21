# Antigravity Cockpit – AI Quota Monitor 🛸

> **A real-time, privacy-first AI quota cockpit for Antigravity IDE.**  
> Monitor your Google Gemini & Anthropic Claude / GPT weekly and 5-hour quota limits directly in your status bar and visual dashboard.

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.1-blue.svg)](https://open-vsx.org/extension/defu/antigravity-cockpit)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-success.svg)](#privacy--security)

---

## ✨ Features (功能特性)

- ⚡ **100% Local Real-Time Detection (原生实时同频)**  
  Automatically probes the local IDE Language Server daemon in real-time. Zero manual copying required.
- 🔒 **Zero Telemetry & 100% Offline (纯本地离线隐私)**  
  All communications stay strictly within `localhost` (127.0.0.1). Zero telemetry, zero external network requests.
- 📊 **Always-Visible Status Bar (常驻状态栏监控)**  
  Shows Gemini & Claude weekly and 5-hour quota remaining percentages at a glance.
- 🎨 **Theme-Adaptive Visual Dashboard (可视化双语驾驶舱)**  
  Fluid-responsive Webview cockpit with official Google Gemini and Anthropic vector icons that dynamically match your IDE theme.
- 🌐 **Bilingual i18n (中英双语无感切换)**  
  Seamlessly switches between English and Chinese (中文) with one click.
- 🚨 **3-Tier Smart Alert (智能阶梯告警)**  
  Visual alert coloring: Green (>50%) ➔ Orange warning (<50%) ➔ Red critical (<20%). Customizable in settings.

---

## 🚀 Installation (安装方法)

### Option 1: Install from Open VSX Marketplace (推荐)
1. In Antigravity IDE / VS Code, open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **`Antigravity Cockpit`**.
3. Click **Install**.

### Option 2: Install from VSIX (离线安装)
1. Download the latest `antigravity-cockpit-x.x.x.vsix` from [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases).
2. In IDE, press `Ctrl+Shift+P` ➔ `Extensions: Install from VSIX...` ➔ Select the downloaded file.

---

## 🛠️ Usage (使用说明)

| Command | Action |
|:---|:---|
| **Click Status Bar Item** | Opens the visual quota dashboard |
| `Antigravity Cockpit: Open Quota Dashboard` | Opens the full-screen visual cockpit |
| `Antigravity Cockpit: Quick Quota Overview` | Shows quick summary in command palette |
| `Antigravity Cockpit: Refresh Quota` | Force-syncs real-time quota from local language server |
| `Antigravity Cockpit: Toggle Language (中/EN)` | Toggles display language globally |
| `Antigravity Cockpit: Open Settings` | Configures thresholds, intervals, and display modes |

---

## ⚙️ Configuration (可配置项)

Customize in **Settings** ➔ Search `Antigravity Cockpit`:

- `agPrivateCockpit.refreshIntervalSeconds`: Auto-refresh polling interval in seconds (default: `15`).
- `agPrivateCockpit.compactStatusBar`: Enable compact mode to abbreviate model names (default: `false`).
- `agPrivateCockpit.warningThreshold`: Quota percentage for orange warning alert (default: `50`).
- `agPrivateCockpit.criticalThreshold`: Quota percentage for red critical alert (default: `20`).
- `agPrivateCockpit.defaultLanguage`: Default language (`auto` / `zh` / `en`).
- `agPrivateCockpit.showGemini`: Toggle Gemini quota visibility on status bar (default: `true`).
- `agPrivateCockpit.showClaude`: Toggle Claude/GPT quota visibility on status bar (default: `true`).

---

## 🔒 Privacy & Security (隐私与安全)

- **100% Offline**: Never contacts any third-party server or analytics service.
- **Zero Credentials**: Never stores or transmits API keys, passwords, or tokens.
- **Local-Only**: Only communicates with the local language server process via loopback `127.0.0.1`.

---

## 📄 License

MIT License © 2026 [DF-Guan](https://github.com/DF-Guan)
