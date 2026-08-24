# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.49-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-key-features--why-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-key-features--why-private-cockpit)
[![Factual Audit](https://img.shields.io/badge/Data%20Audit-100%25%20Physical%20Disk-blue.svg)](#-key-features--why-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-key-features--why-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Offline, Local-first AI Quota, Physical Token Audit & Live Velocity Cockpit for Antigravity IDE.**  
> Zero external network requests, zero telemetry, zero token leakage, zero synthetic weights, ad-free. Directly interacts with the local Antigravity Language Server daemon via **Netstat-PID exact port binding** and **sub-second streaming velocity detection**.

[🌐 **切换至中文文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

### 📍 1. Compact Status Bar Integration
> Official vector brand icons · Independent numeric alert coloring · Sub-second response · Zero redundant space
![Status Bar Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_en.png)

### 🛸 2. Interactive Quota & Factual Token Dashboard
| 🛸 Quota & Physical Token Dashboard | 📍 Status Bar & Hover Card |
| :---: | :---: |
| ![Dashboard Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png) | ![Status Bar & Tooltip](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_en.png) |

---

## 💎 Key Features & Why Private Cockpit?

### 1. 🔒 100% Local & Privacy Guaranteed (Zero Outbound · Zero Telemetry)
* **0 Outbound Requests**: Strictly loopback IPC communication (`127.0.0.1`). No data is sent to external servers or third-party proxies;
* **0 Telemetry & Tracking**: No analytics, telemetry probes, or remote logging. Total privacy sandbox;
* **Memory-Only Token**: CSRF tokens remain in local process memory only.

### 2. ⚡ Netstat-PID Port Engine (30ms Instant Handshake · 100% Sync)
* **PID-Accurate Port Mapping**: Directly extracts active `LISTENING` ports of the Language Server daemon using system network connection tables (`netstat -ano`);
* **Immune to Port Offsets**: Eliminates port-offset scan misses (handles offsets > +70 easily);
* **Persistent Endpoint Caching**: Caches verified endpoints for ultra-fast < 10ms subsequent polls.

### 3. 📁 100% Factual Physical Disk Audit (Zero Synthetic Data · Zero Mock)
* **Real Disk File Scan**: Strictly parses physical JSON message files and markdown artifacts in `~/.gemini/antigravity-ide/brain/`;
* **Zero Artificial Weights**: Displays only genuine historical days that physically exist on disk;
* **🔢 Full-Precision Toggle**: Switch between compact view (`37.4M`) and full integer mode (`37,470,392`) with one click;
* **Pure Engineering Metrics**: Pure factual telemetry without speculative financial estimations.

### 4. 🚀 SQLite-WAL Sub-second Velocity Detection
* **Real-time Engine**: Monitors transaction timestamps on conversation WAL files for instantaneous streaming status;
* **Dynamic Velocity**: Live TPS updates during generation (`78.4 t/s`), graceful idle fallback to 0 t/s with peak tracking.

### 5. 🎯 Developer-First Experience
* **✨ Official Vector Icons**: Integrated Google Gemini 4-point star & Anthropic Claude 12-point star vector icons;
* **🎨 Independent Numeric Alerting**: Only numbers change color based on quota health (Green / Orange / Red);
* **Dual View**: Webview dashboard or QuickPick modal;
* **Native Bilingual (i18n)**: Seamless English and Chinese localization.

---

## 🛠️ Configuration Settings

Search for `agPrivateCockpit` in VS Code / Antigravity IDE Settings:

| Setting | Default | Description |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | Display Google Gemini quota in status bar |
| `agPrivateCockpit.showClaude` | `true` | Display Anthropic Claude & GPT quota in status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Display live generation velocity (`t/s`) |
| `agPrivateCockpit.compactStatusBar` | `false` | Compact mode (hide 5-hour sprint numbers) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Background refresh interval (seconds, min 5) |
| `agPrivateCockpit.warningThreshold` | `50` | Warning alert threshold (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Critical alert threshold (%) |
| `agPrivateCockpit.defaultLanguage` | `"auto"` | UI language (`"auto"`, `"zh"`, `"en"`) |

---

## 📄 License

This extension is licensed under the [MIT License](LICENSE).
