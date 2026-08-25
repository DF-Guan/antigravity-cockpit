# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v2.0.0-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-key-features--why-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-key-features--why-private-cockpit)
[![Factual Audit](https://img.shields.io/badge/Data%20Audit-100%25%20Physical%20Disk-blue.svg)](#-key-features--why-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-key-features--why-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Pure Local & Offline AI Quota, Physical Token Audit, Multi-Model Context Quota Governance, and Real-time Velocity Telemetry Cockpit.**  
> Zero external network requests, zero telemetry tracking, zero token leakage risk, zero synthetic weighting, and 100% ad-free. Connects directly to your local Antigravity Language Server daemon with **Netstat-PID instantaneous handshake** and **physical SQLite-WAL differential velocity measurement**.

[🌐 **切换至中文文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

### 📍 1. Compact Native Status Bar Telemetry
> Official vector brand geometry · Pure `🧠 Context Quota%` gauge · Independent digit coloring · Real-time physical velocity · Zero deadzone
![Status Bar Integration](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_zh.png)

### 🛸 2. Interactive Quota & Token Dashboard
| 🛸 Interactive Quota & Token Dashboard | 📍 Status Bar Hover Card & Layout |
| :---: | :---: |
| ![Dashboard Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_zh.png) | ![Status Bar Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_zh.png) |

---

## 💎 7 Key Architectural Pillars

### 1. 🔒 100% Offline & Private (Zero Outbound · Zero Telemetry)
* **0 External Requests**: Pure loopback communication (`127.0.0.1`) directly with the local daemon;
* **0 Telemetry & Analytics**: Absolutely no tracking scripts, ping analytics, or remote log collection;
* **In-Memory Credentials**: CSRF tokens reside purely in memory.

### 2. 🧠 Apple/Linear Style Vector Context Quota Telemetry (v2.0.0)
* **42px Native Vector SVG Radial Gauge**: Crisp circular telemetry with 4-stage adaptive alert colors (#38bdf8 / #3b82f6 / #f59e0b / #ef4444);
* **Multi-Model Capacities Matrix**: Built-in context window adaptors for Google Gemini (1M/2M), Claude (200K), GPT-4o (128K), and DeepSeek (64K);
* **Persistent Snapshot Recovery**: Engine automatically scans on-disk snapshots across Reload Window and IDE restarts.

### 3. 📸 Smart Context Snapshot & Subproject Physical Isolation (v2.0.0)
* **Active Subproject Discovery (`resolveActiveSubproject`)**: Strictly isolates snapshot archives to `projects/<subprojectName>/docs/snapshots/`;
* **Dynamic Pointer Sync in memory.md**: Automatically updates the active snapshot pointer in `memory.md` for seamless cross-session continuity;
* **Non-Intrusive Workflow**: Single click to archive without popping open editor tabs or interrupting flow.

### 4. ⚡ Netstat-PID Instant Port Handshake Engine
* **PID-Exact Network Table Mapping**: Captures real `LISTENING` ports of the Language Server daemon using `netstat -ano`;
* **Zero Offset Failure**: Immune to large port offsets (+70), guaranteeing 100% instant sync in 30ms;
* **Local In-Memory Cache**: Caches verified ports for sub-10ms subsequent polling.

### 5. 🎯 Active Session Isolation & Global Separation
* **Single-Session Pure Audit**: Automatically targets the active session by filesystem timestamp;
* **Global Aggregate Separation**: Independently displays machine-wide cumulative totals without mixing scopes;
* **Adaptive Scrolling List**: Elegant `max-height: 220px` list with dynamic session counting;
* **Real-time Deletion Sync**: Deleting session files instantly updates local counts;
* **One-Click Precision Toggle**: Switch between compact mode (`25.6M`) and exact integer format (`25,563,472`).

### 6. 🚀 Real Physical Differential Speed Engine (Gemini 3.7 Flash Velocity)
* **Byte Differential Scanning**: Listens to SQLite-WAL byte differentials every 1.5 seconds;
* **Live Velocity Waveform**: Captures burst generation speeds (150 ~ 180 t/s) and records peak speeds (218.6 t/s);
* **Idle State Detection**: Smoothly resets to `0 t/s (💤 Standby Ready)` after 6.0s idle while preserving historical peak.

### 7. ✨ Authentic Vector Brand Geometry
* **Google Gemini Astroid**: Exact 4-quadrant symmetric 3rd-order Bezier astroid geometry with native DeepMind gradient;
* **Anthropic Claude 16-Ray Sparkle**: Authentic Terracotta high-fidelity vector rendering;
* **🎨 Independent Digit-Only Coloring**: Status bar icons stay in neutral theme tones while digits shift through green, yellow, and red.

---

## 💡 Why Active Context Refinement is Critical for Pro Developers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│              🚨 Why Passive Truncation is Not Enough in Complex Projects      │
├─────────────────────────┬────────────────────────────────────────────────────┤
│ Dimension               │ 🤖 Backend Passive Truncation                      │ ⚡ Cockpit Active Snapshot Refinement (Pro)        │
├─────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
│ **Trigger Timing**      │ **Critical Deadline** (Only forced at 95%~100%)    │ **Milestone Point** (Triggered at 70% saturation)  │
├─────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
│ **Quality**             │ **Mechanical Drop** (Drops early context blindly)  │ **High-Density Distillation** (Strips tool logs)   │
├─────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
│ **Model Attention**     │ **Severe Attention Decay** (Lost in the Middle)    │ **Instant Attention Reset** (100% sharp reasoning) │
├─────────────────────────┼────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
│ **Asset Persistence**   │ **Ephemeral** (Lost if session is cleared)         │ **Versioned on Disk** (Saved in `docs/snapshots/`) │
└─────────────────────────┴────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘
```

---

## 🛠️ Configuration

Customize the extension in VS Code / Antigravity IDE Settings (`agPrivateCockpit`):

| Setting | Default | Description |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | Show Google Gemini quota on status bar |
| `agPrivateCockpit.showClaude` | `true` | Show Anthropic Claude quota on status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Show real-time Token generation velocity (`t/s`) |
| `agPrivateCockpit.showContextSaturation` | `true` | Show context quota saturation meter (`🧠 Quota%`) |
| `agPrivateCockpit.contextWindowLimit` | `1048576` | Model context window limit in tokens (Default 1M) |
| `agPrivateCockpit.compactStatusBar` | `false` | Compact mode (icon + weekly quota only) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Polling refresh interval in seconds (min 5s) |
| `agPrivateCockpit.warningThreshold` | `50` | Yellow warning threshold percentage (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Red critical threshold percentage (%) |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
