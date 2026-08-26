//﻿​‌​​​​​‌​‌​‌​‌​‌​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​‌​​‌​​​‌​​​‌​​​‌‌​​​‌​‌‌​‌​‌​​​‌‌‌​‌‌‌​‌​‌​‌‌​​​​‌​‌‌​‌‌‌​​‌‌‌‌‌​​​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌‌‌​‌​​​‌‌​​​​​​‌‌​‌‌​​​‌‌​​​‌​​‌‌​‌​​​‌‌​​​​‌​‌‌​​​‌‌​‌‌​​​‌‌​​‌‌​​​​​‌‌​​​‌​​​‌‌‌​​​​‌‌​​‌​​​​‌‌​​​​​‌‌​​​‌​​‌‌​​​​‌​​‌‌​​​‌​​‌‌​​‌​‍
const { computeContextSaturation, getContextState, resolveActiveSubproject } = require('../services/contextEngine');
const vscode = require('vscode');

let currentPanel = undefined;

function showDashboard(context, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, onCommand) {
    if (currentPanel) {
        try {
            currentPanel.reveal(vscode.ViewColumn.One);
            updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);
            return currentPanel;
        } catch (e) {
            try { currentPanel.dispose(); } catch (_) {}
            currentPanel = undefined;
        }
    }

    try {
        currentPanel = vscode.window.createWebviewPanel(
            'agPrivateCockpit',
            currentLang === 'zh' ? 'Antigravity 隐私配额驾驶舱' : 'Antigravity Private Quota Cockpit',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [context.extensionUri]
            }
        );

        currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);

        currentPanel.webview.onDidReceiveMessage(msg => {
            if (onCommand) onCommand(msg.command);
        }, undefined, context.subscriptions);

        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        }, null, context.subscriptions);
        return currentPanel;
    } catch (err) {
        console.error('[Antigravity Private Cockpit] Webview create failed:', err);
        return null;
    }
}

// ⚡ Synchronize Dashboard Webview reliably
function updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang) {
    if (currentPanel) {
        try {
            currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);
        } catch (_) {}
    }
}

