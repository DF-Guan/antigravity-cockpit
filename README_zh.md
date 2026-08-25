# 🛸 Antigravity Private Cockpit

[![Open VSX](https://img.shields.io/badge/Open%20VSX-v2.0.0-blue.svg)](https://open-vsx.org/extension/DF-Guan/antigravity-cockpit)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Local-success.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-ZERO-brightgreen.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![Factual Audit](https://img.shields.io/badge/Data%20Audit-100%25%20Physical%20Disk-blue.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![No Ads](https://img.shields.io/badge/Ads-None%20%7C%20Pure%20Utility-blueviolet.svg)](#-核心产品力卖点为什么选择-private-cockpit)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%E4%B8%AD%E6%96%87-orange.svg)](README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> 🔒 **专为开发者打造的 100% 纯本地物理离线 AI 配额、Token 消耗事实审计、多模型上下文额度治理与实时流速监控驾驶舱。**  
> 零外部网络请求、零数据遥测上报、零 Token 泄露风险、零虚构加权数据、纯净无广告。直接与本地 Antigravity Language Server 守护进程直连，具备 **Netstat-PID 精确端口瞬时握手** 与 **真实物理微分流速感知** 能力。

[🌐 **Switch to English Documentation (README.md)**](README.md)

---

## 📸 界面实测预览 (Visual Preview)

### 📍 1. 底部状态栏微距常驻监控 (Native Status Bar Integration)
> 官方矢量品牌几何 · 纯净 `🧠 上下文额度%` 仪表 · 独立纯数字告警变色 · 真实物理微分测速 · 极致紧凑 0 冗余死区
![底部状态栏微距常驻监控](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_banner_zh.png)

### 🛸 2. 交互式可视化配额与纯物理 Token 驾驶舱 (Interactive Dashboard)
| 🛸 实时可视化配额与纯物理 Token 驾驶舱 | 📍 状态栏微距排版与多维悬浮卡片 |
| :---: | :---: |
| ![配额驾驶舱](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/dashboard_preview_zh.png) | ![状态栏与悬浮卡片](https://raw.githubusercontent.com/DF-Guan/antigravity-cockpit/main/assets/statusbar_preview_zh.png) |

---

## 💎 核心产品力 7 大支柱（为什么选择 Private Cockpit？）

### 1. 🔒 100% 纯本地离线安全（零外发 · 零泄露 · 零遥测）
* **0 外部网络请求**：完全通过本地回环通信（`127.0.0.1`）直连底层守护进程，绝不把任何数据发送至外部服务器或第三方代理；
* **0 遥测与行为追踪**：不植入任何统计代码、打点分析或远程日志收集，隐私安全绝对闭环；
* **凭据内存驻留**：CSRF 令牌仅在本地运行内存中使用，杜绝凭据泄漏隐患。

### 2. 🧠 Apple/Linear 级高精上下文额度环形仪表（v2.0.0 重磅）
* **42px 原生矢量 SVG 动态圆环**：彻底摒弃 ASCII 表情与不规范符号，毫秒级自适应四级色彩（科技蓝/极光蓝/预警黄/警戒红）；
* **多模型原生容量矩阵自适应**：内置 Google Gemini (1M/2M)、Anthropic Claude (200K)、OpenAI GPT-4o (128K)、DeepSeek (64K) 等容量自动换算；
* **物理持久化回溯 (`findPersistentSnapshot`)**：即便窗口重载或 IDE 重启，依然自动从磁盘读取快照持久化锁定提炼基线。

### 3. 📸 智能上下文快照提炼与多子项目物理隔离（v2.0.0 重磅）
* **精准锁定子项目 (`resolveActiveSubproject`)**：优先匹配正在编辑的文件所属工程，快照文件严格归属于 `projects/<子项目名>/docs/snapshots/`；
* **💡 零配置自适应与自动建目录 (Zero-Config Auto-Creation)**：
  - **自动建目录**：若当前项目尚未创建 `docs/snapshots/`，点击提炼时引擎会**全自动级联创建完整目录并写入快照**，无需开发者手动干预；
  - **单工程自动兼容**：对于没有 `projects/` 目录的独立单一工程，快照将全自动回退保存在 `<工程根目录>/docs/snapshots/` 下；
* **全局文档索引强联动**：自动在子项目 `memory.md` 写入最新快照指针，为新会话提供高密度基线，彻底杜绝跨工程污染；
* **极简无侵入交互**：单击状态栏或大屏提炼按钮，瞬时落盘并弹出自动淡出的轻量通知，不弹开文件打扰编码思路。

### 4. ⚡ Netstat-PID 端口映射引擎（30ms 瞬时直连 · 100% 同步率）
* **PID 精准网络表映射**：通过 `netstat -ano` 直接抓取 Language Server 进程当前真正处于 `LISTENING` 状态的所有物理端口；
* **0 漏检与偏移免疫**：彻底解决传统端口递增扫描因端口大偏移（+70 以上）而漏检的问题，实现 100% 瞬时命中；
* **智能本地缓存**：握手成功后自动缓存端口号，后续每轮轮询直接本地直连，耗时 < 10ms。

### 5. 🎯 当前活跃会话独立隔离与全局总和严格区分
* **单会话纯净事实审计**：按最新修改时间毫秒级定位当前活跃会话（Active Session），4 宫格指标严格仅统计当前会话物理数据；
* **全局历史累计总池**：独立呈现本机所有历史会话累加总和（Global Total），口径严密隔离，绝不混淆；
* **📁 自适应滚动清单**：会话清单配备 `max-height: 220px` 极简自适应滚动条与动态会话总数感知，排版始终优雅克制；
* **本地删除即时同步**：本地删除会话或制品文件时，清单自动物理剔除，总 Token 精准实时扣减；
* **🔢 全精度一键切换**：支持在“K/M 缩略模式（`25.6M`）”与“千分位精确整数模式（`25,563,472`）”之间一键无缝切换。

### 6. 🚀 真实物理增量微分测速引擎（Gemini 3.7 Flash 极速感知）
* **物理字节差分感知**：每 1.5 秒监听本地 SQLite-WAL 与轨迹物理增长，真实换算每秒 Token 吞吐流速；
* **极速吞吐真实捕捉**：流式生成时动态呈现 Gemini 3.7 Flash 高速吞吐波形（**150 ~ 180 Tokens/s**），真实标定 **218.6 Tokens/s** 极限爆发峰值；
* **智能休眠感知**：模型停止生成 6.0 秒后平滑回落至 `0 t/s (💤 待机就绪)`，同时历史真实峰值完整保留。

### 7. ✨ 正统官方矢量品牌几何美学
* **Google Gemini 官方星形线 (Astroid)**：采用严格四象限对称的三阶贝塞尔内凹星形几何模型，搭载 Google DeepMind 原生天青-靛蓝对角线性渐变；
* **Anthropic Claude 16 角星芒**：采用原生赤陶色（Terracotta）品牌高保真矢量渲染；
* **🎨 独立纯数字变色**：图标与标签保持干净中性主题色，仅配额纯数字按安全（绿）、警戒（黄）、极低（红）三级独立着色。

---

## 💡 深度解答：为什么有了底层自动截断，还需要主动提炼上下文？

许多大模型开发者常有疑惑：*“既然 Antigravity 底层超限时会自动截断并插入 Checkpoint 摘要，为什么我们还需要在驾驶舱中主动提炼？”*

| 维度 / 特性 | 🤖 Antigravity 底层被动截断 | ⚡ Cockpit 主动智能快照提炼 (推荐) |
| :--- | :--- | :--- |
| **触发时机** | **临界死线**：额度饱和到 95%~100% 爆满时才被迫截断 | **黄金节点**：完成一个里程碑、注意力衰减到 ~70% 时主动提炼 |
| **提炼质量** | **机械截断**：粗暴裁剪前文，极易丢失核心顶层架构契约 | **高密度结构化提炼**：剥离数万行终端调试噪音，精准沉淀核心事实 |
| **模型注意力** | **持续衰减**：长期背负数十兆工具输出，产生“失忆与幻觉” (Lost in the Middle) | **即刻重置**：瞬间卸下历史噪音包袱，模型推理重回 100% 敏捷状态 |
| **资产沉淀** | **无物理落盘**：会话一旦损坏或重开，前文记忆彻底蒸发 | **物理版本化归档**：生成带时间戳快照并联动 `memory.md`，工程全可追溯 |

### 🧠 深入拆解：大模型长文本的“三大隐形陷阱”
1. **摆脱“迷失在中间 (Lost in the Middle)”与注意力泥潭**：  
   虽然 Gemini 具备 1M/2M 庞大窗口，但当累积了几十轮调试日志后，海量噪音会分散注意力。在 70% 时主动提炼，能清空数万行无用工具输出，让模型推理恢复 100% 敏捷；
2. **拒绝灾难性遗忘**：  
   底层被动截断容易机械抹去最初制定的顶层架构规则；主动提炼由开发者把控节奏，确保核心交付与未竟待办 100% 固化；
3. **沉淀永续工程资产**：  
   自动将关键上下文持久化到 `projects/<子项目>/docs/snapshots/` 并同步 `memory.md`，为后续新会话与跨 Agent 协作提供秒级无缝接力。

---

## 🛠️ 配置项说明 (Configuration)

您可以在 VS Code / Antigravity IDE 设置中搜索 `agPrivateCockpit` 进行自定义：

| 配置项 | 默认值 | 说明 |
| :--- | :---: | :--- |
| `agPrivateCockpit.showGemini` | `true` | 是否在状态栏显示 Google Gemini 原生配额 |
| `agPrivateCockpit.showClaude` | `true` | 是否在状态栏显示 Anthropic Claude & GPT 原生配额 |
| `agPrivateCockpit.showTokenSpeed` | `true` | 是否在状态栏显示实时 Token 响应速率 (`t/s`) |
| `agPrivateCockpit.showContextSaturation` | `true` | 是否在状态栏显示上下文额度饱和度仪表 (`🧠 额度%`) |
| `agPrivateCockpit.contextWindowLimit` | `1048576` | 模型上下文额度上限 Tokens（默认 1M，Claude 为 200K） |
| `agPrivateCockpit.compactStatusBar` | `false` | 极简模式（仅显示图标与周配额，隐藏 5h 冲刺） |
| `agPrivateCockpit.refreshIntervalSeconds` | `15` | 后台探测刷新周期（秒，最低 5 秒） |
| `agPrivateCockpit.warningThreshold` | `50` | 额度告警黄色预警阈值（%） |
| `agPrivateCockpit.criticalThreshold` | `20` | 额度严重不足红色预警阈值（%） |

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 开源许可证。
