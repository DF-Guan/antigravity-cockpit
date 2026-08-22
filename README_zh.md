# 🛸 Antigravity Private Cockpit (隐私配额与 Token 监控驾驶舱)

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v1.0.29-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-为什么选择-private-cockpit隐私安全宣言)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-为什么选择-private-cockpit隐私安全宣言)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **专为 Antigravity IDE / VS Code 打造的 100% 纯本地离线 AI 配额、Token 消耗统计与实时流速监控驾驶舱。**  
> 零外部网络请求、零数据遥测上报、零 Token 泄露风险。直接与本地 Antigravity Language Server 守护进程直连，具备 **广域端口动态嗅探** 与 **0ms 极速冷启动对齐**能力。

[🌐 **Switch to English Documentation (README.md)**](README.md)

---

## 📸 界面实测预览 (Visual Preview)

| 🛸 Claude 人文风配额与多维 Token 驾驶舱 | 📍 底部状态栏微距排版与多维悬浮卡片 |
| :---: | :---: |
| ![配额驾驶舱](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_zh.png) | ![状态栏与悬浮卡片](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_zh.png) |

---

## ✨ 核心特性一览 (Key Highlights)

1. **🎨 Claude 标志性人文排版美学**：
   - 采用经典衬线字体（`Charter`, `Georgia`, `Cambria`）搭配等宽数字排版，优雅与科技感兼备；
   - 专属 Claude 赤陶暖色调（`#da7756`）与深陶碳黑底色，长时间查看护眼舒适；
2. **📱 280px ~ 4K 全屏无缝自适应（Zero Overflow）**：
   - 内置弹性响应式断点系统，无论侧边栏拖拽到多窄，文字自动折叠与截断保护，状态胶囊永不穿透；
3. **📊 会话级多维 Token 消耗分析**：
   - 实时统计活跃会话的 **输入 Token、前缀缓存读取（命中率 98%+）、输出 Token、交互轮次与总吞吐**；
4. **⚡ 2.5 秒轻量动态生成流速追踪**：
   - 对话生成时实时动态跳动（`45 ~ 120 t/s`），空闲时平滑归位至 `待机就绪 (0 t/s)` 并记录上次峰值；
5. **🟢 精准配额与满额状态引擎**：
   - 广域端口动态嗅探（`basePort ~ basePort + 20`），毫秒级直连 Language Server；
   - 100% 满额明确点亮 `满额就绪 (100% 充足)`，消耗时精确推算剩余倒计时；
6. **🌐 极简双语无缝切换**：
   - 一键无缝在简体中文与 English 间自由切换。

---

## 🔒 为什么选择 Private Cockpit？（隐私安全宣言）

| 安全与技术维度 | 传统第三方插件 | 🛸 Antigravity Private Cockpit |
| :--- | :--- | :--- |
| **网络请求** | 调用外部未知服务器/代理 API | 🚫 **0 外部网络请求（100% 本地环回 `127.0.0.1` 直连）** |
| **数据埋点与遥测** | 内置 Google/Mixpanel 统计代码 | 🚫 **0 遥测上报、0 行为追踪、0 任何日志上传** |
| **Token 凭据安全** | 可能存在中转或泄露风险 | 🔒 **CSRF Token 仅驻留本地运行内存，绝不外发** |
| **冷启动性能** | 启动卡顿白屏 3~5 秒 | ⚡ **0ms 极速启动（自动读取最后已知快照）** |
| **多模型支持** | 单一或模型混淆 | ✨ **Google Gemini 原生池 + 🎭 Claude/GPT 原生池独立双轨统计** |

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
