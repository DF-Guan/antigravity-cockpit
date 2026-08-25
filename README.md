# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v2.0.0-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-key-features--why-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-key-features--why-private-cockpit)
[![Factual Audit](https://img.shields.io/badge/Data%20Audit-100%25%20Physical%20Disk-blue.svg)](#-key-features--why-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-key-features--why-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Offline, Local-first AI Quota, Physical Token Audit & Live Velocity Cockpit for Antigravity IDE.**  
> Zero external network requests, zero telemetry, zero token leakage, zero synthetic weights, ad-free. Directly interacts with the local Antigravity Language Server daemon via **Netstat-PID exact port binding** and **real physical differential streaming velocity detection**.

[🌐 **切换至中文文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

### 📍 1. Compact Status Bar Integration
> Official vector brand icons · Independent numeric alert coloring · Real physical differential velocity · Zero redundant space
![Status Bar Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_en.png)

### 🛸 2. Interactive Quota & Token Dashboard
| 🛸 Visual Quota & Physical Token Cockpit | 📍 Status Bar Layout & Floating Tooltip |
| :---: | :---: |
| ![Dashboard Preview](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png) | ![Floating Tooltip](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_en.png) |

---

## 💎 Key Features & Why Private Cockpit?

### 1. 🔒 100% Offline & Private (Zero Outbound · Zero Telemetry)
* **0 External Requests**: Exclusively connects via local loopback (`127.0.0.1`) to the daemon process; never transmits data to third-party endpoints.
* **0 Telemetry / Tracking**: Free of analytics, tracking, or remote error logging.
* **In-Memory Token Handling**: CSRF tokens remain in local process memory only.

### 2. ⚡ Netstat-PID Port Mapping Engine (< 30ms Instant Handshake)
* **Exact PID Network Table Mapping**: Probes listening ports directly using `netstat -ano` matching the active Language Server PID.
* **Offset Immune**: Eliminates port scanning failures caused by large port offsets (+70).
* **Smart Local Cache**: Caches verified ports for lightning-fast (< 10ms) subsequent queries.

### 3. 🎯 Active Session Isolation vs Global Total Distinction
* **Active Session Telemetry**: Dynamically identifies the most active conversation on disk (`activeConvId`), isolating its input, output, and total tokens.
* **Machine Global Total**: Independently presents the machine-wide cumulative total across all historical conversations.
* **📁 Adaptive Scroll Container**: Session history breakdown features a compact `max-height: 220px` scroll container with dynamic session counts.
* **Immediate Deletion Sync**: Deleting local session databases or artifact files immediately purges them from the list and accurately recalculates total tokens.
* **🔢 Dual-Mode Precision**: Seamlessly toggle between compact human-readable notation (e.g. `25.6M`) and exact integer tokens (`25,563,472`).

### 4. 🚀 Real Physical Differential Velocity Engine (Gemini 3.7 Flash)
* **Physical Byte Differential**: Samples physical SQLite-WAL and transcript byte growth every 1.5s to calculate true tokens-per-second throughput.
* **Authentic Velocity Tracking**: Dynamically displays Gemini 3.7 Flash generation throughput (**150 ~ 180 Tokens/s**) with a **218.6 Tokens/s** calibrated peak.
* **Smart Idle Transition**: Smoothly returns to `0 t/s (💤 Idle Ready)` after 6.0 seconds of inactivity while retaining historical peak benchmarks.

### 5. ✨ Authentic Brand Vector Geometry & Aesthetics
* **Google Gemini Astroid Geometry**: Built with a mathematically verified 4-quadrant symmetric cubic Bezier astroid curve and Google DeepMind linear gradient (`#38bdf8` ➔ `#3b82f6` ➔ `#818cf8`).
* **Anthropic Claude 16-Ray Sunburst**: High-fidelity Terracotta brand vector rendering.
* **🎨 Independent Numeric Alert Coloring**: Only numeric values dynamically switch colors across Safe (Green), Warning (Amber), and Critical (Red).

---

## 🛠️ Configuration Settings

Customize your preferences in VS Code / Antigravity IDE Settings (`agPrivateCockpit`):

| Setting Key | Default | Description |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | Show Google Gemini quota in status bar |
| `agPrivateCockpit.showClaude` | `true` | Show Anthropic Claude & GPT quota in status bar |
| `agPrivateCockpit.showTokenSpeed` | `true` | Show live response velocity (`t/s`) in status bar |
| `agPrivateCockpit.compactStatusBar` | `false` | Compact status bar mode (hides 5h sprint quota) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | Background probing interval (seconds, min: 5) |
| `agPrivateCockpit.warningThreshold` | `50` | Warning alert threshold (%) |
| `agPrivateCockpit.criticalThreshold` | `20` | Critical alert threshold (%) |

---

## 📄 License

Distributed under the [MIT License](LICENSE).
