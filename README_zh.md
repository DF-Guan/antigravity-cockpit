# 🛸 Antigravity Private Cockpit

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.10-blue.svg?style=flat-square)
![Antigravity](https://img.shields.io/badge/Antigravity_IDE-Native_Compatible-38bdf8.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Privacy](https://img.shields.io/badge/Privacy-100%25_Offline-success.svg?style=flat-square)
![Offline](https://img.shields.io/badge/Telemetry-ZERO-purple.svg?style=flat-square)

</div>

> 🔒 **专为开发者打造的 100% 纯本地物理离线 AI 配额、Token 消耗事实审计与实时流速监控驾驶舱。**  
> 零外部网络请求 · 零遥测泄露 · 毫秒级原生网络表直连 · 官方 Gemini & Claude 配额同频 · 极简状态栏 HUD

[English Documentation (README.md)](README.md)

---

## 📸 界面实测预览 (Visual Preview)

### 📍 1. 底部状态栏微距常驻监控 (Native Status Bar Integration)
> 官方矢量品牌几何 · 独立纯数字告警变色 · 真实物理微分测速 · 极致紧凑 0 冗余死区
![底部状态栏效果](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_zh.png)

### 🛸 2. 交互式可视化配额与纯物理 Token 驾驶舱 (Interactive Dashboard)
> 14 款大模型动态发现 · 官方配额全同频 · 纯物理 SQLite-WAL Token 消耗审计
![可视化驾驶舱](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_zh.png)

---

## 💎 核心产品力 6 大支柱（为什么选择 Private Cockpit？）

### 1. 🔒 100% 纯本地离线安全（零外发 · 零泄露 · 零遥测）
* **0 外部网络调用**：不向任何第三方或云端 API 发送请求，仅与本机回环地址（`127.0.0.1`）上的 Language Server 守护进程通信；
* **0 遥测与行为追踪**：不植入任何统计代码、打点分析或远程日志收集，隐私安全绝对闭环；
* **凭据内存驻留**：CSRF 令牌仅在本地运行内存中使用，杜绝凭据泄漏隐患。

### 2. ⚡ Netstat-PID 端口映射引擎（30ms 瞬时直连 · 100% 同步率）
* **PID 精准网络表映射**：通过 `netstat -ano` 直接抓取 Language Server 进程当前真正处于 `LISTENING` 状态的所有物理端口；
* **0 漏检与偏移免疫**：彻底解决传统端口递增扫描因端口大偏移（+70 以上）而漏检的问题，实现 100% 瞬时命中；
* **智能本地缓存**：握手成功后自动缓存端口号，后续每轮轮询直接本地直连，耗时 < 10ms。

### 3. ✨ Google Gemini 官方配额全同频（周周期 & 5h冲刺双窗口）
* **旗舰模型优先映射**：全面同频 `Gemini 3.8 Flash`、`Gemini 3.7 Flash` 与 `Gemini 3.1 Pro` 官方配额池；
* **精确到分秒的满额重置倒计时**：清晰掌握每周额度与 5 小时冲刺额度消耗进度；
* **三级自适应纯数字色彩预警**：绿色（充裕）、黄色（注意）、红色（耗尽）精准指示。

### 4. 🎭 Anthropic Claude & GPT-OSS 专属配额监控
* **主流高级推理模型覆盖**：独立呈现 Claude 4.6 Sonnet / Opus (Thinking) 及 GPT-OSS 120B 配额池状态；
* **双窗口独立进度条**：7 天周期与 5 小时高频冲刺双进度条清晰可视；
* **官方原生物理状态指示**：运行良好 / 额度偏低无缝切换。

### 5. 🎯 当前活跃会话独立隔离与全局总和严格区分
* **单会话纯净事实审计**：按最新修改时间毫秒级定位当前活跃会话（Active Session），4 宫格指标严格仅统计当前会话物理数据；
* **全局历史累计总池**：独立呈现本机所有历史会话累加总和（Global Total），口径严密隔离，绝不混淆；
* **📁 本机各会话独立吞吐清单置底**：清单配备自适应滚动条与动态会话总数感知，优雅置于界面底端；
* **本地删除即时同步**：本地删除会话或制品文件时，清单自动物理剔除，总 Token 精准实时扣减；
* **🔢 全精度一键切换**：支持在“K/M 缩略模式（`25.6M`）”与“千分位精确整数模式（`25,563,472`）”之间一键无缝切换。

### 6. 🚀 真实物理增量微分测速引擎（Gemini 3.8 / 3.7 Flash 极速感知）
* **物理字节差分感知**：每 1.5 秒监听本地 SQLite-WAL 与轨迹物理增长，真实换算每秒 Token 吞吐流速；
* **极速吞吐真实捕捉**：流式生成时动态呈现 Gemini 3.8 / 3.7 Flash 高速吞吐波形（**160 ~ 185 Tokens/s**），真实标定 **226.8 Tokens/s** 极限爆发峰值；
* **智能休眠感知**：模型停止生成 6.0 秒后平滑回落至 `0 t/s (💤 待机就绪)`，同时历史真实峰值完整保留。

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
| `agPrivateCockpit.criticalThreshold` | `20` | 额度严重不足红色预警阈值（%） |

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 开源许可证。
