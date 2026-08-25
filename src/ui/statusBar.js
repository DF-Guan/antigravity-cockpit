const vscode = require('vscode');
const { computeContextSaturation, getContextState, resolveActiveSubproject } = require('../services/contextEngine');

let sbGIcon, sbGWeekVal, sbG5h;
let sbCIcon, sbCWeekVal, sbC5h;
let sbSpeedIcon, sbSpeedVal;
let sbContextItem;

function initStatusBarItems(context, onClickCommand) {
    sbGIcon    = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
    sbGWeekVal = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9999);
    sbG5h      = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9998);

    sbCIcon    = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9997);
    sbCWeekVal = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9996);
    sbC5h      = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9995);

    sbSpeedIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9994);
    sbSpeedVal  = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9993);

    sbContextItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9992);
    sbContextItem.command = 'agPrivateCockpit.compactContext';

    const allItems = [sbGIcon, sbGWeekVal, sbG5h, sbCIcon, sbCWeekVal, sbC5h, sbSpeedIcon, sbSpeedVal];
    allItems.forEach(item => {
        item.command = onClickCommand || 'agPrivateCockpit.openDashboard';
        context.subscriptions.push(item);
    });
    context.subscriptions.push(sbContextItem);
}

function getNumberAlertColor(pct, warnPct, critPct) {
    if (pct === null || pct === undefined) return undefined;
    if (pct < critPct) return '#ef4444';
    if (pct < warnPct) return '#f59e0b';
    return '#3fb950';
}

function buildContextTooltip(lang, contextState, tokenAnalyticsState) {
    const isZh = lang === 'zh';
    const tip = new vscode.MarkdownString();
    tip.isTrusted = true;

    const capFormatted = Math.round(contextState.windowCapacity / 1000) + 'K';
    const totExact = tokenAnalyticsState.activeTotalExact || '0';
    const totFormatted = tokenAnalyticsState.activeTotalFormatted || '0';
    const inFormatted = tokenAnalyticsState.activeInputFormatted || '0';
    const outFormatted = tokenAnalyticsState.activeOutputFormatted || '0';

    if (isZh) {
        tip.appendMarkdown(`### 🧠 上下文窗口饱和度 (Context Saturation)

`);
        tip.appendMarkdown(`*当前占用: **${contextState.saturationFormatted}** / ${capFormatted} (${contextState.stageNameZh})*

---
`);
        tip.appendMarkdown(`📊 **当前活跃会话物理吞吐**: **${totFormatted}** (\`${totExact}\` Tokens)
`);
        tip.appendMarkdown(`- 📥 输入 Context: **${inFormatted}** (含前缀缓存)
`);
        tip.appendMarkdown(`- 📤 输出 Token: **${outFormatted}** (代码与思考链)
`);
        tip.appendMarkdown(`- ⚡ **长文本注意力保留率**: \`${contextState.attentionHealthZh}\`

---
`);
        tip.appendMarkdown(`💡 **[⚡ 点击执行 智能提炼上下文快照](command:agPrivateCockpit.compactContext)** | [🖥️ 打开驾驶舱](command:agPrivateCockpit.openDashboard)`);
    } else {
        tip.appendMarkdown(`### 🧠 Context Window Saturation

`);
        tip.appendMarkdown(`*Current Usage: **${contextState.saturationFormatted}** / ${capFormatted} (${contextState.stageNameEn})*

---
`);
        tip.appendMarkdown(`📊 **Active Session Tokens**: **${totFormatted}** (\`${totExact}\` Tokens)
`);
        tip.appendMarkdown(`- 📥 Input Context: **${inFormatted}** (with Cache)
`);
        tip.appendMarkdown(`- 📤 Output Tokens: **${outFormatted}** (Code & Traces)
`);
        tip.appendMarkdown(`- ⚡ **Attention Retention**: \`${contextState.attentionHealthEn}\`

---
`);
        tip.appendMarkdown(`💡 **[⚡ Click to run 提炼上下文](command:agPrivateCockpit.compactContext)** | [🖥️ Dashboard](command:agPrivateCockpit.openDashboard)`);
    }
    return tip;
}

