# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.17-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Local & Offline AI Quota & Velocity Monitor for Antigravity IDE / VS Code.**  
> Zero external network requests, zero telemetry, zero token leakage. Directly reads from the local Antigravity Language Server daemon with **0ms instant cached startup**.

[🇨🇳 **查看中文完整说明文档 (README_zh.md)**](README_zh.md)

---

## 🔒 Why Private Cockpit? (Security & Privacy Manifesto)

| Dimension | Typical 3rd-Party Quota Tools | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **Network Requests** | Calls external cloud APIs | 🚫 **0 External Network Calls (100% Loopback `127.0.0.1`)** |
| **Telemetry & Tracking** | Embedded Google/Mixpanel trackers | 🚫 **0 Telemetry, 0 Analytics, 0 Logs Uploaded** |
| **Token Security** | May proxy or forward CSRF tokens | 🔒 **CSRF Token stays exclusively in local memory** |
| **Startup Speed** | Laggy background process spawn | ⚡ **0ms Instant Boot via Loopback Port Persistence** |
| **Open Source** | Closed source or obfuscated code | 📖 **100% Open Source MIT Licensed Clean Code** |

---

## ✨ Key Features

1. **📊 Symmetrical Dual-Model & Dual-Period Status Bar**:
   - **Google Gemini**: Displays Weekly Limit (`96%`) and 5-Hour Sprint Limit (`86%`).
   - **Anthropic Claude & GPT**: Displays Weekly Limit (`84%`) and 5-Hour Sprint Limit (`54%`).
   - **Tightened Svelte Layout**: Micro-spaced alignment without visual separation.

2. **⚡ Real-Time Token Generation Velocity (TPS)**:
   - Live stream tracking calculating **Tokens / Second (`⚡ 68.4 t/s`)** and output volume from recent conversation turns.
   - Distinctive **Electric Cyan (`#38bdf8`)** dynamic highlight.

3. **🎨 Digit-Only Dynamic Alert Coloring**:
   - Model labels retain your native IDE theme color.
   - Percentage numbers independently calculate dynamic health colors:
     - 🟢 **Optimal (>50%)**: Vibrant Mint (`#3fb950`)
     - 🟡 **Warning (<50%)**: Warm Amber (`#e3b341`)
     - 🔴 **Critical (<20%)**: Crimson Red (`#ff6b6b`)

4. **🖥️ Brand-Accurate Bilingual Cockpit Dashboard**:
   - Beautiful visual webview with official Google Gemini (blue gradient) and Anthropic Claude (warm amber) vector graphics.
   - Seamless one-click global language toggle between English and Chinese (`中 / EN`).

5. **⚡ Zero-Lag Instant Cold-Boot**:
   - Automatically caches active local loopback port and token for instant `10ms` response upon IDE startup.

---

## 🚀 Installation

### Option 1: Install from Open VSX Marketplace (Recommended)
1. In Antigravity IDE / VS Code, open Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **`Antigravity Private Cockpit`** (or `antigravity-cockpit`).
3. Click **Install**.

### Option 2: Install from VSIX (Offline Package)
1. Download the latest `antigravity-cockpit-1.0.17.vsix` from [GitHub Releases](https://github.com/DF-Guan/antigravity-cockpit/releases).
2. Press `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`) ➔ Type and select `Extensions: Install from VSIX...` ➔ Choose the downloaded `.vsix` file.

---

## ⌨️ Commands

Press `Ctrl+Shift+P` (or `Cmd+Shift+P`) to run:

| Command | Description |
| :--- | :--- |
| `Antigravity Private Cockpit: Open Quota Dashboard` | Opens full visual quota & velocity cockpit |
| `Antigravity Private Cockpit: Quick Quota Overview` | Opens lightweight quick-pick summary menu |
| `Antigravity Private Cockpit: Refresh Quota` | Force-syncs latest live quota from local Language Server |
| `Antigravity Private Cockpit: Toggle Language (中/EN)` | Globally toggles display language (ZH / EN) |
| `Antigravity Private Cockpit: Open Settings` | Opens extension configuration panel |

---

## ⚙️ Extension Settings

Access settings via:
1. Click the **`⚙️ Settings`** button at the top of the Cockpit Dashboard;
2. Press `Ctrl + Shift + P` and execute **`Antigravity Private Cockpit: Open Settings`**;
3. In Extensions view (`Ctrl + Shift + X`), click the gear icon on **Antigravity Private Cockpit** ➔ **Extension Settings**.

| Configuration Key | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `agPrivateCockpit.refreshIntervalSeconds` | `number` | `15` | Auto-refresh interval in seconds (minimum: `5`). |
| `agPrivateCockpit.compactStatusBar` | `boolean` | `false` | Compact status bar mode (`✨G:96%(86%) 🤖C:84%(54%) ⚡68t/s`). |
| `agPrivateCockpit.warningThreshold` | `number` | `50` | Quota percentage triggering orange warning alert. |
| `agPrivateCockpit.criticalThreshold` | `number` | `20` | Quota percentage triggering red critical alert. |
| `agPrivateCockpit.defaultLanguage` | `string` | `"auto"` | Display language preference (`auto` / `zh` / `en`). |
| `agPrivateCockpit.showGemini` | `boolean` | `true` | Show/hide Google Gemini quota in status bar. |
| `agPrivateCockpit.showClaude` | `boolean` | `true` | Show/hide Anthropic Claude/GPT quota in status bar. |
| `agPrivateCockpit.showTokenSpeed` | `boolean` | `true` | Show/hide recent conversation Token Speed (`t/s`) in status bar. |

---

## 📄 License

MIT License © 2026 [DF-Guan](https://github.com/DF-Guan). 100% Free and Open Source.
