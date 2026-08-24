const vscode = require('vscode');

let sbGIcon, sbGWeekVal, sbG5h;
let sbCIcon, sbCWeekVal, sbC5h;
let sbSpeedIcon, sbSpeedVal;

function initStatusBarItems(context, onClickCommand) {
    sbGIcon    = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
    sbGWeekVal = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9999);
    sbG5h      = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9998);

    sbCIcon    = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9997);
    sbCWeekVal = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9996);
    sbC5h      = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9995);

    sbSpeedIcon = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9994);
    sbSpeedVal  = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9993);

    const allItems = [sbGIcon, sbGWeekVal, sbG5h, sbCIcon, sbCWeekVal, sbC5h, sbSpeedIcon, sbSpeedVal];
    allItems.forEach(item => {
        item.command = onClickCommand || 'agPrivateCockpit.openDashboard';
        context.subscriptions.push(item);
    });
}

function getNumberAlertColor(pct, warnPct, critPct) {
    if (pct === null || pct === undefined) return undefined;
    if (pct < critPct) return '#ef4444';
    if (pct < warnPct) return '#f59e0b';
    return '#3fb950';
}

function buildUnifiedTooltip(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState) {
    const isZh = lang === 'zh';
    const tip = new vscode.MarkdownString();
    tip.isTrusted = true;

    const gW = liveQuotaState.gemini.weeklyPercent !== null ? `${liveQuotaState.gemini.weeklyPercent}%` : '--%';
    const g5 = liveQuotaState.gemini.fiveHourPercent !== null ? `${liveQuotaState.gemini.fiveHourPercent}%` : '--%';
    const cW = liveQuotaState.claude.weeklyPercent !== null ? `${liveQuotaState.claude.weeklyPercent}%` : '--%';
    const c5 = liveQuotaState.claude.fiveHourPercent !== null ? `${liveQuotaState.claude.fiveHourPercent}%` : '--%';

    const speedDesc = liveSpeedState.isStreaming
        ? `🟢 生成中: **${liveSpeedState.currentTps} t/s**`
        : `💤 待机就绪: **0 t/s** ｜ 上次峰值: **${liveSpeedState.peakTps} t/s**`;

    if (isZh) {
        const liveBadgeZh = liveQuotaState.isLive ? '🟢 官方原生实时同频' : (liveQuotaState.isLoading ? '🔄 正在同步...' : '⚡ 本地连接就绪');
        tip.appendMarkdown(`### 🛸 Antigravity 隐私配额驾驶舱\n\n`);
        tip.appendMarkdown(`*最后同步: ${liveQuotaState.lastSyncTime} • 状态: ${liveBadgeZh}*\n\n---\n`);
        tip.appendMarkdown(`📊 **当前活跃会话 Token 审计 (ID: ${tokenAnalyticsState.activeConvShort})**\n`);
        tip.appendMarkdown(`- 💎 **当前会话总吞吐: ${tokenAnalyticsState.activeTotalFormatted}** (\`${tokenAnalyticsState.activeTotalExact}\` Tokens) ｜ 📈 交互: **${tokenAnalyticsState.activeRequests}轮**\n`);
        tip.appendMarkdown(`- 📥 输入: **${tokenAnalyticsState.activeInputFormatted}** (\`${tokenAnalyticsState.activeInputExact}\`) ｜ ⚡ 缓存率: **${tokenAnalyticsState.activeCachedPercent}**\n`);
        tip.appendMarkdown(`- 📤 输出: **${tokenAnalyticsState.activeOutputFormatted}** (\`${tokenAnalyticsState.activeOutputExact}\` 真实代码与思考)\n`);
        tip.appendMarkdown(`- 🌐 **本机全局历史累计: ${tokenAnalyticsState.globalTotalFormatted}** (\`${tokenAnalyticsState.globalTotalExact}\` Tokens / 共 ${tokenAnalyticsState.globalConvsCount} 个会话)\n\n---\n`);
        tip.appendMarkdown(`✨ **Google Gemini 原生系列 (周周期 & 5h冲刺)**\n`);
        tip.appendMarkdown(`- 7天周期剩余: **${gW}** ｜ 满额重置: \`${liveQuotaState.gemini.weeklyResetTimeZh}\`\n`);
        tip.appendMarkdown(`- 5小时冲刺剩余: **${g5}** ｜ 状态/刷新: \`${liveQuotaState.gemini.fiveHourResetTimeZh}\`\n\n`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT 系列 (周周期 & 5h冲刺)**\n`);
        tip.appendMarkdown(`- 7天周期剩余: **${cW}** ｜ 满额重置: \`${liveQuotaState.claude.weeklyResetTimeZh}\`\n`);
        tip.appendMarkdown(`- 5小时冲刺剩余: **${c5}** ｜ 状态/刷新: \`${liveQuotaState.claude.fiveHourResetTimeZh}\`\n\n---\n`);
        tip.appendMarkdown(`⚡ **实时流式响应测速**\n`);
        tip.appendMarkdown(`- 状态: ${speedDesc} ｜ 本地 IPC 延迟: \`${liveSpeedState.latencyMs}ms\`\n\n---\n`);
        tip.appendMarkdown(`[🔄 立即刷新](command:agPrivateCockpit.refresh) | [🖥️ 打开驾驶舱](command:agPrivateCockpit.openDashboard) | [🌐 English](command:agPrivateCockpit.toggleLang) | [⚙️ 设置](command:agPrivateCockpit.openNativeSettings)`);
    } else {
        const liveBadgeEn = liveQuotaState.isLive ? '🟢 Native Live Synced' : (liveQuotaState.isLoading ? '🔄 Syncing...' : '⚡ Local Ready');
        const speedDescEn = liveSpeedState.isStreaming
            ? `🟢 Streaming: **${liveSpeedState.currentTps} t/s**`
            : `💤 Idle: **0 t/s** ｜ Peak: **${liveSpeedState.peakTps} t/s**`;

        tip.appendMarkdown(`### 🛸 Antigravity Private Quota Cockpit\n\n`);
        tip.appendMarkdown(`*Last sync: ${liveQuotaState.lastSyncTime} • Status: ${liveBadgeEn}*\n\n---\n`);
        tip.appendMarkdown(`📊 **Active Session Tokens (ID: ${tokenAnalyticsState.activeConvShort})**\n`);
        tip.appendMarkdown(`- 💎 **Session Total: ${tokenAnalyticsState.activeTotalFormatted}** (\`${tokenAnalyticsState.activeTotalExact}\` Tokens) ｜ 📈 Turns: **${tokenAnalyticsState.activeRequests}**\n`);
        tip.appendMarkdown(`- 📥 Input: **${tokenAnalyticsState.activeInputFormatted}** (\`${tokenAnalyticsState.activeInputExact}\`) ｜ ⚡ Cache: **${tokenAnalyticsState.activeCachedPercent}**\n`);
        tip.appendMarkdown(`- 📤 Output: **${tokenAnalyticsState.activeOutputFormatted}** (\`${tokenAnalyticsState.activeOutputExact}\` Code & Traces)\n`);
        tip.appendMarkdown(`- 🌐 **Machine Global Total: ${tokenAnalyticsState.globalTotalFormatted}** (\`${tokenAnalyticsState.globalTotalExact}\` Tokens / ${tokenAnalyticsState.globalConvsCount} sessions)\n\n---\n`);
        tip.appendMarkdown(`✨ **Google Gemini Suite (7-Day & 5h Windows)**\n`);
        tip.appendMarkdown(`- 7-Day Limit Remaining: **${gW}** ｜ Reset: \`${liveQuotaState.gemini.weeklyResetTimeEn}\`\n`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${g5}** ｜ Status/Reset: \`${liveQuotaState.gemini.fiveHourResetTimeEn}\`\n\n`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT Suite (7-Day & 5h Windows)**\n`);
        tip.appendMarkdown(`- 7-Day Limit Remaining: **${cW}** ｜ Reset: \`${liveQuotaState.claude.weeklyResetTimeEn}\`\n`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${c5}** ｜ Status/Reset: \`${liveQuotaState.claude.fiveHourResetTimeEn}\`\n\n`);
        tip.appendMarkdown(`⚡ **Live Generation Velocity**\n`);
        tip.appendMarkdown(`- Status: ${speedDescEn} ｜ Local Latency: \`${liveSpeedState.latencyMs}ms\`\n\n---\n`);
        tip.appendMarkdown(`[🔄 Refresh](command:agPrivateCockpit.refresh) | [🖥️ Dashboard](command:agPrivateCockpit.openDashboard) | [🌐 中文](command:agPrivateCockpit.toggleLang) | [⚙️ Settings](command:agPrivateCockpit.openNativeSettings)`);
    }
    return tip;
}

function renderStatusBar(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState) {
    if (!sbGIcon || !sbGWeekVal || !sbG5h || !sbCIcon || !sbCWeekVal || !sbC5h || !sbSpeedIcon || !sbSpeedVal) return;

    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const showGemini = cfg.get('showGemini', true);
    const showClaude = cfg.get('showClaude', true);
    const showSpeed  = cfg.get('showTokenSpeed', true);
    const compact    = cfg.get('compactStatusBar', false);
    const warnPct    = cfg.get('warningThreshold', 50);
    const critPct    = cfg.get('criticalThreshold', 20);

    const gW = liveQuotaState.gemini.weeklyPercent;
    const g5 = liveQuotaState.gemini.fiveHourPercent;
    const cW = liveQuotaState.claude.weeklyPercent;
    const c5 = liveQuotaState.claude.fiveHourPercent;

    const tip = buildUnifiedTooltip(lang, liveQuotaState, liveSpeedState, tokenAnalyticsState);

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
}

module.exports = {
    initStatusBarItems,
    renderStatusBar,
    buildUnifiedTooltip,
    getNumberAlertColor
};
