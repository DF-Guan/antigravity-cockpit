# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.37-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **专为开发者打造的 100% 纯本地离线 AI 配额、Token 消耗多维统计与实时流速监控插件。**  
> 零外部网络请求、零数据遥测上报、零 Token 泄露风险、纯净无广告。直接与本地 Antigravity Language Server 守护进程直连，具备 **0ms 极速冷启动** 与 **亚秒级流速响应** 能力。

[🌐 **Switch to English Documentation (README.md)**](README.md)

---

## 📸 界面实测预览 (Visual Preview)

### 📍 1. 底部状态栏微距常驻监控 (Native Status Bar Integration)
> 官方矢量品牌图标 · 独立纯数字告警变色 · 亚秒级流速响应 · 极致紧凑 0 冗余死区
![底部状态栏微距常驻监控](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_zh.png)

### 🛸 2. 交互式可视化配额与多维 Token 驾驶舱 (Interactive Dashboard)
| 🛸 实时可视化配额与多维 Token 驾驶舱 | 📍 状态栏微距排版与多维悬浮卡片 |
| :---: | :---: |
| ![配额驾驶舱](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_zh.png) | ![状态栏与悬浮卡片](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_zh.png) |

---

## 💎 核心产品力卖点（为什么选择 Private Cockpit？）

### 1. 🔒 100% 纯本地离线安全（零外发 · 零泄露 · 零遥测）
* **0 外部网络请求**：完全通过本地环回通信（`127.0.0.1`）直连底层守护进程，绝不把任何数据发送至外部服务器或第三方代理；
* **0 遥测与行为追踪**：不植入任何统计代码、打点分析或远程日志收集，隐私安全绝对闭环；
* **凭据内存驻留**：CSRF 令牌仅在本地运行内存中使用，杜绝凭据泄漏隐患。

### 2. ⚡ 原生底层实时同频（0ms 冷启动 · 毫秒级直连）
* **广域端口动态嗅探**：自适应捕获 Language Server 实时通信端口，毫秒级直接读取官方真实配额；
* **0ms 极速冷启动**：基于本地瞬时快照对齐，打开 IDE 瞬间即可在状态栏看到最新配额，告别传统插件卡顿白屏；
* **状态精准呈现**：满额明确标明 `满额就绪 (100% 充足)`，消耗时精确计算剩余恢复倒计时。

### 3. 📊 会话级多维 Token 消耗深度分析与全量精度切换
* **多维统计**：实时统计当前活跃会话的 **输入 Token、前缀缓存读取、输出 Token、交互轮次与总吞吐规模**；
* **🔢 全精度一键切换**：支持在“K/M 缩略模式（`37.4M`）”与“千分位精确整数模式（`37,470,392`）”之间随时点击切换；
* **缓存命中洞察**：清晰展示前缀缓存读取率（`98%+`），帮助开发者直观评估上下文复用效率与 Token 成本。

### 4. 🚀 SQLite-WAL 亚秒级流速感知引擎
* **全场景灵敏响应**：直接监听本地会话事务日志，普通问答、长代码生成或多工具调度均能瞬间捕获；
* **动态流速展示**：流式生成时实时动态跳动（`78.4 t/s`），待机时智能归零并保留历史峰值。

### 5. 🎯 纯粹高效的开发者交互体验
* **✨ 官方矢量品牌图标**：集成 Google Gemini 四角星芒与 Anthropic Claude 十二角星芒原生矢量图标；
* **🎨 独立纯数字变色**：图标与标签保持干净中性主题色，仅配额纯数字按安全（绿）、警戒（黄）、极低（红）三级独立着色；
* **双模查看**：一键切换沉浸式 Webview 仪表盘或极简 QuickPick 快捷面板；
* **智能自适应多语言**：支持中英文无缝切换，界面与状态栏文案 100% 本地化。

---

## 🛠️ 配置项说明 (Configuration)

您可以在 VS Code / Antigravity IDE 设置中搜索 `agPrivateCockpit` 进行自定义：

| 配置项 | 默认值 | 说明 |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | 是否在状态栏显示 Google Gemini 原生配额 |
| `agPrivateCockpit.showClaude` | `true` | 是否在状态栏显示 Anthropic Claude & GPT 原生配额 |
| `agPrivateCockpit.showTokenSpeed` | `true` | 是否在状态栏显示实时 Token 响应速率 (`t/s`) |
| `agPrivateCockpit.compactStatusBar` | `false` | 极简模式（仅显示图标与周配额，隐藏 5h 冲刺） |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | 后台探测刷新周期（秒，最低 5 秒） |
| `agPrivateCockpit.warningThreshold` | `50` | 额度告警黄色预警阈值（%） |
| `agPrivateCockpit.criticalThreshold` | `20` | 额度危险红色预警阈值（%） |
| `agPrivateCockpit.defaultLanguage` | `"auto"` | 界面语言（`"auto"`, `"zh"`, `"en"`） |

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 许可协议，请放心在个人及企业开发环境中使用。
