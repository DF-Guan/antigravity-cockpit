# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.34-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-core-product-advantages-why-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-core-product-advantages-why-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-core-product-advantages-why-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Local & Offline AI Quota, Multi-Dimensional Token Analytics & Live Velocity Monitor for Antigravity IDE / VS Code.**  
> Zero external network requests, zero telemetry, zero token leakage, 100% ad-free. Directly connects to the local Antigravity Language Server daemon with **0ms instant cached startup** and **sub-second streaming velocity detection**.

[🇨🇳 **查看中文完整说明文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

| Visual Quota & Token Dashboard | Status Bar Compact Layout & Rich Tooltip |
| :---: | :---: |
| ![Cockpit Dashboard](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png) | ![Status Bar & Tooltip](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_en.png) |

---

## 💎 Core Product Advantages (Why Private Cockpit?)

### 1. 🔒 100% Local & Privacy-First (Zero Outbound · Zero Telemetry)
* **0 External Requests**: Strictly communicates via local loopback (`127.0.0.1`). Never sends requests or telemetry to external servers or third-party proxies.
* **0 Telemetry / Analytics**: No tracking SDKs, analytics beacons, or remote logs. Absolute closed-loop security.
* **In-Memory Credentials**: Tokens remain strictly in local volatile runtime memory.

### 2. ⚡ Native Daemon Live Sync (0ms Instant Startup)
* **Wide-Range Port Sniffing**: Automatically discovers dynamic Language Server communication ports in milliseconds.
* **0ms Cached Startup**: Displays latest quota instantly upon IDE launch using localized cached snapshots without freezing or blank screens.
* **Accurate Status Display**: Clearly indicates `Full (100% Ready)` when untouched, and computes precise countdowns when consuming.

### 3. 📊 Deep Multi-Dimensional Session Token Analytics
* **Comprehensive Metrics**: Live tracking of active session **Input Tokens, Prefix Cache Reads, Output Tokens, Interaction Turns, and Total Volume**.
* **Prefix Cache Insight**: Highlights cache hit ratio (`98%+`) to give developers direct visibility into context reuse efficiency.

### 4. 🚀 SQLite-WAL Sub-Second Velocity Sensing Engine
* **Full-Turn Sensitivity**: Directly monitors local session transaction logs across short chats, code generation, and tool invocations.
* **Dynamic Stream Metering**: Jumps dynamically to live generation speed (`70 ~ 95 t/s`) during responses, smoothly resting at idle (`0 t/s`).

### 5. 🎯 Pure Utility, Ad-Free & Distraction-Free Usability
* **100% Ad-Free Utility**: Zero ads, zero paywalls, zero popups. Pure focus on developer productivity.
* **Multi-Tier Quota Alerts**: Progress bars and status bar values dynamically change colors across safety tiers (Safe / Amber Warning / Critical Red).
* **Zero-Flicker Persistence**: Preserves Webview DOM state and scroll position across editor tab switches.
* **Zero-Overflow Adaptive Layout**: Fluid responsive scaling from `280px` sidebars to `4K` widescreen displays.
* **One-Click Bilingual Toggle**: Switch seamlessly between English and Simplified Chinese anytime.

---

## 🔒 Security & Architecture Comparison

| Dimension | Typical 3rd-Party Quota Tools | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **Network Architecture** | Calls external unknown proxy/collector APIs | 🚫 **0 External Requests (100% Local `127.0.0.1` Loopback)** |
| **Telemetry & Tracking** | Built-in analytics / tracking libraries | 🚫 **0 Telemetry, 0 Tracking, 0 Remote Logging** |
| **Ads & Monetization** | Ad banners, donation nags, or external links | 🛡️ **Pure Developer Utility, 100% Ad-Free** |
| **Cold Startup** | Freezes UI for 3~5s on launch | ⚡ **0ms Instant Startup (Immediate state cache)** |
| **Dual Quota Isolation** | Single or mixed buckets | ✨ **Gemini Flagship + 🎭 Claude/GPT Isolated Tracking** |

---

## ⚙️ Configuration

Search `agPrivateCockpit` in VS Code / Antigravity IDE Settings:

| Setting | Default | Description |
| :--- | :--- | :--- |
| `agPrivateCockpit.defaultLanguage` | `"auto"` | Default UI language (`"auto"`, `"zh"`, `"en"`) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Polling interval in seconds (minimum 5s) |
| `agPrivateCockpit.showGemini` | `true` | Show Google Gemini quota in status bar |
| `agPrivateCockpit.showClaude` | `true` | Show Claude & GPT quota in status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Show live token velocity in status bar |
| `agPrivateCockpit.compactStatusBar` | `false` | Enable ultra-compact status bar mode |
| `agPrivateCockpit.warningThreshold` | `50` | Warning yellow alert threshold (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Critical red alert threshold (%) |

---

## ⌨️ Commands

* `F1` ➔ `Antigravity: Open Private Quota Cockpit`
* `F1` ➔ `Antigravity: Quick Overview & Actions`
* `F1` ➔ `Antigravity: Force Refresh Quota Now`
* `F1` ➔ `Antigravity: Toggle Display Language (中/EN)`

---

## 📄 License

Distributed under the [MIT License](LICENSE).
