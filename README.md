# 🛸 Antigravity Private Cockpit

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.10-blue.svg?style=flat-square)
![Antigravity](https://img.shields.io/badge/Antigravity_IDE-Native_Compatible-38bdf8.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Offline-success.svg?style=flat-square)
![Offline](https://img.shields.io/badge/Telemetry-ZERO-purple.svg?style=flat-square)

</div>

> 🔒 **100% Pure Local & Offline AI Quota Monitor, Physical Token Audit, and Real-time Velocity Telemetry Cockpit.**  
> Zero external network requests · Zero telemetry leaks · Millisecond netstat handshake · Native Gemini & Claude quota sync · Minimalist status bar HUD

[🌐 **切换至中文文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

### 📍 1. Compact Native Status Bar Telemetry
> Official vector brand geometry · Independent digit coloring · Real-time physical velocity · Zero deadzone
![Status Bar Integration](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_en.png)

### 🛸 2. Interactive Quota & Token Dashboard
> 14 dynamic models discovery · Native quota synchronization · Factual SQLite-WAL Token audit
![Dashboard Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png)

---

## 💎 6 Key Architectural Pillars

### 1. 🔒 100% Offline & Private (Zero Outbound · Zero Telemetry)
* **0 External Requests**: Pure loopback communication (`127.0.0.1`) directly with the local daemon;
* **0 Telemetry & Analytics**: Absolutely no tracking scripts, ping analytics, or remote log collection;
* **In-Memory Credentials**: CSRF tokens reside purely in memory.

### 2. ⚡ Netstat-PID Instant Port Handshake Engine
* **PID-Exact Network Table Mapping**: Captures real `LISTENING` ports of the Language Server daemon using `netstat -ano`;
* **Zero Offset Failure**: Immune to large port offsets (+70), guaranteeing 100% instant sync in 30ms;
* **Local In-Memory Cache**: Caches verified ports for sub-10ms subsequent polling.

### 3. ✨ Google Gemini Official Quota Live Sync (7-Day & 5h Windows)
* **Flagship Priority Mapping**: Fully synchronized with `Gemini 3.8 Flash`, `Gemini 3.7 Flash`, and `Gemini 3.1 Pro` official pools;
* **Second-Precision Countdown**: Exact countdown to quota reset times;
* **3-Tier Adaptive Digit Color Alerts**: Green (Healthy), Yellow (Watch), Red (Critical).

### 4. 🎭 Anthropic Claude & GPT-OSS Quota Tracker
* **Advanced Reasoning Model Coverage**: Independently tracks Claude 4.6 Sonnet / Opus (Thinking) and GPT-OSS 120B pools;
* **Dual Progress Bars**: 7-Day and 5-Hour sprint capacity bars for instant clarity;
* **Native Status Indicator**: Seamless transitions between Optimal and Low Quota.

### 5. 🎯 Active Session Isolation & Global Separation
* **Single-Session Pure Audit**: Automatically targets the active session by filesystem timestamp;
* **Global Aggregate Separation**: Independently displays machine-wide cumulative totals without mixing scopes;
* **📁 Bottom-Anchored Session List**: Clean scrollable list positioned at the very bottom of the cockpit;
* **Real-time Deletion Sync**: Deleting session files instantly updates local counts;
* **One-Click Precision Toggle**: Switch between compact mode (`25.6M`) and exact integer format (`25,563,472`).

### 6. 🚀 Real Physical Differential Speed Engine (Gemini 3.8 / 3.7 Flash Velocity)
* **Byte Differential Scanning**: Listens to SQLite-WAL byte differentials every 1.5 seconds;
* **Live Velocity Waveform**: Captures burst generation speeds (150 ~ 180 t/s) and records peak speeds (226.8 t/s);
* **Idle State Detection**: Smoothly resets to `0 t/s (💤 Standby Ready)` after 6.0s idle while preserving historical peak.

---

## 🛠️ Configuration

Customize the extension in VS Code / Antigravity IDE Settings (`agPrivateCockpit`):

| Setting | Default | Description |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | Show Google Gemini quota on status bar |
| `agPrivateCockpit.showClaude` | `true` | Show Anthropic Claude quota on status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Show real-time Token generation velocity (`t/s`) |
| `agPrivateCockpit.compactStatusBar` | `false` | Compact mode (icon + weekly quota only) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Polling refresh interval in seconds (min 5s) |
| `agPrivateCockpit.warningThreshold` | `50` | Yellow warning threshold percentage (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Red critical threshold percentage (%) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