function buildUnifiedTooltip(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState, contextState) {
    const isZh = lang === 'zh';
    const tip = new vscode.MarkdownString();
    tip.isTrusted = true;

    const gW = liveQuotaState.gemini.weeklyPercent !== null ? `${liveQuotaState.gemini.weeklyPercent}%` : '--%';
    const g5 = liveQuotaState.gemini.fiveHourPercent !== null ? `${liveQuotaState.gemini.fiveHourPercent}%` : '--%';
    const cW = liveQuotaState.claude.weeklyPercent !== null ? `${liveQuotaState.claude.weeklyPercent}%` : '--%';
    const c5 = liveQuotaState.claude.fiveHourPercent !== null ? `${liveQuotaState.claude.fiveHourPercent}%` : '--%';

    if (isZh) {
        const liveBadgeZh = liveQuotaState.isLive ? '🟢 官方原生实时同频' : (liveQuotaState.isLoading ? '🔄 正在同步...' : '⚡ 本地连接就绪');
        tip.appendMarkdown(`### 🛸 Antigravity 隐私配额驾驶舱

`);
        tip.appendMarkdown(`*最后同步: ${liveQuotaState.lastSyncTime} • 数据连接: ${liveBadgeZh}*

---
`);
        tip.appendMarkdown(`🧠 **会话上下文饱和度**: **${contextState.saturationFormatted}** / 1024K (\`${contextState.stageNameZh}\`)
`);
        tip.appendMarkdown(`- 💎 **当前会话总吞吐: ${tokenAnalyticsState.activeTotalFormatted}** (\`${tokenAnalyticsState.activeTotalExact}\` Tokens) ｜ 📈 会话轮次: **${tokenAnalyticsState.activeRequests}**
`);
        tip.appendMarkdown(`- 📥 输入: **${tokenAnalyticsState.activeInputFormatted}** (\`${tokenAnalyticsState.activeInputExact}\`) ｜ ⚡ 前缀缓存: **${tokenAnalyticsState.activeCachedPercent}**
`);
        tip.appendMarkdown(`- 📤 输出: **${tokenAnalyticsState.activeOutputFormatted}** (\`${tokenAnalyticsState.activeOutputExact}\` 真实代码与思考)
`);
        tip.appendMarkdown(`- 🌐 **本机全局历史累计: ${tokenAnalyticsState.globalTotalFormatted}** (\`${tokenAnalyticsState.globalTotalExact}\` Tokens / 共 ${tokenAnalyticsState.globalConvsCount} 个会话)

---
`);
        tip.appendMarkdown(`✨ **Google Gemini 原生系列 (周周期 & 5h冲刺)**
`);
        tip.appendMarkdown(`- 7天周期剩余: **${gW}** ｜ 满额重置: \`${liveQuotaState.gemini.weeklyResetTimeZh}\`
`);
        tip.appendMarkdown(`- 5小时冲刺剩余: **${g5}** ｜ 状态/刷新: \`${liveQuotaState.gemini.fiveHourResetTimeZh}\`

`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT 系列 (周周期 & 5h冲刺)**
`);
        tip.appendMarkdown(`- 7天周期剩余: **${cW}** ｜ 满额重置: \`${liveQuotaState.claude.weeklyResetTimeZh}\`
`);
        tip.appendMarkdown(`- 5小时冲刺剩余: **${c5}** ｜ 状态/刷新: \`${liveQuotaState.claude.fiveHourResetTimeZh}\`

---
`);
        tip.appendMarkdown(`⚡ **实时流式响应测速**
`);
        tip.appendMarkdown(`- 🚀 **实时生成流速**: **${liveSpeedState.isStreaming ? liveSpeedState.currentTps + ' Tokens/s (🟢 生成中)' : '0 Tokens/s (💤 待机就绪)'}**
`);
        tip.appendMarkdown(`- 🏆 **历史爆发峰值**: **${liveSpeedState.peakTps} Tokens/s**
`);
        tip.appendMarkdown(`- ⏱️ 本地 IPC 延迟: \`${liveSpeedState.latencyMs}ms\`

---
`);
        tip.appendMarkdown(`[⚡ 提炼上下文](command:agPrivateCockpit.compactContext) | [🔄 刷新](command:agPrivateCockpit.refresh) | [🖥️ 打开驾驶舱](command:agPrivateCockpit.openDashboard) | [🌐 English](command:agPrivateCockpit.toggleLang) | [⚙️ 设置](command:agPrivateCockpit.openNativeSettings)`);
    } else {
        const liveBadgeEn = liveQuotaState.isLive ? '🟢 Native Live Synced' : (liveQuotaState.isLoading ? '🔄 Syncing...' : '⚡ Local Ready');
        tip.appendMarkdown(`### 🛸 Antigravity Private Quota Cockpit

`);
        tip.appendMarkdown(`*Last sync: ${liveQuotaState.lastSyncTime} • Status: ${liveBadgeEn}*

---
`);
        tip.appendMarkdown(`🧠 **Context Saturation**: **${contextState.saturationFormatted}** / 1024K (\`${contextState.stageNameEn}\`)
`);
        tip.appendMarkdown(`- 💎 **Session Total: ${tokenAnalyticsState.activeTotalFormatted}** (\`${tokenAnalyticsState.activeTotalExact}\` Tokens) ｜ 📈 Turns: **${tokenAnalyticsState.activeRequests}**
`);
        tip.appendMarkdown(`- 📥 Input: **${tokenAnalyticsState.activeInputFormatted}** (\`${tokenAnalyticsState.activeInputExact}\`) ｜ ⚡ Cache: **${tokenAnalyticsState.activeCachedPercent}**
`);
        tip.appendMarkdown(`- 📤 Output: **${tokenAnalyticsState.activeOutputFormatted}** (\`${tokenAnalyticsState.activeOutputExact}\` Code & Traces)
`);
        tip.appendMarkdown(`- 🌐 **Machine Global Total: ${tokenAnalyticsState.globalTotalFormatted}** (\`${tokenAnalyticsState.globalTotalExact}\` Tokens / ${tokenAnalyticsState.globalConvsCount} sessions)

---
`);
        tip.appendMarkdown(`✨ **Google Gemini Suite (7-Day & 5h Windows)**
`);
        tip.appendMarkdown(`- 7-Day Limit Remaining: **${gW}** ｜ Reset: \`${liveQuotaState.gemini.weeklyResetTimeEn}\`
`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${g5}** ｜ Status/Reset: \`${liveQuotaState.gemini.fiveHourResetTimeEn}\`

`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT Suite (7-Day & 5h Windows)**
`);
        tip.appendMarkdown(`- 7-Day Limit Remaining: **${cW}** ｜ Reset: \`${liveQuotaState.claude.weeklyResetTimeEn}\`
`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${c5}** ｜ Status/Reset: \`${liveQuotaState.claude.fiveHourResetTimeEn}\`

---
`);
        tip.appendMarkdown(`⚡ **Live Generation Velocity**
`);
        tip.appendMarkdown(`- 🚀 **Live Generation Speed**: **${liveSpeedState.isStreaming ? liveSpeedState.currentTps + ' Tokens/s (🟢 Streaming)' : '0 Tokens/s (💤 Idle)'}**
`);
        tip.appendMarkdown(`- 🏆 **Peak Burst Speed**: **${liveSpeedState.peakTps} Tokens/s**
`);
        tip.appendMarkdown(`- ⏱️ Local Latency: \`${liveSpeedState.latencyMs}ms\`

---
`);
        tip.appendMarkdown(`[⚡ 提炼上下文](command:agPrivateCockpit.compactContext) | [🔄 Refresh](command:agPrivateCockpit.refresh) | [🖥️ Dashboard](command:agPrivateCockpit.openDashboard) | [🌐 中文](command:agPrivateCockpit.toggleLang) | [⚙️ Settings](command:agPrivateCockpit.openNativeSettings)`);
    }
    return tip;
}

