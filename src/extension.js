const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { getEffectiveLang } = require('./utils/i18n');
const { liveQuotaState, fetchLiveQuota } = require('./services/quotaService');
const { liveSpeedState, updateLiveSpeedEngine, initSpeedEngineStorage } = require('./services/speedEngine');
const { tokenAnalyticsState, computeLiveTokenAnalytics, initTokenScannerStorage } = require('./services/tokenScanner');
const { initStatusBarItems, renderStatusBar } = require('./ui/statusBar');
const { showDashboard, updateDashboardIfOpen, showQuickOverview } = require('./ui/dashboard');

let refreshTimer;
let speedTimer;
let currentLang = 'auto';

function activate(context) {
    console.log('[Antigravity Private Cockpit] v2.1.11 激活');

    // 🌟 1. 同步加载物理持久化高水位线 (彻底杜绝 Reload Window / 重启时的数值回退与闪烁)
    initTokenScannerStorage(context.globalState);
    initSpeedEngineStorage(context.globalState);

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
                else if (cmd === 'openOfficialModelsDoc') vscode.env.openExternal(vscode.Uri.parse('https://antigravity.google/docs/models'));
            });
        }),
        vscode.commands.registerCommand('agPrivateCockpit.quickOverview', () => {
            showQuickOverview(context, liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, {
                onOpenDashboard: () => vscode.commands.executeCommand('agPrivateCockpit.openDashboard'),
                onToggleLang: () => setLanguage(context, currentLang === 'zh' ? 'en' : 'zh'),
                onOpenSettings: () => vscode.commands.executeCommand('agPrivateCockpit.openNativeSettings'),
                onRefresh: () => fetchAndRefresh(context, true)
            });
        }),
        vscode.commands.registerCommand('agPrivateCockpit.refresh', () => fetchAndRefresh(context, true)),
        vscode.commands.registerCommand('agPrivateCockpit.toggleLang', () => {
            setLanguage(context, currentLang === 'zh' ? 'en' : 'zh');
        }),
        vscode.commands.registerCommand('agPrivateCockpit.openNativeSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', '@ext:DF-Guan.antigravity-cockpit');
        }),
        vscode.commands.registerCommand('agPrivateCockpit.openModelsDoc', () => {
            vscode.env.openExternal(vscode.Uri.parse('https://antigravity.google/docs/models'));
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
                updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, true);
            }
        })
    );

    renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
    fetchAndRefresh(context, false);
    restartAutoRefresh(context);

    // 4. 1.5 秒 SQLite-WAL 亚秒级流速与 Token 增量实时感知定时器
    speedTimer = setInterval(() => {
        updateLiveSpeedEngine();
        computeLiveTokenAnalytics(); // 🌟 实时计算最新会话物理增长与流速变化
        renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
        updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, false);
    }, 1500);
    context.subscriptions.push({ dispose: () => { if (speedTimer) clearInterval(speedTimer); } });
}

async function fetchAndRefresh(context, manual = false) {
    computeLiveTokenAnalytics();
    await fetchLiveQuota(context, liveSpeedState, tokenAnalyticsState);
    renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
    updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, true);

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
    updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang, true);
    vscode.window.showInformationMessage(lang === 'zh' ? '🌐 已切换至中文' : '🌐 Switched to English');
}

function deactivate() {
    if (refreshTimer) clearInterval(refreshTimer);
    if (speedTimer) clearInterval(speedTimer);
}

module.exports = { activate, deactivate };