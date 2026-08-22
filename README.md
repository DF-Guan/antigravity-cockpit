# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.42-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-core-product-value-why-choose-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-core-product-value-why-choose-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-core-product-value-why-choose-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Local & Offline AI Quota, Token Analytics & Real-Time Velocity Monitor built for developers.**  
> Zero external network requests, zero telemetry tracking, zero credential leakage, and 100% ad-free. Directly probes local Antigravity Language Server with **0ms cold start** and **sub-second speed detection**.

[🌐 **切换至中文说明文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Showcase & Previews

### 📍 1. Native Bottom Status Bar Monitoring (Zero-Gap Integration)
> Official Brand Vector Icons · Decoupled Dynamic Digit Alert Coloring · Real-time Stream Velocity · Ultra-Compact
![Native Status Bar Monitoring](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_en.png)

### 🛸 2. Interactive Quota & Multi-Dimensional Token Cockpit
| 🛸 Full Visual Quota & Session Analytics Dashboard | 📍 Rich Native Markdown Status Bar Tooltip |
| :---: | :---: |
| ![Dashboard Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png) | ![Status Bar Tooltip](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_en.png) |

---

## 💎 Core Product Value (Why Choose Private Cockpit?)

### 1. 🔒 100% Local & Offline Privacy (Zero Egress · Zero Leakage · Zero Telemetry)
* **0 External Network Calls**: Strictly communicates via local loopback (`127.0.0.1`) directly with the internal language server daemon;
* **Zero Telemetry / Tracking**: No analytics SDKs, no behavioral tracking, no remote logging—complete privacy sandbox;
* **Memory-Resident Credentials**: CSRF tokens reside only in local volatile runtime memory.

### 2. ⚡ Native Language Server Sync (0ms Cold Startup · Sub-Millisecond IPC)
* **Dynamic Wide-Port Probing**: Auto-discovers active Language Server ports and tokens dynamically;
* **0ms Cold Boot**: Instant state hydration renders quota upon IDE launch without lagging or white screens;
* **Factual Status**: Clean differentiation between `Full (100% Ready)` and calculated recovery cooldowns.

### 3. 📊 Deep Multi-Dimensional Session Token Analytics & Exact Precision
* **Comprehensive Metrics**: Tracks **Input Tokens, Prefix Cache Reads, Output Tokens, Interaction Turns, and Total Volume**;
* **🔢 1-Click Exact Precision Toggle**: Seamlessly toggle between compact format (`37.4M`) and exact integer counts (`37,470,392`);
* **Cache Ratio Insight**: Explicitly monitors prefix cache hits (`98%+`) to assess prompt reuse efficiency.

### 4. 🚀 SQLite-WAL Sub-Second Velocity Engine
* **Universal Sensitivity**: Listens directly to conversation transaction logs across conversations, long generations, and tool dispatches;
* **Real-time Velocity**: Displays live generation speed (`78.4 t/s`) while streaming and returns to idle zero with peak memory.

### 5. 🎯 Pure Utility & Developer Experience
* **✨ Official Brand Vector Icons**: Built-in vector icons for Google Gemini and Anthropic Claude;
* **🎨 Decoupled Digit Coloring**: Neutral brand icons with independent 3-tier safety coloring (Green / Amber / Red) on digits;
* **Dual-View Modes**: Full visual Webview cockpit and lightweight QuickPick palette;
* **Full Bilingual Support**: Instant seamless toggle between English and Chinese across all UI elements.

---

## 🛠️ Configuration Settings

Customize via VS Code / Antigravity IDE Settings (`@ext:DF-Guan.antigravity-cockpit`):

| Setting | Default | Description |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | Show Google Gemini quota slot in the status bar |
| `agPrivateCockpit.showClaude` | `true` | Show Anthropic Claude & GPT quota slot in the status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Show real-time token response velocity (`t/s`) |
| `agPrivateCockpit.compactStatusBar` | `false` | Compact mode (show icon & weekly quota only) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Background probing interval in seconds (min 5s) |
| `agPrivateCockpit.warningThreshold` | `50` | Yellow warning percentage threshold (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Red critical percentage threshold (%) |
| `agPrivateCockpit.defaultLanguage` | `"auto"` | UI language preference (`"auto"`, `"zh"`, `"en"`) |

---

## 📄 License

Distributed under the [MIT License](LICENSE).
