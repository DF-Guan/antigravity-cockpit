const vscode = require('vscode');
const { getEffectiveLang } = require('./utils/i18n');
const { liveQuotaState, fetchLiveQuota } = require('./services/quotaService');
const { liveSpeedState, updateLiveSpeedEngine } = require('./services/speedEngine');
const { tokenAnalyticsState, computeLiveTokenAnalytics } = require('./services/tokenScanner');
const { computeContextSaturation, generateCompactPrompt } = require('./services/contextEngine');
const { initStatusBarItems, renderStatusBar } = require('./ui/statusBar');
const { showDashboard, updateDashboardIfOpen, showQuickOverview } = require('./ui/dashboard');

let refreshTimer;
let speedTimer;
let currentLang = 'auto';

function activate(context) {
    console.log('[Antigravity Private Cockpit] v1.0.54 动态圆圈上下文饱和度与 /compact 引擎就绪');

    currentLang = context.globalState.get('agPrivateCockpit.lang', getEffectiveLang());
    computeLiveTokenAnalytics();

    const lastSavedState = context.globalState.get('agPrivateCockpit.lastLiveState', null);
    if (lastSavedState && lastSavedState.gemini && lastSavedState.claude) {
        Object.assign(liveQuotaState, lastSavedState);
        liveQuotaState.isLoading = false;
    }

    // 1. 初始化状态栏槽位
    initStatusBarItems(context, 'agPrivateCockpit.openDashboard');

    // 2. 注册核心交互指令
    context.subscriptions.push(
        vscode.commands.registerCommand('agPrivateCockpit.openDashboard', () => {
            showDashboard(context, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, (cmd) => {
                if (cmd === 'refresh') fetchAndRefresh(context, true);
                else if (cmd === 'openSettings') vscode.commands.executeCommand('agPrivateCockpit.openNativeSettings');
                else if (cmd === 'toggleLang') setLanguage(context, currentLang === 'zh' ? 'en' : 'zh');
                else if (cmd === 'compact') vscode.commands.executeCommand('agPrivateCockpit.compactContext');
            });
        }),
        vscode.commands.registerCommand('agPrivateCockpit.quickOverview', () => {
            showQuickOverview(context, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, {
                onOpenDashboard: () => vscode.commands.executeCommand('agPrivateCockpit.openDashboard'),
                onToggleLang: () => setLanguage(context, currentLang === 'zh' ? 'en' : 'zh'),
                onOpenSettings: () => vscode.commands.executeCommand('agPrivateCockpit.openNativeSettings'),
                onRefresh: () => fetchAndRefresh(context, true),
                onCompact: () => vscode.commands.executeCommand('agPrivateCockpit.compactContext')
            });
        }),
        vscode.commands.registerCommand('agPrivateCockpit.compactContext', async () => {
            computeLiveTokenAnalytics();
            const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
            const customCap = cfg.get('contextWindowLimit', 1048576);
            const ctxState = computeContextSaturation(tokenAnalyticsState.activeTotalNum, customCap, tokenAnalyticsState.activeRequests);
            const isZh = currentLang === 'zh';

            const items = [
                {
                    label: isZh ? '$(clippy) ⚡ 一键复制 /compact 智能压缩提示词 (推荐)' : '$(clippy) ⚡ Copy /compact Compaction Prompt (Recommended)',
                    description: isZh ? `${ctxState.expression} ${ctxState.saturationFormatted} • 提炼会话决策并释放上下文注意力` : `${ctxState.expression} ${ctxState.saturationFormatted} • Extract key memory & reset attention`,
                    action: 'copy'
                },
                {
                    label: isZh ? '$(file-text) 💾 导出当前会话快照存档 (Markdown)' : '$(file-text) 💾 Export Session Snapshot (Markdown)',
                    description: isZh ? `保存当前 ${tokenAnalyticsState.activeTotalFormatted} Tokens 的架构与进度快照` : `Save architecture & progress snapshot (${tokenAnalyticsState.activeTotalFormatted})`,
                    action: 'export'
                },
                {
                    label: isZh ? '$(dashboard) 🛸 打开驾驶舱大屏查看完整健康度' : '$(dashboard) 🛸 Open Dashboard to View Context Health',
                    description: isZh ? `查看 4 宫格、会话清单与实时流速` : `View 4-grid metrics, session list & live speed`,
                    action: 'dashboard'
                }
            ];

            const pick = await vscode.window.showQuickPick(items, {
                placeHolder: isZh 
                    ? `🧠 当前会话上下文占用: ${ctxState.expression} ${ctxState.ringIcon} ${ctxState.saturationFormatted} (${ctxState.stageNameZh})`
                    : `🧠 Active Context Saturation: ${ctxState.expression} ${ctxState.ringIcon} ${ctxState.saturationFormatted} (${ctxState.stageNameEn})`
            });

            if (!pick) return;

            if (pick.action === 'copy') {
                const prompt = generateCompactPrompt(tokenAnalyticsState.activeConvId, tokenAnalyticsState);
                await vscode.env.clipboard.writeText(prompt);
                vscode.window.showInformationMessage(
                    isZh 
                        ? `🎉 /compact 智能压缩提示词已复制到剪贴板！直接粘贴给 AI 对话框即可重置会话注意力！`
                        : `🎉 /compact prompt copied to clipboard! Paste it into the AI chat to reset attention.`
                );
            } else if (pick.action === 'export') {
                const prompt = generateCompactPrompt(tokenAnalyticsState.activeConvId, tokenAnalyticsState);
                const doc = await vscode.workspace.openTextDocument({ content: prompt, language: 'markdown' });
                await vscode.window.showTextDocument(doc);
            } else if (pick.action === 'dashboard') {
                vscode.commands.executeCommand('agPrivateCockpit.openDashboard');
            }
        }),
        vscode.commands.registerCommand('agPrivateCockpit.refresh', () => fetchAndRefresh(context, true)),
        vscode.commands.registerCommand('agPrivateCockpit.toggleLang', () => {
            setLanguage(context, currentLang === 'zh' ? 'en' : 'zh');
        }),
        vscode.commands.registerCommand('agPrivateCockpit.openNativeSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', '@ext:DF-Guan.antigravity-cockpit');
        })
    );

    // 3. 全局配置热监听
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('agPrivateCockpit')) {
                if (e.affectsConfiguration('agPrivateCockpit.defaultLanguage')) {
                    currentLang = getEffectiveLang();
                    context.globalState.update('agPrivateCockpit.lang', currentLang);
                }
                restartAutoRefresh(context);
                renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
                updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);
            }
        })
    );

    renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
    fetchAndRefresh(context, false);
    restartAutoRefresh(context);

    // 4. 1.5 秒 SQLite-WAL 亚秒级流速感知定时器
    speedTimer = setInterval(() => {
        updateLiveSpeedEngine();
        renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
        updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);
    }, 1500);
    context.subscriptions.push({ dispose: () => { if (speedTimer) clearInterval(speedTimer); } });
}

