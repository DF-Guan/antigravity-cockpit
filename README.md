# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-1.0.30-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-why-private-cockpit-security--privacy-manifesto)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README_zh.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **100% Local & Offline AI Quota, Token Analytics & Live Velocity Monitor for Antigravity IDE / VS Code.**  
> Zero external network requests, zero telemetry, zero token leakage. Directly reads from the local Antigravity Language Server daemon with **wide-range dynamic port sniffing** and **0ms instant cached startup**.

[🇨🇳 **查看中文完整说明文档 (README_zh.md)**](README_zh.md)

---

## 📸 Visual Preview

| 🛸 Warm Minimalist Cockpit & Token Analytics | 📍 Status Bar Compact Layout & Rich Tooltip |
| :---: | :---: |
| ![Cockpit Dashboard](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_en.png) | ![Status Bar & Tooltip](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_en.png) |

---

## ✨ Key Highlights

1. **🎨 Modern Humanist Typography & Layout**:
   - Signature serif headers (`Charter`, `Georgia`, `Cambria`) paired with monospace numeric metrics for human-centric elegance.
   - Warm terracotta accents (`#da7756`) and warm-dark surfaces for eye comfort during long coding sessions.
2. **📱 280px to 4K Zero-Overflow Responsive Layout**:
   - Built-in multi-breakpoint container system. Sidebar drag-resize never clips status badges or overflows text.
3. **📊 Session-Level Multi-Dimensional Token Analytics**:
   - Real-time active session breakdown: **Input Tokens, Prefix Cache Reads (98%+ hit ratio), Output Tokens, Interaction Turns, and Total Volume**.
4. **⚡ 2.5s Dynamic Streaming Velocity Tracker**:
   - Actively measures generation velocity during chat responses (`45 ~ 120 t/s`), smoothly settling to `Idle (0 t/s)` while preserving peak records.
5. **🟢 Accurate Quota & 100% Readiness State**:
   - Wide-range port sniffing (`basePort ~ basePort + 20`) connects in milliseconds.
   - Displays `Full (100% Ready)` when untouched, and accurate countdowns when consuming.
6. **🌐 Instant One-Click Bilingual Switching**:
   - Switch seamlessly between English and Simplified Chinese anytime.

---

## 🔒 Why Private Cockpit? (Security & Privacy Manifesto)

| Dimension | Typical 3rd-Party Quota Tools | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **Network Requests** | Calls external unknown proxy/collector APIs | 🚫 **0 External Requests (100% Local Loopback `127.0.0.1`)** |
| **Telemetry & Tracking** | Built-in analytics / tracking libraries | 🚫 **0 Telemetry, 0 Tracking, 0 Remote Logging** |
| **Token Security** | May proxy or leak credentials | 🔒 **CSRF tokens remain strictly in local memory** |
| **Cold Startup** | Freezes UI for 3~5s on launch | ⚡ **0ms Instant Startup (Immediate state cache)** |
| **Dual Quota Isolation** | Single or mixed buckets | ✨ **Google Gemini + 🎭 Claude/GPT Isolated Tracking** |

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