function renderStatusBar(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState) {
    if (!sbGIcon || !sbGWeekVal || !sbG5h || !sbCIcon || !sbCWeekVal || !sbC5h || !sbSpeedIcon || !sbSpeedVal || !sbContextItem) return;

    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const showGemini  = cfg.get('showGemini', true);
    const showClaude  = cfg.get('showClaude', true);
    const showSpeed   = cfg.get('showTokenSpeed', true);
    const showContext = cfg.get('showContextSaturation', true);
    const customCap   = cfg.get('contextWindowLimit', 1048576);
    const compact     = cfg.get('compactStatusBar', false);
    const warnPct     = cfg.get('warningThreshold', 50);
    const critPct     = cfg.get('criticalThreshold', 20);

    const gW = liveQuotaState.gemini.weeklyPercent;
    const g5 = liveQuotaState.gemini.fiveHourPercent;
    const cW = liveQuotaState.claude.weeklyPercent;
    const c5 = liveQuotaState.claude.fiveHourPercent;

        let wsRoot = undefined;
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        wsRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    const activeEditorPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : null;
    const subproject = resolveActiveSubproject(wsRoot, activeEditorPath);
    const contextState = computeContextSaturation(tokenAnalyticsState, customCap, undefined, subproject.path);
    const tip = buildUnifiedTooltip(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState, contextState);

    // 1. Google Gemini
    if (showGemini) {
        sbGIcon.text = `$(gemini-icon)`;
        sbGIcon.color = '#38bdf8';
        sbGIcon.tooltip = tip;
        sbGIcon.show();

        sbGWeekVal.text = gW !== null ? `${gW}%` : (liveQuotaState.isLoading ? `...` : `--%`);
        sbGWeekVal.color = getNumberAlertColor(gW, warnPct, critPct);
        sbGWeekVal.tooltip = tip;
        sbGWeekVal.show();

        if (compact) {
            sbG5h.hide();
        } else {
            const g5Str = g5 !== null ? `${g5}%` : (liveQuotaState.isLoading ? `...` : `--%`);
            sbG5h.text = `(5h:${g5Str})`;
            sbG5h.color = getNumberAlertColor(g5, warnPct, critPct);
            sbG5h.tooltip = tip;
            sbG5h.show();
        }
    } else {
        sbGIcon.hide();
        sbGWeekVal.hide();
        sbG5h.hide();
    }

    // 2. Claude & GPT
    if (showClaude) {
        sbCIcon.text = `$(claude-icon)`;
        sbCIcon.color = '#da7756';
        sbCIcon.tooltip = tip;
        sbCIcon.show();

        sbCWeekVal.text = cW !== null ? `${cW}%` : (liveQuotaState.isLoading ? `...` : `--%`);
        sbCWeekVal.color = getNumberAlertColor(cW, warnPct, critPct);
        sbCWeekVal.tooltip = tip;
        sbCWeekVal.show();

        if (compact) {
            sbC5h.hide();
        } else {
            const c5Str = c5 !== null ? `${c5}%` : (liveQuotaState.isLoading ? `...` : `--%`);
            sbC5h.text = `(5h:${c5Str})`;
            sbC5h.color = getNumberAlertColor(c5, warnPct, critPct);
            sbC5h.tooltip = tip;
            sbC5h.show();
        }
    } else {
        sbCIcon.hide();
        sbCWeekVal.hide();
        sbC5h.hide();
    }

    // 3. Speed
    if (showSpeed) {
        sbSpeedIcon.text = `$(zap)`;
        sbSpeedIcon.color = liveSpeedState.isStreaming ? '#38bdf8' : '#8b949e';
        sbSpeedIcon.tooltip = tip;
        sbSpeedIcon.show();

        if (liveSpeedState.isStreaming) {
            sbSpeedVal.text = `${liveSpeedState.currentTps} t/s`;
            sbSpeedVal.color = '#38bdf8';
        } else {
            sbSpeedVal.text = `0 t/s`;
            sbSpeedVal.color = '#8b949e';
        }
        sbSpeedVal.tooltip = tip;
        sbSpeedVal.show();
    } else {
        sbSpeedIcon.hide();
        sbSpeedVal.hide();
    }

    // 4. 🧠 Clean, High-Precision Context Saturation Meter
    if (showContext) {
        sbContextItem.text = `🧠 ${contextState.saturationFormatted}`;
        sbContextItem.color = contextState.colorHex;
        sbContextItem.tooltip = buildContextTooltip(lang, contextState, tokenAnalyticsState);
        sbContextItem.show();
    } else {
        sbContextItem.hide();
    }
}

module.exports = {
    initStatusBarItems,
    renderStatusBar,
    buildUnifiedTooltip,
    buildContextTooltip,
    getNumberAlertColor
};
