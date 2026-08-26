//﻿​‌​​​​​‌​‌​‌​‌​‌​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​‌​​‌​​​‌​​​‌​​​‌‌​​​‌​‌‌​‌​‌​​​‌‌‌​‌‌‌​‌​‌​‌‌​​​​‌​‌‌​‌‌‌​​‌‌‌‌‌​​​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌‌‌​‌​​​‌‌​​​​​​‌‌​‌‌​​​‌‌​​​‌​​‌‌​‌​​​‌‌​​​​‌​‌‌​​​‌‌​‌‌​​​‌‌​​‌‌​​​​​‌‌​​​‌​​​‌‌‌​​​​‌‌​​‌​​​​‌‌​​​​​‌‌​​​‌​​‌‌​​​​‌​​‌‌​​​‌​​‌‌​​‌​‍
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const { getEffectiveLang } = require('./utils/i18n');
const { liveQuotaState, fetchLiveQuota } = require('./services/quotaService');
const { liveSpeedState, updateLiveSpeedEngine } = require('./services/speedEngine');
const { tokenAnalyticsState, computeLiveTokenAnalytics, initTokenScannerStorage } = require('./services/tokenScanner');
const { computeContextSaturation, createSessionSnapshot, resolveActiveSubproject, getContextState, initContextEngineStorage } = require('./services/contextEngine');
const { initStatusBarItems, renderStatusBar } = require('./ui/statusBar');
const { showDashboard, updateDashboardIfOpen, showQuickOverview } = require('./ui/dashboard');

let refreshTimer;
let speedTimer;
let currentLang = 'auto';

function activate(context) {
    console.log('[Antigravity Private Cockpit] v2.0.8 激活');

    // 🌟 1. 同步加载物理持久化高水位线 (彻底杜绝 Reload Window / 重启时的数值回退与闪烁)
    initTokenScannerStorage(context.globalState);
    initContextEngineStorage(context.globalState);

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
        // 📸 单击智能提炼上下文快照 (无侵入式落盘 + 自动弹窗提示 + 不强行打开文件)
        vscode.commands.registerCommand('agPrivateCockpit.compactContext', async () => {
            computeLiveTokenAnalytics();
            const isZh = currentLang === 'zh';

            // 1. 获取工作区根目录与当前激活文档
            let wsRoot = undefined;
            if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                wsRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
            }
            if (!wsRoot) {
                wsRoot = path.join(context.extensionPath, '..', '..');
            }

            const activeEditorPath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.uri.fsPath : null;

            // 2. 自动定位当前活跃子项目 (精准隔离至 projects/<name>/)
            const subproject = resolveActiveSubproject(wsRoot, activeEditorPath);

            // 3. 物理归档时间戳快照并同步子项目 memory.md 索引指针
            const snapshotRes = createSessionSnapshot(subproject.path, tokenAnalyticsState.activeConvId, tokenAnalyticsState, subproject.name);

            // 4. 重算上下文饱和度
            const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
            const customCap = cfg.get('contextWindowLimit', 1048576);
            computeContextSaturation(tokenAnalyticsState, customCap, undefined, subproject.path);

            // 4. 立即刷新状态栏与驾驶舱大屏 (重置为绿色安全基线)
            renderStatusBar(currentLang, liveQuotaState, liveSpeedState, tokenAnalyticsState);
            updateDashboardIfOpen(liveQuotaState, liveSpeedState, tokenAnalyticsState, currentLang);

            // 5. 轻量提示 (自动消失，不强行弹开文件打断用户)
            const msg = isZh
                ? `📸 会话上下文已提炼成功！已归档至: ${snapshotRes.relDisplayPath}`
                : `📸 Session context successfully refined! Archived to: ${snapshotRes.relDisplayPath}`;

            vscode.window.showInformationMessage(msg);
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

    // 4. 1.5 秒 SQLite-WAL 亚秒级流速与 Token 增量实时感知定时器
    speedTimer = setInterval(() => {
        updateLiveSpeedEngine();
        computeLiveTokenAnalytics(); // 🌟 实时计算最新会话物理增长与上下文额度变化
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