function showQuickOverview(context, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, callbacks) {
    const isZh = currentLang === 'zh';
    const g = liveQuotaState.gemini;
    const c = liveQuotaState.claude;

    const gW = g.weeklyPercent !== null ? `${g.weeklyPercent}%` : '--%';
    const g5 = g.fiveHourPercent !== null ? `${g.fiveHourPercent}%` : '--%';
    const cW = c.weeklyPercent !== null ? `${c.weeklyPercent}%` : '--%';
    const c5 = c.fiveHourPercent !== null ? `${c.fiveHourPercent}%` : '--%';

    const items = isZh ? [
        { label: `💎 当前会话总消耗: ${tokenAnalyticsState.activeTotalFormatted} (${tokenAnalyticsState.activeTotalExact})`, description: `会话 ID: ${tokenAnalyticsState.activeConvShort} | 输出: ${tokenAnalyticsState.activeOutputFormatted} | 交互: ${tokenAnalyticsState.activeRequests}轮`, detail: '严格仅统计当前活跃会话的全部物理生成与上下文' },
        { label: `🌐 本机全局累计: ${tokenAnalyticsState.globalTotalFormatted} (${tokenAnalyticsState.globalTotalExact})`, description: `共计 ${tokenAnalyticsState.globalConvsCount} 个会话的物理总和`, detail: '包含本机磁盘上所有历史 Antigravity 开发会话' },
        { label: `✨ Google Gemini: ${gW} (5h: ${g5})`, description: `周期: 7天重置 | 7天: ${g.weeklyResetTimeZh} | 5h: ${g.fiveHourResetTimeZh}`, detail: 'Gemini 3.7 Flash • 3.1 Pro 原生旗舰 (全自动实时)' },
        { label: `🎭 Claude 4.6 & GPT: ${cW} (5h: ${c5})`, description: `周期: 7天重置 | 7天: ${c.weeklyResetTimeZh} | 5h: ${c.fiveHourResetTimeZh}`, detail: 'Claude 4.6 Sonnet / Opus, GPT-OSS 专属配额池 (全自动实时)' },
        { label: `🧠 切换测算目标模型窗口`, description: '当前支持: Gemini (1M/2M), Claude (200K), GPT-4o (128K), DeepSeek (64K)', detail: '实时调整上下文额度饱和度参考基准' },
        { label: `⚡ 实时响应速率: 🚀 ${liveSpeedState.isStreaming ? liveSpeedState.currentTps + ' Tokens/s (生成中)' : '0 Tokens/s (待机)'} ｜ 🏆 峰值 ${liveSpeedState.peakTps} Tokens/s`, description: `本地 IPC 延迟: ${liveSpeedState.latencyMs}ms | ${liveSpeedState.lastMeasuredTime}`, detail: '真实生成状态动态检测' },
        { label: `⚡ 智能提炼上下文快照`, description: '物理归档当前会话快照，重置模型注意力保留率' },
        { label: `🔄 立即强制刷新`, description: '从底层 Language Server 探测最新配额' },
        { label: `🖥️ 打开可视化驾驶舱`, description: '查看官方品牌大屏与真实会话明细' },
        { label: `🌐 切换为 English`, description: '当前: 中文' },
        { label: `⚙️ 打开插件设置`, description: '自定义预警阈值与刷新频率' }
    ] : [
        { label: `💎 Active Session Total: ${tokenAnalyticsState.activeTotalFormatted} (${tokenAnalyticsState.activeTotalExact})`, description: `Session ID: ${tokenAnalyticsState.activeConvShort} | Out: ${tokenAnalyticsState.activeOutputFormatted} | Turns: ${tokenAnalyticsState.activeRequests}`, detail: 'Strictly isolated to active current conversation only' },
        { label: `🌐 Machine Global Total: ${tokenAnalyticsState.globalTotalFormatted} (${tokenAnalyticsState.globalTotalExact})`, description: `Sum of all ${tokenAnalyticsState.globalConvsCount} sessions`, detail: 'All historical Antigravity sessions' },
        { label: `✨ Google Gemini: ${gW} (5h: ${g5})`, description: `Cycle: 7-Day Window | Reset: ${g.weeklyResetTimeEn} | 5h: ${g.fiveHourResetTimeEn}`, detail: 'Gemini 3.7 Flash • 3.1 Pro Flagship (Auto Live)' },
        { label: `🎭 Claude 4.6 & GPT: ${cW} (5h: ${c5})`, description: `Cycle: 7-Day Window | Reset: ${c.weeklyResetTimeEn} | 5h: ${c.fiveHourResetTimeEn}`, detail: 'Claude 4.6 Sonnet / Opus, GPT-OSS Pool (Auto Live)' },
        { label: `⚡ Generation Velocity: 🚀 ${liveSpeedState.isStreaming ? liveSpeedState.currentTps + ' Tokens/s (Streaming)' : '0 Tokens/s (Idle)'} ｜ 🏆 Peak Burst: ${liveSpeedState.peakTps} Tokens/s`, description: `Local IPC Latency: ${liveSpeedState.latencyMs}ms | ${liveSpeedState.lastMeasuredTime}`, detail: 'Real-time response velocity' },
        { label: `⚡ Refine Context Snapshot Now`, description: 'Archive snapshot to disk & reset model attention baseline' },
        { label: `🔄 Force Refresh Now`, description: 'Probe latest quota from Language Server' },
        { label: `🖥️ Open Visual Dashboard`, description: 'View brand-accurate quota cockpit & disk analytics' },
        { label: `🌐 Switch to Chinese (中文)`, description: 'Current: English' },
        { label: `⚙️ Open Extension Settings`, description: 'Customize thresholds & refresh rate' }
    ];

    vscode.window.showQuickPick(items, {
        placeHolder: isZh ? 'Antigravity AI 配额与速率总览' : 'Antigravity AI Quota & Velocity Overview'
    }).then(sel => {
        if (!sel) return;
        const txt = sel.label;
        if (txt.includes('模型') || txt.includes('Model')) {
            vscode.commands.executeCommand('agPrivateCockpit.switchModel');
        } else if (txt.includes('提炼') || txt.includes('Refine')) {
            if (callbacks.onCompact) callbacks.onCompact();
        } else if (txt.includes('可视化') || txt.includes('Visual')) {
            if (callbacks.onOpenDashboard) callbacks.onOpenDashboard();
        } else if (txt.includes('切换') || txt.includes('Switch')) {
            if (callbacks.onToggleLang) callbacks.onToggleLang();
        } else if (txt.includes('设置') || txt.includes('Settings')) {
            if (callbacks.onOpenSettings) callbacks.onOpenSettings();
        } else if (txt.includes('刷新') || txt.includes('Refresh')) {
            if (callbacks.onRefresh) callbacks.onRefresh();
        }
    });
}

