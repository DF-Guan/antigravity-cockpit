# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.35-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
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

### 3. 📊 会话级多维 Token 消耗深度分析
* **多维统计**：实时统计当前活跃会话的 **输入 Token、前缀缓存读取、输出 Token、交互轮次与总吞吐规模**；
* **缓存命中洞察**：清晰展示前缀缓存读取率（`98%+`），帮助开发者直观评估上下文复用效率与 Token 成本。

### 4. 🚀 SQLite-WAL 亚秒级流速感知引擎
* **全场景灵敏响应**：直接监听本地会话事务日志，普通问答、长代码生成或多工具调度均能瞬间捕获；
* **动态流速展示**：流式生成时实时动态跳动（`70 ~ 95 t/s`），空闲时自动平滑归位至待机并保留峰值记录。

### 5. 🎯 极简纯净、开箱即用与操作便利性
* **纯粹实用工具**：零广告、零付费套路、零冗余弹窗，专注服务开发者核心需求；
* **多级智能变色预警**：状态栏与驾驶舱进度条根据配额剩余联动变色（安全蓝/赤陶色、黄色警戒、红色极危）；
* **后台保活防闪烁**：编辑器标签页切换无白屏重绘，滚动位置完美保留；
* **全屏自适应无溢出**：从 `280px` 窄侧边栏到 `4K` 宽屏均实现自适应无缝缩放；
* **一键双语切换**：支持简体中文与 English 自由切换。

---

## 🔒 隐私与安全性全方位对比

| 安全与技术维度 | 传统第三方配额插件 | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **网络通信模式** | 需联网调用远程代理/外部服务 API | 🚫 **0 外部请求（100% 仅本地 `127.0.0.1` 环回直连）** |
| **数据埋点与遥测** | 内置 Google/Mixpanel 等统计代码 | 🚫 **0 遥测上报、0 行为追踪、0 任何日志上传** |
| **商业与广告** | 含有推广横幅、引导打赏或外部跳转 | 🛡️ **纯粹开发工具，纯净无广告，零干扰** |
| **冷启动性能** | 每次启动卡顿白屏 3~5 秒 | ⚡ **0ms 极速启动（自动读取最后已知快照）** |
| **双模型池隔离** | 混淆配额或单模型统计 | ✨ **Gemini 旗舰池 + 🎭 Claude/GPT 池独立双轨监测** |

---

## ⚙️ 个性化配置选项 (Configuration)

在 VS Code / Antigravity IDE 设置中搜索 `agPrivateCockpit`：

| 设置项 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `agPrivateCockpit.defaultLanguage` | `"auto"` | 默认显示语言 (`"auto"`, `"zh"`, `"en"`) |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | 配额大轮询周期（秒，最低 5 秒） |
| `agPrivateCockpit.showGemini` | `true` | 是否在状态栏显示 Google Gemini 配额 |
| `agPrivateCockpit.showClaude` | `true` | 是否在状态栏显示 Anthropic Claude & GPT 配额 |
| `agPrivateCockpit.showTokenSpeed` | `true` | 是否在状态栏显示实时 Token 速率 |
| `agPrivateCockpit.compactStatusBar` | `false` | 极简微距状态栏模式 |
| `agPrivateCockpit.warningThreshold` | `50` | 告警黄色阈值（剩余百分比） |
| `agPrivateCockpit.criticalThreshold` | `20` | 危险红色阈值（剩余百分比） |

---

## ⌨️ 快捷指令 (Commands)

* `F1` ➔ 输入 `Antigravity: 打开隐私配额驾驶舱`（打开可视化大屏）
* `F1` ➔ 输入 `Antigravity: 快速查看配额与速率总览`（打开顶部命令快速下拉）
* `F1` ➔ 输入 `Antigravity: 立即刷新配额`（强制从本地 Language Server 探测最新配额）
* `F1` ➔ 输入 `Antigravity: 切换显示语言`（切换中英双语）

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 开源。