async function fetchAndRefresh(context, manual = false) {
    computeLiveTokenAnalytics();
    await fetchLiveQuota(context, liveSpeedState, tokenAnalyticsState);
    renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
    updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);

    if (manual) {
        const isZh = currentLang === 'zh';
        const statusText = liveQuotaState.isLive 
            ? (isZh ? '🟢 原生实时数据同步成功' : '🟢 Native live quota synced') 
            : (isZh ? '⚡ 配额已更新' : '⚡ Quota updated');
        vscode.window.showInformationMessage(`[Antigravity Private Cockpit] ${statusText} (${liveQuotaState.lastSyncTime})`);
    }
}

function restartAutoRefresh(context) {
    if (refreshTimer) clearInterval(refreshTimer);
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const interval = Math.max(5, cfg.get('refreshIntervalSeconds', 15)) * 1000;
    refreshTimer = setInterval(() => fetchAndRefresh(context, false), interval);
    if (context && !context._cockpitDisposeAdded) {
        context._cockpitDisposeAdded = true;
        context.subscriptions.push({ dispose: () => { 
            if (refreshTimer) clearInterval(refreshTimer); 
        } });
    }
}

function setLanguage(context, lang) {
    currentLang = lang;
    context.globalState.update('agPrivateCockpit.lang', lang);
    renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
    updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);
    vscode.window.showInformationMessage(lang === 'zh' ? '🌐 已切换至中文' : '🌐 Switched to English');
}

function deactivate() {
    if (refreshTimer) clearInterval(refreshTimer);
    if (speedTimer) clearInterval(speedTimer);
}

module.exports = { activate, deactivate };