function renderDashboardHtml(webview, data, speed, tokens, lang) {
    const isZh = lang === 'zh';
      let wsRoot = undefined;
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        wsRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    const activeEditorPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : null;
    const subproject = resolveActiveSubproject(wsRoot, activeEditorPath);
    const contextState = computeContextSaturation(tokens, 1048576, undefined, subproject.path);
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const warnPct = cfg.get('warningThreshold', 50);
    const critPct = cfg.get('criticalThreshold', 20);

    const gW = data.gemini.weeklyPercent !== null ? data.gemini.weeklyPercent : 0;
    const g5 = data.gemini.fiveHourPercent !== null ? data.gemini.fiveHourPercent : 0;
    const cW = data.claude.weeklyPercent !== null ? data.claude.weeklyPercent : 0;
    const c5 = data.claude.fiveHourPercent !== null ? data.claude.fiveHourPercent : 0;

    const t = {
        title:       isZh ? '隐私配额驾驶舱' : 'Private Quota Cockpit',
        liveTag:     data.isLive ? (isZh ? '官方原生实时同频' : 'Native Live Synced') : (isZh ? '实时连接中' : 'Connected'),
        btnLang:     isZh ? '🌐 English' : '🌐 切换中文',
        btnSettings: isZh ? '⚙️ 设置' : '⚙️ Settings',
        btnRefresh:  isZh ? '🔄 实时刷新' : '🔄 Refresh',
        
        geminiBrand: 'Google Gemini',
        geminiSub:   (data.geminiModels && data.geminiModels.length > 0) ? data.geminiModels.slice(0, 4).join(' • ') : 'Gemini 3.7 Flash • Gemini 3.6 Flash • Gemini 3.5 Flash • Gemini 3.1 Pro',
        claudeBrand: 'Anthropic Claude & GPT',
        claudeSub:   (data.claudeModels && data.claudeModels.length > 0) ? data.claudeModels.slice(0, 3).join(' • ') : 'Claude Sonnet 4.6 (Thinking) • Claude Opus 4.6 (Thinking) • GPT-OSS 120B',
        statusOk:    isZh ? '运行良好' : 'Optimal',
        statusWarn:  isZh ? '注意额度' : 'Watch',
        statusCrit:  isZh ? '额度偏低' : 'Low',
        weekLabel:   isZh ? '每周额度剩余 (7天周期)' : 'Weekly Limit Remaining (7-Day)',
        fiveLabel:   isZh ? '5小时冲刺额度剩余' : 'Five Hour Limit Remaining',
        resetLabel:  isZh ? '满额重置' : 'Reset In',
        fiveResetLbl:isZh ? '5小时刷新' : '5h Reset',
        resetTimeG:  isZh ? data.gemini.weeklyResetTimeZh : data.gemini.weeklyResetTimeEn,
        resetTimeC:  isZh ? data.claude.weeklyResetTimeZh : data.claude.weeklyResetTimeEn,
        fiveResetG:  isZh ? data.gemini.fiveHourResetTimeZh : data.gemini.fiveHourResetTimeEn,
        fiveResetC:  isZh ? data.claude.fiveHourResetTimeZh : data.claude.fiveHourResetTimeEn,
        
        tokenTitle:  isZh ? '📊 会话级物理 Token 审计' : '📊 Session Physical Token Audit',
        tokenDesc:   isZh ? `当前活跃会话: ${tokens.activeConvId}` : `Active Session: ${tokens.activeConvId}`,
        cycleBadge:  isZh ? `🟢 活跃中: ${tokens.activeConvShort}` : `🟢 Active: ${tokens.activeConvShort}`,
        btnPrecExact:isZh ? '🔢 点击切换全量精确数值' : '🔢 Click to toggle exact precision',
        
        heroTotLbl:  isZh ? '💎 当前会话总消耗' : '💎 Active Session Tokens',
        heroTotSub:  isZh ? '当前活跃会话输入 + 输出真实总吞吐' : 'Total volume of active session',
        heroTotTip:  isZh ? '统计口径：严格仅统计当前活跃会话（ID: ' + tokens.activeConvId + '）在全生命周期内所吞吐的所有上下文与生成物物理总规模。' : 'Definition: Strictly isolated to the active conversation only.',
        
        heroSpdLbl:  isZh ? '⚡ 实时生成速率' : '⚡ Live Generation Velocity',
        heroSpdSub:  isZh ? `峰值 ${speed.peakTps} t/s ｜ 本地 ${speed.latencyMs}ms` : `Peak ${speed.peakTps} t/s ｜ Local ${speed.latencyMs}ms`,
        
        heroGlobLbl: isZh ? '🌐 本机全局累计' : '🌐 Machine Global Total',
        heroGlobSub: isZh ? `共计 ${tokens.globalConvsCount} 个会话物理总和` : `Sum of all ${tokens.globalConvsCount} sessions`,
        heroGlobTip: isZh ? '统计口径：本机磁盘上所有历史 Antigravity 会话的物理 Token 累加总和。' : 'Definition: Machine-wide cumulative total across all sessions.',

        historyTitle:isZh ? `📁 本机各会话独立吞吐清单 (共 ${tokens.globalConvsCount} 个会话 · 自动物理隔离)` : `📁 Individual Session Breakdown (${tokens.globalConvsCount} sessions · Isolated)`,

        idleText:    isZh ? '💤 待机就绪' : '💤 Idle Ready',
        streamText:  isZh ? '🟢 正在生成' : '🟢 Streaming',
        
        inTitle:     isZh ? '📥 当前输入 Token' : '📥 Active Input Tokens',
        inHint:      isZh ? '工程上下文与多轮历史' : 'Project context & history',
        inTip:       isZh ? '统计口径：当前会话发送给模型的全部工程上下文、历史消息与提示词（含 98.6% 前缀缓存）。' : 'Definition: Context tokens for active session.',
        cacheTitle:  isZh ? '⚡ 前缀缓存读取' : '⚡ Prefix Cache Read',
        cacheHint:   isZh ? `缓存命中率 ${tokens.activeCachedPercent}` : `Cache hit ratio ${tokens.activeCachedPercent}`,
        cacheTip:    isZh ? '统计口径：当前会话被底层 KV-Cache 直接命中的部分。' : 'Definition: Portions matched in KV cache.',
        outTitle:    isZh ? '📤 当前输出 Token' : '📤 Active Output Tokens',
        outHint:     isZh ? '思考过程与生成代码' : 'Thinking traces & code',
        outTip:      isZh ? '统计口径：当前会话模型实际生成的代码、思考链、执行结果与 Markdown 制品。' : 'Definition: Generated tokens in active session.',
        reqTitle:    isZh ? '📈 当前交互轮次' : '📈 Active Turns',
        reqHint:     isZh ? '提问与后台任务调度' : 'User prompts & tool calls',
        unitTimes:   isZh ? '轮' : 'turns',
        
        footerSafe:  isZh ? '🔒 <strong>100% 纯本地物理隔离审计</strong> · 当前会话与全局累计严密区分 · 零外部网络遥测' : '🔒 <strong>100% Local & Isolated Audit</strong> · Session vs Global Separation · Zero Telemetry',
        footerSync:  isZh ? '最后同步' : 'Last sync'
    };

    function statusInfo(pct) {
        if (pct < critPct) return { label: t.statusCrit, color: '#f85149' };
        if (pct < warnPct) return { label: t.statusWarn, color: '#d29922' };
        return { label: t.statusOk, color: '#3fb950' };
    }

    function getBarColor(pct, brandDefault) {
        if (pct < critPct) return '#ef4444';
        if (pct < warnPct) return '#f59e0b';
        return brandDefault;
    }

    const gStat = statusInfo(Math.min(gW, g5));
    const cStat = statusInfo(Math.min(cW, c5));

    const gWColor  = getBarColor(gW, '#3b82f6');
    const g5Color  = getBarColor(g5, '#3b82f6');
    const cWColor  = getBarColor(cW, 'var(--c-terracotta)');
    const c5Color  = getBarColor(c5, 'var(--c-terracotta)');

    const speedValDisplay = speed.isStreaming
        ? `<span class="hero-val" id="heroSpeedVal" style="color:var(--c-blue);">${speed.currentTps} <span style="font-size:13px;font-weight:700;">t/s</span></span><span class="idle-badge" id="heroSpeedBadge" style="background:rgba(56,189,248,0.18);color:var(--c-blue);">${t.streamText}</span>`
        : `<span class="hero-val" id="heroSpeedVal" style="color:var(--text-muted);">0 <span style="font-size:13px;font-weight:700;">t/s</span></span><span class="idle-badge" id="heroSpeedBadge">${t.idleText}</span>`;

    const realHistoryHtml = (tokens.conversationsList || []).map(r => {
        const badge = r.isActive 
            ? `<span style="background:rgba(74,222,128,0.18);color:var(--c-green);padding:2px 6px;border-radius:4px;font-weight:700;font-size:10px;">🟢 当前活跃</span>` 
            : `<span style="background:var(--bg-sub);color:var(--text-muted);padding:2px 6px;border-radius:4px;font-size:10px;">📁 历史会话</span>`;
        return `<div class="real-day-row">
          <div class="real-day-date">
            ${badge} <strong style="margin-left:4px;" title="${r.cid}">${r.cidShort}</strong> 
            <span style="color:var(--text-muted);font-size:10px;margin-left:4px;">(${r.timeStr})</span>
          </div>
          <div class="real-day-metrics">
            <span>交互: <strong>${r.msgs}</strong> 轮</span> ｜ 
            <span>输出: <strong class="token-val" data-compact="${r.outFormatted}" data-exact="${r.outExact}" style="color:var(--c-green);">${r.outFormatted}</strong></span> ｜ 
            <span>会话总计: <strong class="token-val" data-compact="${r.totalFormatted}" data-exact="${r.totalExact}" style="color:var(--c-gold);">${r.totalFormatted}</strong></span>
          </div>
        </div>`;
    }).join('');

    return `<!DOCTYPE html>
<html lang="${isZh ? 'zh-CN' : 'en'}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: https:;">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>${t.title}</title>
<style>
:root {
  --bg-main: var(--vscode-editor-background, #181715);
  --bg-card: var(--vscode-sideBar-background, #21201c);
  --bg-sub: var(--vscode-editorWidget-background, #2a2824);
  --border: var(--vscode-widget-border, rgba(245, 240, 230, 0.14));
  --text-title: var(--vscode-editor-foreground, #fbfaf7);
  --text-body: var(--vscode-editor-foreground, #d4d0c7);
  --text-muted: var(--vscode-descriptionForeground, #9e988e);
  --c-terracotta: #da7756;
  --c-gold: #f59e0b;
  --c-blue: #60a5fa;
  --c-green: #4ade80;
  --c-purple: #c084fc;
}

body.vscode-light {
  --bg-main: var(--vscode-editor-background, #faf9f5);
  --bg-card: var(--vscode-sideBar-background, #ffffff);
  --bg-sub: #f3f1eb;
  --border: var(--vscode-widget-border, #e5e2da);
  --text-title: #1f1e1b;
  --text-body: #4a463e;
  --text-muted: #7d786e;
  --c-terracotta: #c15f3e;
  --c-gold: #b45309;
  --c-blue: #2563eb;
  --c-green: #15803d;
  --c-purple: #7e22ce;
}

body.vscode-dark {
  --bg-main: var(--vscode-editor-background, #181715);
  --bg-card: var(--vscode-sideBar-background, #21201c);
  --bg-sub: #2a2824;
  --border: var(--vscode-widget-border, rgba(245, 240, 230, 0.14));
  --text-title: #fbfaf7;
  --text-body: #d4d0c7;
  --text-muted: #9e988e;
  --c-terracotta: #da7756;
  --c-gold: #f59e0b;
  --c-blue: #60a5fa;
  --c-green: #4ade80;
  --c-purple: #c084fc;
}

body.vscode-high-contrast, body.vscode-high-contrast-light {
  --border: var(--vscode-contrastBorder, #ffffff);
  --bg-card: var(--vscode-sideBar-background, #000000);
  --bg-sub: var(--vscode-editorWidget-background, #111111);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg-main);
  color: var(--text-body);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 14px;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
}
.wrap {
  width: 100%;
  max-width: 680px;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.header-title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}
.header-title {
  font-family: "Charter", "Georgia", "Cambria", "Times New Roman", serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-title);
  letter-spacing: -0.2px;
  white-space: nowrap;
}
.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: -apple-system, sans-serif;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(74, 222, 128, 0.12);
  color: var(--c-green);
  border: 1px solid rgba(74, 222, 128, 0.3);
  font-weight: 600;
  white-space: nowrap;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-green);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.85); } }

.actions { display: flex; gap: 6px; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--bg-card);
  color: var(--text-title);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all .15s ease;
  user-select: none;
}
.btn:hover { background: var(--vscode-button-background, #1f6feb); color: #fff; border-color: transparent; }
.btn:active { transform: scale(0.96); }
.btn-lang {
  background: rgba(218, 119, 86, 0.12);
  color: var(--c-terracotta);
  border-color: rgba(218, 119, 86, 0.35);
}
.btn-lang:hover { background: var(--c-terracotta); color: #fff; }
.spin-icon { display: inline-block; transition: transform 0.4s ease; }
.btn:active .spin-icon { transform: rotate(180deg); }

.token-section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  min-width: 0;
}
.sec-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  gap: 8px;
}
.sec-header-left {
  min-width: 0;
  flex: 1 1 auto;
}
.sec-title {
  font-family: "Charter", "Georgia", "Cambria", "Times New Roman", serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-title);
}
.sec-desc {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}
.cycle-badge-box {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.cycle-badge {
  font-size: 11px;
  color: var(--c-terracotta);
  background: var(--bg-sub);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}
.btn-prec {
  background: var(--bg-sub);
  color: var(--text-title);
  border: 1px solid var(--border);
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  user-select: none;
}
.btn-prec:hover {
  background: var(--vscode-button-background, #1f6feb);
  color: #fff;
  border-color: transparent;
}
.btn-prec:active {
  transform: scale(0.96);
}

.hero-row {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1.1fr;
  gap: 8px;
  margin-bottom: 10px;
}
.hero-card {
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 4px;
  min-width: 0;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.hero-card:hover {
  border-color: rgba(245, 240, 230, 0.35);
}
.hero-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
}
.info-icon {
  font-size: 10px;
  opacity: 0.7;
}
.hero-val-box {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px;
}
.hero-val {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.hero-val:hover { opacity: 0.85; }
.hero-sub {
  font-size: 10px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.idle-badge {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 600;
  white-space: nowrap;
}

.real-history-box {
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
}
.real-history-list {
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.real-history-list::-webkit-scrollbar {
  width: 5px;
}
.real-history-list::-webkit-scrollbar-track {
  background: transparent;
}
.real-history-list::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
.real-history-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
.real-history-head {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-title);
  margin-bottom: 8px;
}
.real-day-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 11px;
  flex-wrap: wrap;
  gap: 6px;
}
.real-day-date {
  color: var(--text-title);
  display: flex;
  align-items: center;
}
.real-day-metrics {
  color: var(--text-muted);
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.sub-box {
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  min-width: 0;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.sub-box:hover {
  border-color: rgba(245, 240, 230, 0.35);
}
.sub-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 4px;
}
.sub-val {
  font-size: 16px;
  font-weight: 800;
  margin: 2px 0;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.sub-val:hover { opacity: 0.85; }
.sub-hint {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
}
.card-g { border-top: 3px solid #3b82f6; }
.card-c { border-top: 3px solid var(--c-terracotta); }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.brand-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}
.logo-wrap {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-sub);
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.brand-info {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
}
.brand-name {
  font-family: "Charter", "Georgia", "Cambria", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-title);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.brand-sub {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pill {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: rgba(74, 222, 128, 0.12);
  color: var(--c-green);
  border: 1px solid rgba(74, 222, 128, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: auto;
}
.metric {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.metric-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  gap: 6px;
}
.metric-val {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-title);
  flex-shrink: 0;
}
.track {
  height: 6px;
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 3px;
  overflow: hidden;
}
.fill-bar {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
  border-radius: 3px;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 6px;
  border-top: 1px solid var(--border);
  font-size: 10px;
  color: var(--text-muted);
}
.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}
.meta-val {
  color: var(--text-title);
  font-weight: 600;
  flex-shrink: 0;
}

.footer {
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 11px;
  color: var(--text-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.sync { font-weight: 700; color: var(--text-title); }

@media (max-width: 560px) {
  .hero-row { grid-template-columns: 1fr; }
  .sub-grid { grid-template-columns: 1fr 1fr; }
  .grid { grid-template-columns: 1fr; }
  .topbar { flex-direction: column; align-items: stretch; gap: 8px; }
  .actions { justify-content: flex-end; }
  .cycle-badge-box { flex-direction: column; align-items: flex-end; gap: 4px; }
}

@media (max-width: 340px) {
  .sub-grid { grid-template-columns: 1fr; }
  .header-title-box { flex-direction: column; align-items: flex-start; }
}

/* 🧠 State-of-the-Art Compact Context Telemetry Card */
.context-telemetry-card {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: var(--bg-sub);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 14px;
  gap: 14px;
}
.ctx-gauge-section {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px;
  flex: 1;
}
.ctx-gauge-svg-wrap {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  max-width: 40px !important;
  flex-shrink: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctx-gauge-svg {
  width: 40px !important;
  height: 40px !important;
  transform: rotate(-90deg);
}
.ctx-gauge-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 3.8;
}
.ctx-gauge-val {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}
.ctx-meta-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ctx-meta-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-title);
}
.ctx-badge-pill {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}
.ctx-meta-metrics {
  font-size: 11px;
  color: var(--text-desc);
  display: flex;
  align-items: center;
  gap: 10px;
}
.ctx-metric-item strong {
  color: var(--text-title);
  font-weight: 600;
}
.btn-compact-pro {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-compact-pro:hover {
  background: rgba(56, 189, 248, 0.22);
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
  transform: translateY(-1px);
}

</style>
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <div class="header-title-box">
      <span class="header-title">🛸 ${t.title}</span>
      <span class="live-badge"><span class="dot"></span>${t.liveTag}</span>
    </div>
    <div class="actions">
      <button class="btn btn-lang" onclick="toggleLang()">${t.btnLang}</button>
      <button class="btn" onclick="openSettings()">${t.btnSettings}</button>
      <button class="btn" onclick="refresh()"><span class="spin-icon">🔄</span> ${t.btnRefresh.replace('🔄 ', '')}</button>
    </div>
  </div>

  <div class="token-section">
    <div class="sec-header">
      <div class="sec-header-left">
        <div class="sec-title">${t.tokenTitle}</div>
        <div class="sec-desc">${t.tokenDesc}</div>
      </div>
      <div class="cycle-badge-box">
        <button class="btn-prec" onclick="togglePrecision()" title="${t.btnPrecExact}"><span id="precIcon">🔢</span> <span id="precText">${isZh ? '切换全精度' : 'Exact Mode'}</span></button>
        <div class="cycle-badge">${t.cycleBadge}</div>
      </div>
    </div>

    <div class="context-telemetry-card">
      <div class="ctx-gauge-section">
        <div class="ctx-gauge-svg-wrap" title="${isZh ? '1M 上下文物理饱和度' : '1M Context Quota'}">
          <svg width="42" height="42" class="ctx-gauge-svg" viewBox="0 0 36 36" style="width:42px;height:42px;min-width:42px;min-height:42px;flex-shrink:0;">
            <circle class="ctx-gauge-track" cx="18" cy="18" r="15"/>
            <circle class="ctx-gauge-val" cx="18" cy="18" r="15" stroke="${contextState.colorHex}" stroke-dasharray="94.25" stroke-dashoffset="${94.25 * (1 - contextState.saturationPercent / 100)}"/>
          </svg>
        </div>
        <div class="ctx-meta-content">
          <div class="ctx-meta-header">
            <span>🧠 ${isZh ? '上下文额度饱和度' : 'Context Quota'}: <strong>${contextState.saturationFormatted}</strong></span>
            <span class="ctx-badge-pill" style="background:${contextState.colorHex}1a;color:${contextState.colorHex};border:1px solid ${contextState.colorHex}44;">${isZh ? contextState.stageNameZh : contextState.stageNameEn}</span>
          </div>
          <div class="ctx-meta-metrics">
            <span class="ctx-metric-item">${isZh ? '已用额度' : 'Memory'}: <strong>${(((contextState.usedTokens || contextState.workingTokens || 0)) / 1000).toFixed(1)}K</strong> / 1,024K</span>
            <span class="ctx-metric-item">｜ ⚡ ${isZh ? '注意力' : 'Attention'}: <strong>${isZh ? contextState.attentionHealthZh : contextState.attentionHealthEn}</strong></span>
          </div>
        </div>
      </div>
      <button class="btn-compact-pro" onclick="vscode.postMessage({command:'compact'})" title="${isZh ? '提炼当前会话关键状态快照并归档' : 'Extract session decisions and compact context'}">
        ⚡ ${isZh ? '智能提炼上下文' : 'Refine Context'}
      </button>
    </div>

    <div class="hero-row">
      <div class="hero-card" onclick="togglePrecision()" title="${t.heroTotTip}">
        <div class="hero-label">${t.heroTotLbl} <span class="info-icon" title="${t.heroTotTip}">ℹ️</span></div>
        <div class="hero-val-box">
          <span class="hero-val token-val" data-compact="${tokens.activeTotalFormatted}" data-exact="${tokens.activeTotalExact}" style="color:var(--c-gold);" title="${tokens.activeTotalExact} Tokens">${tokens.activeTotalFormatted}</span>
        </div>
        <div class="hero-sub">${t.heroTotSub}</div>
      </div>

      <div class="hero-card">
        <div class="hero-label">${t.heroSpdLbl}</div>
        <div class="hero-val-box">
          ${speedValDisplay}
        </div>
        <div class="hero-sub" id="heroSpeedSub">${t.heroSpdSub}</div>
      </div>

      <div class="hero-card" onclick="togglePrecision()" title="${t.heroGlobTip}">
        <div class="hero-label">${t.heroGlobLbl} <span class="info-icon" title="${t.heroGlobTip}">ℹ️</span></div>
        <div class="hero-val-box">
          <span class="hero-val token-val" data-compact="${tokens.globalTotalFormatted}" data-exact="${tokens.globalTotalExact}" style="color:var(--c-blue);" title="${tokens.globalTotalExact} Tokens">${tokens.globalTotalFormatted}</span>
        </div>
        <div class="hero-sub">${t.heroGlobSub}</div>
      </div>
    </div>

    <div class="real-history-box">
      <div class="real-history-head">${t.historyTitle}</div>
      <div class="real-history-list">
        ${realHistoryHtml}
      </div>
    </div>

    <div class="sub-grid">
      <div class="sub-box" onclick="togglePrecision()" title="${t.inTip}">
        <div class="sub-title">${t.inTitle} <span class="info-icon" title="${t.inTip}">ℹ️</span></div>
        <div class="sub-val token-val" data-compact="${tokens.activeInputFormatted}" data-exact="${tokens.activeInputExact}" style="color:var(--c-blue);" title="${tokens.activeInputExact} Tokens">${tokens.activeInputFormatted}</div>
        <div class="sub-hint">${t.inHint}</div>
      </div>
      <div class="sub-box" onclick="togglePrecision()" title="${t.cacheTip}">
        <div class="sub-title">${t.cacheTitle} <span class="info-icon" title="${t.cacheTip}">ℹ️</span></div>
        <div class="sub-val token-val" data-compact="${tokens.activeCachedFormatted}" data-exact="${tokens.activeCachedExact}" style="color:var(--c-purple);" title="${tokens.activeCachedExact} Tokens">${tokens.activeCachedFormatted}</div>
        <div class="sub-hint">${t.cacheHint}</div>
      </div>
      <div class="sub-box" onclick="togglePrecision()" title="${t.outTip}">
        <div class="sub-title">${t.outTitle} <span class="info-icon" title="${t.outTip}">ℹ️</span></div>
        <div class="sub-val token-val" data-compact="${tokens.activeOutputFormatted}" data-exact="${tokens.activeOutputExact}" style="color:var(--c-green);" title="${tokens.activeOutputExact} Tokens">${tokens.activeOutputFormatted}</div>
        <div class="sub-hint">${t.outHint}</div>
      </div>
      <div class="sub-box" onclick="togglePrecision()">
        <div class="sub-title">${t.reqTitle}</div>
        <div class="sub-val" style="color:var(--text-title);">${tokens.activeRequests} ${t.unitTimes}</div>
        <div class="sub-hint">${t.reqHint}</div>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="card card-g">
      <div class="card-head">
        <div class="brand-box">
          <div class="logo-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="geminiLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" />
                  <stop offset="50%" stop-color="#3b82f6" />
                  <stop offset="100%" stop-color="#818cf8" />
                </linearGradient>
              </defs>
              <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" fill="url(#geminiLogoGrad)"/>
            </svg>
          </div>
          <div class="brand-info">
            <div class="brand-name">${t.geminiBrand}</div>
            <div class="brand-sub">${t.geminiSub}</div>
          </div>
        </div>
        <span class="pill">● ${gStat.label}</span>
      </div>

      <div class="metric">
        <div class="metric-row"><span>${t.weekLabel}</span><span class="metric-val">${data.gemini.weeklyPercent !== null ? data.gemini.weeklyPercent + '%' : '--'}</span></div>
        <div class="track"><div class="fill-bar" style="width:${gW}%; background:${gWColor};"></div></div>
      </div>
      <div class="metric">
        <div class="metric-row"><span>${t.fiveLabel}</span><span class="metric-val">${data.gemini.fiveHourPercent !== null ? data.gemini.fiveHourPercent + '%' : '--'}</span></div>
        <div class="track"><div class="fill-bar" style="width:${g5}%; background:${g5Color};"></div></div>
      </div>

      <div class="meta">
        <div class="meta-row"><span>${t.resetLabel}</span><span class="meta-val">${t.resetTimeG}</span></div>
        <div class="meta-row"><span>${t.fiveResetLbl}</span><span class="meta-val" style="color:${g5 >= 100 ? 'var(--c-green)' : 'inherit'}">${t.fiveResetG}</span></div>
      </div>
    </div>

    <div class="card card-c">
      <div class="card-head">
        <div class="brand-box">
          <div class="logo-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M13.5 2.5L12 7L10.5 2.5C10.3 1.9 9.7 1.5 9 1.5C8.2 1.5 7.5 2.2 7.5 3C7.5 3.3 7.6 3.6 7.8 3.9L10.2 8.5L5.5 6.2C5.2 6.1 4.9 6 4.6 6C3.7 6 3 6.7 3 7.6C3 8.3 3.5 8.9 4.1 9.1L8.7 10.6L4.2 12.1C3.6 12.3 3.1 12.9 3.1 13.6C3.1 14.5 3.8 15.2 4.7 15.2C5 15.2 5.3 15.1 5.6 15L10.2 12.7L7.8 17.3C7.6 17.6 7.5 17.9 7.5 18.2C7.5 19 8.2 19.7 9 19.7C9.7 19.7 10.3 19.3 10.5 18.7L12 14.2L13.5 18.7C13.7 19.3 14.3 19.7 15 19.7C15.8 19.7 16.5 19 16.5 18.2C16.5 17.9 16.4 17.6 16.2 17.3L13.8 12.7L18.4 15C18.7 15.1 19 15.2 19.3 15.2C20.2 15.2 20.9 14.5 20.9 13.6C20.9 12.9 20.4 12.3 19.8 12.1L15.3 10.6L19.9 9.1C20.5 8.9 21 8.3 21 7.6C21 6.7 20.3 6 19.4 6C19.1 6 18.8 6.1 18.5 6.2L13.8 8.5L16.2 3.9C16.4 3.6 16.5 3.3 16.5 3C16.5 2.2 15.8 1.5 15 1.5C14.3 1.5 13.7 1.9 13.5 2.5Z" fill="var(--c-terracotta)"/>
            </svg>
          </div>
          <div class="brand-info">
            <div class="brand-name">${t.claudeBrand}</div>
            <div class="brand-sub">${t.claudeSub}</div>
          </div>
        </div>
        <span class="pill">● ${cStat.label}</span>
      </div>

      <div class="metric">
        <div class="metric-row"><span>${t.weekLabel}</span><span class="metric-val">${data.claude.weeklyPercent !== null ? data.claude.weeklyPercent + '%' : '--'}</span></div>
        <div class="track"><div class="fill-bar" style="width:${cW}%; background:${cWColor};"></div></div>
      </div>
      <div class="metric">
        <div class="metric-row"><span>${t.fiveLabel}</span><span class="metric-val">${data.claude.fiveHourPercent !== null ? data.claude.fiveHourPercent + '%' : '--'}</span></div>
        <div class="track"><div class="fill-bar" style="width:${c5}%; background:${c5Color};"></div></div>
      </div>

      <div class="meta">
        <div class="meta-row"><span>${t.resetLabel}</span><span class="meta-val">${t.resetTimeC}</span></div>
        <div class="meta-row"><span>${t.fiveResetLbl}</span><span class="meta-val" style="color:${c5 >= 100 ? 'var(--c-green)' : 'inherit'}">${t.fiveResetC}</span></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>🔒 <strong>${t.footerSafe}</strong></span>
    <span class="sync">${t.footerSync}: ${data.lastSyncTime}</span>
  </div>
</div>

<script>
const vscode = acquireVsCodeApi();
const isZh = "${isZh}" === "true";
let isExact = false;
try {
  isExact = localStorage.getItem('ag_cockpit_exact_mode') === 'true';
} catch(_) {}

function updatePrecisionView() {
  document.querySelectorAll('.token-val').forEach(el => {
    const compact = el.getAttribute('data-compact');
    const exact = el.getAttribute('data-exact');
    el.innerText = isExact ? exact : compact;
  });
  const btn = document.getElementById('precText');
  if (btn) {
    btn.innerText = isExact ? (isZh ? '切为简写' : 'Compact') : (isZh ? '切换全精度' : 'Exact Mode');
  }
}

function togglePrecision() {
  isExact = !isExact;
  try { localStorage.setItem('ag_cockpit_exact_mode', isExact); } catch(_) {}
  updatePrecisionView();
}

updatePrecisionView();

function refresh()      { vscode.postMessage({ command: 'refresh'      }); }
function openSettings() { vscode.postMessage({ command: 'openSettings' }); }
function toggleLang()   { vscode.postMessage({ command: 'toggleLang'   }); }
</script>
</body>
</html>`;
}

module.exports = {
    showDashboard,
    updateDashboardIfOpen,
    showQuickOverview,
    renderDashboardHtml
};
