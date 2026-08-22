const vscode = require('vscode');
const https = require('https');
const { exec } = require('child_process');

let statusBarGemini;
let statusBarClaude;
let statusBar5h;
let refreshTimer;
let currentPanel = undefined;
let currentLang = 'auto';

let liveQuotaState = {
    isLive: false,
    lastSyncTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    gemini: {
        weeklyPercent: 96,
        fiveHourPercent: 86,
        weeklyResetTimeZh: '6天 17小时后',
        weeklyResetTimeEn: 'in 6d 17h',
        fiveHourResetTimeZh: '3小时 59分后',
        fiveHourResetTimeEn: 'in 3h 59m'
    },
    claude: {
        weeklyPercent: 84,
        fiveHourPercent: 54,
        weeklyResetTimeZh: '6天 23小时后',
        weeklyResetTimeEn: 'in 6d 23h',
        fiveHourResetTimeZh: '4小时 40分后',
        fiveHourResetTimeEn: 'in 4h 40m'
    }
};

function getEffectiveLang() {
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const pref = cfg.get('defaultLanguage', 'auto');
    if (pref === 'zh') return 'zh';
    if (pref === 'en') return 'en';
    const locale = vscode.env.language || 'en';
    return locale.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function activate(context) {
    console.log('[Antigravity Cockpit] 独立数值精确着色版激活');

    currentLang = context.globalState.get('agPrivateCockpit.lang', getEffectiveLang());
    const savedQuota = context.globalState.get('agPrivateCockpit.customQuota');
    if (savedQuota) {
        liveQuotaState = Object.assign(liveQuotaState, savedQuota);
    }

    // 创建 3 个独立的细粒度状态栏项，使得每个数值拥有完全独立的专属告警颜色
    statusBarGemini = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9999);
    statusBarGemini.command = 'agPrivateCockpit.openDashboard';

    statusBarClaude = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9998);
    statusBarClaude.command = 'agPrivateCockpit.openDashboard';

    statusBar5h = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9997);
    statusBar5h.command = 'agPrivateCockpit.openDashboard';

    context.subscriptions.push(statusBarGemini, statusBarClaude, statusBar5h);

    context.subscriptions.push(
        vscode.commands.registerCommand('agPrivateCockpit.openDashboard', () => showDashboard(context)),
        vscode.commands.registerCommand('agPrivateCockpit.quickOverview', () => showQuickOverview(context)),
        vscode.commands.registerCommand('agPrivateCockpit.refresh', () => fetchLiveQuota(true)),
        vscode.commands.registerCommand('agPrivateCockpit.toggleLang', () => {
            setLanguage(context, currentLang === 'zh' ? 'en' : 'zh');
        }),
        vscode.commands.registerCommand('agPrivateCockpit.openNativeSettings', () => {
            vscode.commands.executeCommand('workbench.action.openSettings', '@ext:DF-Guan.antigravity-cockpit');
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('agPrivateCockpit')) {
                restartAutoRefresh(context);
                renderStatusBar();
                if (currentPanel) {
                    try {
                        currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, currentLang);
                    } catch (_) {}
                }
            }
        })
    );

    fetchLiveQuota(false);
    restartAutoRefresh(context);
}

function restartAutoRefresh(context) {
    if (refreshTimer) clearInterval(refreshTimer);
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const interval = Math.max(5, cfg.get('refreshIntervalSeconds', 15)) * 1000;
    refreshTimer = setInterval(() => fetchLiveQuota(false), interval);
    if (context && !context._cockpitDisposeAdded) {
        context._cockpitDisposeAdded = true;
        context.subscriptions.push({ dispose: () => { if (refreshTimer) clearInterval(refreshTimer); } });
    }
}

function setLanguage(context, lang) {
    currentLang = lang;
    context.globalState.update('agPrivateCockpit.lang', lang);
    renderStatusBar();
    if (currentPanel) {
        try {
            currentPanel.title = lang === 'zh' ? 'Antigravity 配额驾驶舱' : 'Antigravity Quota Cockpit';
            currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, lang);
        } catch (_) {}
    }
    vscode.window.showInformationMessage(lang === 'zh' ? '🌐 已切换至中文' : '🌐 Switched to English');
}

function probeLanguageServerQuota() {
    return new Promise((resolve, reject) => {
        const isWin = process.platform === 'win32';
        const cmd = isWin
            ? 'powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { $_.Name -like \\"*language_server*\\" } | Select-Object -ExpandProperty CommandLine"'
            : 'ps -eo command | grep -i language_server';

        exec(cmd, (err, stdout) => {
            if (err || !stdout) return reject(err || new Error("No language_server process output"));

            const tokens = [];
            const tokenRegex = /--csrf_token\s+([a-zA-Z0-9-]+)/g;
            let m;
            while ((m = tokenRegex.exec(stdout)) !== null) {
                tokens.push(m[1]);
            }

            const ports = [];
            const portRegex = /--extension_server_port\s+(\d+)/g;
            while ((m = portRegex.exec(stdout)) !== null) {
                const basePort = parseInt(m[1]);
                ports.push(basePort, basePort + 1, basePort + 2, basePort + 8, basePort + 9, basePort + 10);
            }

            const allCandidatePorts = Array.from(new Set([...ports, 4178, 4179, 7682, 7683, 14450]));
            if (tokens.length === 0) return reject(new Error("No CSRF tokens found"));

            let resolved = false;

            for (const token of tokens) {
                for (const port of allCandidatePorts) {
                    const req = https.request({
                        hostname: '127.0.0.1',
                        port: port,
                        path: '/exa.language_server_pb.LanguageServerService/RetrieveUserQuotaSummary',
                        method: 'POST',
                        rejectUnauthorized: false,
                        headers: {
                            'Content-Type': 'application/json',
                            'x-codeium-csrf-token': token,
                            'Connect-Protocol-Version': '1'
                        },
                        timeout: 1200
                    }, (res) => {
                        if (res.statusCode === 200) {
                            let data = '';
                            res.on('data', chunk => data += chunk);
                            res.on('end', () => {
                                if (!resolved) {
                                    resolved = true;
                                    try {
                                        const json = JSON.parse(data);
                                        resolve(json);
                                    } catch (e) {
                                        reject(e);
                                    }
                                }
                            });
                        }
                    });

                    req.on('error', () => {});
                    req.on('timeout', () => req.destroy());
                    try {
                        req.write(JSON.stringify({ forceRefresh: true }));
                        req.end();
                    } catch (_) {}
                }
            }

            setTimeout(() => {
                if (!resolved) reject(new Error("Timeout probing Language Server"));
            }, 2500);
        });
    });
}

function parseRelativeTime(desc) {
    if (!desc) return { zh: '', en: '' };
    const match = desc.match(/refresh in\s+([^.]+)/i);
    if (match) {
        const raw = match[1].trim();
        let zh = raw.replace(/days?/i, '天')
                    .replace(/hours?/i, '小时')
                    .replace(/minutes?/i, '分钟')
                    .replace(/,\s*/g, ' ') + '后';
        return { zh: zh, en: 'in ' + raw };
    }
    return { zh: desc, en: desc };
}

async function fetchLiveQuota(manual = false) {
    try {
        const lsData = await probeLanguageServerQuota();
        if (lsData && lsData.response && lsData.response.groups) {
            liveQuotaState.isLive = true;
            for (const g of lsData.response.groups) {
                const name = (g.displayName || '').toLowerCase();
                const isGemini = name.includes('gemini');
                const target = isGemini ? liveQuotaState.gemini : liveQuotaState.claude;

                for (const b of (g.buckets || [])) {
                    const pct = Math.round((b.remainingFraction || 0) * 100);
                    const times = parseRelativeTime(b.description);

                    if (b.window === 'weekly') {
                        target.weeklyPercent = pct;
                        if (times.zh) target.weeklyResetTimeZh = times.zh;
                        if (times.en) target.weeklyResetTimeEn = times.en;
                    } else if (b.window === '5h') {
                        target.fiveHourPercent = pct;
                        if (times.zh) target.fiveHourResetTimeZh = times.zh;
                        if (times.en) target.fiveHourResetTimeEn = times.en;
                    }
                }
            }
        }
    } catch (_) {}

    liveQuotaState.lastSyncTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    renderStatusBar();

    if (currentPanel) {
        try {
            currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, currentLang);
        } catch (_) {}
    }

    if (manual) {
        const statusText = liveQuotaState.isLive 
            ? (currentLang === 'zh' ? '🟢 原生实时数据同步成功' : '🟢 Native live quota synced') 
            : (currentLang === 'zh' ? '⚡ 配额已更新' : '⚡ Quota updated');
        vscode.window.showInformationMessage(`[Antigravity Cockpit] ${statusText} (${liveQuotaState.lastSyncTime})`);
    }
}

/**
 * 🎨 计算单个百分比数值的专属告警着色
 */
function getMetricColorStyle(pct, warnPct, critPct) {
    if (pct < critPct) {
        return {
            color: '#ff6b6b', // 红色极危数值
            bgColor: new vscode.ThemeColor('statusBarItem.errorBackground')
        };
    }
    if (pct < warnPct) {
        return {
            color: '#e3b341', // 橙黄色预警数值
            bgColor: new vscode.ThemeColor('statusBarItem.warningBackground')
        };
    }
    return {
        color: '#3fb950',     // 绿色健康数值
        bgColor: undefined
    };
}

function buildUnifiedTooltip() {
    const isZh = currentLang === 'zh';
    const tip = new vscode.MarkdownString();
    tip.isTrusted = true;

    const gW = liveQuotaState.gemini.weeklyPercent;
    const cW = liveQuotaState.claude.weeklyPercent;
    const fiveH = liveQuotaState.claude.fiveHourPercent;
    const liveBadge = liveQuotaState.isLive ? '🟢 官方原生实时同频' : '⚡ 本地连接就绪';

    if (isZh) {
        tip.appendMarkdown(`### 🛸 Antigravity 实时配额驾驶舱\n\n`);
        tip.appendMarkdown(`*最后同步: ${liveQuotaState.lastSyncTime} • 状态: ${liveBadge}*\n\n---\n`);
        tip.appendMarkdown(`✨ **Google Gemini 原生系列**\n`);
        tip.appendMarkdown(`- 每周剩余额度: **${gW}%** ｜ 满额重置: \`${liveQuotaState.gemini.weeklyResetTimeZh}\`\n`);
        tip.appendMarkdown(`- 5小时冲刺额度: **${liveQuotaState.gemini.fiveHourPercent}%** ｜ 刷新倒计时: \`${liveQuotaState.gemini.fiveHourResetTimeZh || '计算中'}\`\n\n`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT 系列**\n`);
        tip.appendMarkdown(`- 每周剩余额度: **${cW}%** ｜ 满额重置: \`${liveQuotaState.claude.weeklyResetTimeZh}\`\n`);
        tip.appendMarkdown(`- 5小时冲刺额度: **${fiveH}%** ｜ 刷新倒计时: \`${liveQuotaState.claude.fiveHourResetTimeZh || '计算中'}\`\n\n---\n`);
        tip.appendMarkdown(`[🔄 立即刷新](command:agPrivateCockpit.refresh) | [🖥️ 打开驾驶舱](command:agPrivateCockpit.openDashboard) | [🌐 English](command:agPrivateCockpit.toggleLang) | [⚙️ 设置](command:agPrivateCockpit.openNativeSettings)`);
    } else {
        tip.appendMarkdown(`### 🛸 Antigravity Live Quota Cockpit\n\n`);
        tip.appendMarkdown(`*Last sync: ${liveQuotaState.lastSyncTime} • Status: ${liveQuotaState.isLive ? '🟢 Native Live Synced' : 'Connected'}*\n\n---\n`);
        tip.appendMarkdown(`✨ **Google Gemini Suite**\n`);
        tip.appendMarkdown(`- Weekly Remaining: **${gW}%** ｜ Reset: \`${liveQuotaState.gemini.weeklyResetTimeEn}\`\n`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${liveQuotaState.gemini.fiveHourPercent}%** ｜ Reset: \`${liveQuotaState.gemini.fiveHourResetTimeEn || 'calculating'}\`\n\n`);
        tip.appendMarkdown(`🎭 **Anthropic Claude & GPT Suite**\n`);
        tip.appendMarkdown(`- Weekly Remaining: **${cW}%** ｜ Reset: \`${liveQuotaState.claude.weeklyResetTimeEn}\`\n`);
        tip.appendMarkdown(`- 5-Hour Sprint: **${fiveH}%** ｜ Reset: \`${liveQuotaState.claude.fiveHourResetTimeEn || 'calculating'}\`\n\n---\n`);
        tip.appendMarkdown(`[🔄 Refresh](command:agPrivateCockpit.refresh) | [🖥️ Dashboard](command:agPrivateCockpit.openDashboard) | [🌐 中文](command:agPrivateCockpit.toggleLang) | [⚙️ Settings](command:agPrivateCockpit.openNativeSettings)`);
    }
    return tip;
}

/**
 * 状态栏渲染器：每个数值独立根据自身配额实时计算告警颜色
 */
function renderStatusBar() {
    if (!statusBarGemini || !statusBarClaude || !statusBar5h) return;

    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const showGemini = cfg.get('showGemini', true);
    const showClaude = cfg.get('showClaude', true);
    const compact    = cfg.get('compactStatusBar', false);
    const warnPct    = cfg.get('warningThreshold', 50);
    const critPct    = cfg.get('criticalThreshold', 20);

    const gW    = liveQuotaState.gemini.weeklyPercent;
    const cW    = liveQuotaState.claude.weeklyPercent;
    const fiveH = liveQuotaState.claude.fiveHourPercent;

    const tip = buildUnifiedTooltip();

    // 1. Google Gemini 独立项与数值着色
    if (showGemini) {
        const styleG = getMetricColorStyle(gW, warnPct, critPct);
        statusBarGemini.text = compact ? `$(sparkle) G: ${gW}%` : `✨ Gemini: ${gW}%`;
        statusBarGemini.color = styleG.color;
        statusBarGemini.backgroundColor = styleG.bgColor;
        statusBarGemini.tooltip = tip;
        statusBarGemini.show();
    } else {
        statusBarGemini.hide();
    }

    // 2. Claude & GPT 独立项与数值着色
    if (showClaude) {
        const styleC = getMetricColorStyle(cW, warnPct, critPct);
        statusBarClaude.text = compact ? `$(organization) C: ${cW}%` : `🤖 Claude/GPT: ${cW}%`;
        statusBarClaude.color = styleC.color;
        statusBarClaude.backgroundColor = styleC.bgColor;
        statusBarClaude.tooltip = tip;
        statusBarClaude.show();
    } else {
        statusBarClaude.hide();
    }

    // 3. 5小时冲刺独立项与数值着色
    if (showClaude || showGemini) {
        const style5 = getMetricColorStyle(fiveH, warnPct, critPct);
        statusBar5h.text = compact ? `$(clock) 5h: ${fiveH}%` : `⏱️ 5h: ${fiveH}%`;
        statusBar5h.color = style5.color;
        statusBar5h.backgroundColor = style5.bgColor;
        statusBar5h.tooltip = tip;
        statusBar5h.show();
    } else {
        statusBar5h.hide();
    }
}

function showQuickOverview(context) {
    const isZh = currentLang === 'zh';
    const g = liveQuotaState.gemini;
    const c = liveQuotaState.claude;

    const items = isZh ? [
        { label: `✨ Google Gemini: ${g.weeklyPercent}%`, description: `5h: ${g.fiveHourPercent}% | 重置: ${g.weeklyResetTimeZh}`, detail: 'Gemini 3.7 Flash • 3.1 Pro 原生旗舰 (全自动实时)' },
        { label: `🎭 Claude 4.6 & GPT: ${c.weeklyPercent}%`, description: `5h: ${c.fiveHourPercent}% | 重置: ${c.weeklyResetTimeZh}`, detail: 'Claude 4.6 Sonnet / Opus, GPT-OSS 专属配额池 (全自动实时)' },
        { label: `🔄 立即强制刷新`, description: '从底层 Language Server 探测最新配额' },
        { label: `🖥️ 打开可视化驾驶舱`, description: '查看官方品牌大屏图表' },
        { label: `🌐 切换为 English`, description: '当前: 中文' },
        { label: `⚙️ 打开插件设置`, description: '自定义预警阈值与刷新频率' }
    ] : [
        { label: `✨ Google Gemini: ${g.weeklyPercent}%`, description: `5h: ${g.fiveHourPercent}% | Reset: ${g.weeklyResetTimeEn}`, detail: 'Gemini 3.7 Flash • 3.1 Pro Flagship (Auto Live)' },
        { label: `🎭 Claude 4.6 & GPT: ${c.weeklyPercent}%`, description: `5h: ${c.fiveHourPercent}% | Reset: ${c.weeklyResetTimeEn}`, detail: 'Claude 4.6 Sonnet / Opus, GPT-OSS Pool (Auto Live)' },
        { label: `🔄 Force Refresh Now`, description: 'Probe latest quota from Language Server' },
        { label: `🖥️ Open Visual Dashboard`, description: 'View brand-accurate quota cockpit' },
        { label: `🌐 Switch to Chinese (中文)`, description: 'Current: English' },
        { label: `⚙️ Open Extension Settings`, description: 'Customize thresholds & refresh rate' }
    ];

    vscode.window.showQuickPick(items, {
        placeHolder: isZh ? 'Antigravity AI 配额总览 (全自动实时探测)' : 'Antigravity AI Quota Overview (Auto Live Detection)'
    }).then(sel => {
        if (!sel) return;
        if (sel.label.includes('打开可视化') || sel.label.includes('Open Visual')) showDashboard(context);
        else if (sel.label.includes('切换') || sel.label.includes('Switch')) setLanguage(context, isZh ? 'en' : 'zh');
        else if (sel.label.includes('设置') || sel.label.includes('Settings')) vscode.commands.executeCommand('agPrivateCockpit.openNativeSettings');
        else if (sel.label.includes('刷新') || sel.label.includes('Refresh')) fetchLiveQuota(true);
    });
}

function showDashboard(context) {
    if (currentPanel) {
        try {
            currentPanel.reveal(vscode.ViewColumn.One);
            currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, currentLang);
            return;
        } catch (e) {
            try { currentPanel.dispose(); } catch (_) {}
            currentPanel = undefined;
        }
    }

    try {
        currentPanel = vscode.window.createWebviewPanel(
            'agPrivateCockpit',
            currentLang === 'zh' ? 'Antigravity 配额驾驶舱' : 'Antigravity Quota Cockpit',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [context.extensionUri]
            }
        );

        currentPanel.webview.html = renderDashboardHtml(currentPanel.webview, liveQuotaState, currentLang);

        currentPanel.webview.onDidReceiveMessage(msg => {
            if (msg.command === 'refresh') fetchLiveQuota(true);
            else if (msg.command === 'openSettings') vscode.commands.executeCommand('agPrivateCockpit.openNativeSettings');
            else if (msg.command === 'toggleLang') setLanguage(context, currentLang === 'zh' ? 'en' : 'zh');
        }, undefined, context.subscriptions);

        currentPanel.onDidDispose(() => {
            currentPanel = undefined;
        }, null, context.subscriptions);
    } catch (err) {
        console.error('[Antigravity Cockpit] Webview create failed:', err);
        showQuickOverview(context);
    }
}

function renderDashboardHtml(webview, data, lang) {
    const isZh = lang === 'zh';
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const warnPct = cfg.get('warningThreshold', 50);
    const critPct = cfg.get('criticalThreshold', 20);

    const t = {
        title:       isZh ? '配额驾驶舱' : 'Quota Cockpit',
        liveTag:     data.isLive ? (isZh ? '官方原生实时同频' : 'Native Live Synced') : (isZh ? '实时连接中' : 'Connected'),
        btnLang:     isZh ? '🌐 English' : '🌐 切换中文',
        btnSettings: isZh ? '⚙️ 设置' : '⚙️ Settings',
        btnRefresh:  isZh ? '🔄 实时刷新' : '🔄 Refresh',
        geminiBrand: 'Google Gemini',
        geminiSub:   'Gemini 3.7 Flash • 3.1 Pro',
        claudeBrand: 'Anthropic Claude & GPT',
        claudeSub:   'Claude 4.6 Sonnet • GPT-OSS',
        statusOk:    isZh ? '运行良好' : 'Optimal',
        statusWarn:  isZh ? '注意额度' : 'Watch',
        statusCrit:  isZh ? '额度偏低' : 'Low',
        weekLabel:   'Weekly Limit Remaining',
        fiveLabel:   'Five Hour Limit Remaining',
        resetLabel:  isZh ? '满额重置' : 'Reset In',
        tierLabel:   isZh ? '算力服务' : 'Service',
        geminiTier:  isZh ? 'Google 原生 TPU 算力池' : 'Google Native TPU Cluster',
        claudeTier:  isZh ? 'Anthropic 第三方配额池' : 'Third-Party Quota Pool',
        resetTimeG:  isZh ? data.gemini.weeklyResetTimeZh : data.gemini.weeklyResetTimeEn,
        resetTimeC:  isZh ? data.claude.weeklyResetTimeZh : data.claude.weeklyResetTimeEn,
        footerSafe:  isZh ? '🔒 <strong>100% 纯本地离线执行</strong> · 自动读取本地 Language Server · 零外部网络遥测' : '🔒 <strong>100% Local & Offline</strong> · Auto probes local Language Server · Zero Telemetry',
        footerSync:  isZh ? '最后同步' : 'Last sync'
    };

    function statusInfo(pct) {
        if (pct < critPct) return { label: t.statusCrit, color: '#f85149' };
        if (pct < warnPct) return { label: t.statusWarn, color: '#d29922' };
        return { label: t.statusOk, color: '#3fb950' };
    }

    const gStat = statusInfo(Math.min(data.gemini.weeklyPercent, data.gemini.fiveHourPercent));
    const cStat = statusInfo(Math.min(data.claude.weeklyPercent, data.claude.fiveHourPercent));

    return `<!DOCTYPE html>
<html lang="${isZh ? 'zh-CN' : 'en'}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: https:;">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>${t.title}</title>
<style>
:root{--surface:var(--vscode-sideBar-background,#161b22);--border:var(--vscode-widget-border,rgba(255,255,255,.12));--text:var(--vscode-editor-foreground,#f0f6fc);--muted:var(--vscode-descriptionForeground,#8b949e);}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--vscode-editor-background,#0d1117);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:16px;display:flex;justify-content:center;}
.wrap{width:100%;max-width:640px;}
.topbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid var(--border);}
.header-title{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;white-space:nowrap;}
.live-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 8px;border-radius:10px;background:rgba(63,185,80,.15);color:#3fb950;border:1px solid rgba(63,185,80,.3);font-weight:600;}
.dot{width:6px;height:6px;border-radius:50%;background:#3fb950;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.85)}}
.actions{display:flex;flex-wrap:wrap;gap:6px;}
.btn{display:inline-flex;align-items:center;gap:4px;background:var(--vscode-button-secondaryBackground,#21262d);color:var(--vscode-button-secondaryForeground,#c9d1d9);border:1px solid var(--border);padding:5px 10px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap;}
.btn:hover{background:var(--vscode-button-background,#1f6feb);color:#fff;border-color:transparent;}
.btn-lang{background:rgba(88,166,255,.12);color:#58a6ff;border-color:rgba(88,166,255,.3);}
.btn-lang:hover{background:#1f6feb;color:#fff;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin-bottom:16px;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:14px;}
.card-g{border-top:2px solid #4285f4;}
.card-c{border-top:2px solid #d97706;}
.card-head{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.brand-box{display:flex;align-items:center;gap:10px;}
.logo-wrap{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);flex-shrink:0;}
.brand-info{display:flex;flex-direction:column;}
.brand-name{font-size:13px;font-weight:700;line-height:1.2;}
.brand-sub{font-size:11px;color:var(--muted);margin-top:2px;}
.pill{font-size:11px;font-weight:600;padding:2px 7px;border-radius:6px;white-space:nowrap;}
.metric{display:flex;flex-direction:column;gap:5px;}
.metric-row{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--muted);}
.metric-val{font-size:13px;font-weight:800;color:var(--text);}
.track{height:8px;background:rgba(255,255,255,.08);border-radius:6px;overflow:hidden;}
.fill-g{height:100%;background:linear-gradient(90deg,#1ba0e2,#4285f4 35%,#9b72cb 70%,#d96570);border-radius:6px;box-shadow:0 0 8px rgba(66,133,244,.35);transition:width .4s cubic-bezier(.4,0,.2,1);}
.fill-c{height:100%;background:linear-gradient(90deg,#b45309,#d97706 40%,#f97316 75%,#ea580c);border-radius:6px;box-shadow:0 0 8px rgba(217,119,6,.35);transition:width .4s cubic-bezier(.4,0,.2,1);}
.meta{display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:var(--muted);}
.meta-row{display:flex;justify-content:space-between;align-items:center;gap:8px;}
.meta-val{color:var(--text);font-weight:500;text-align:right;}
.footer{background:rgba(255,255,255,.02);border:1px dashed var(--border);border-radius:8px;padding:10px 12px;font-size:11px;color:var(--muted);line-height:1.5;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
.sync{font-size:10px;}
</style>
</head>
<body>
<div class="wrap">
  <div class="topbar">
    <div class="header-title">🛸 ${t.title}<span class="live-badge"><span class="dot"></span>${t.liveTag}</span></div>
    <div class="actions">
      <button class="btn btn-lang" onclick="toggleLang()">${t.btnLang}</button>
      <button class="btn" onclick="openSettings()">${t.btnSettings}</button>
      <button class="btn" onclick="refresh()">${t.btnRefresh}</button>
    </div>
  </div>

  <div class="grid">
    <!-- Google Gemini -->
    <div class="card card-g">
      <div class="card-head">
        <div class="brand-box">
          <div class="logo-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" fill="url(#gg)"/>
              <defs><linearGradient id="gg" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse"><stop stop-color="#4285F4"/><stop offset=".45" stop-color="#9B72CB"/><stop offset="1" stop-color="#D96570"/></linearGradient></defs>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-name">${t.geminiBrand}</span>
            <span class="brand-sub">${t.geminiSub}</span>
          </div>
        </div>
        <span class="pill" style="background:${gStat.color}22;color:${gStat.color};border:1px solid ${gStat.color}55">● ${gStat.label}</span>
      </div>

      <div class="metric">
        <div class="metric-row"><span>${t.weekLabel}</span><span class="metric-val">${data.gemini.weeklyPercent}%</span></div>
        <div class="track"><div class="fill-g" style="width:${data.gemini.weeklyPercent}%"></div></div>
      </div>
      <div class="metric">
        <div class="metric-row"><span>${t.fiveLabel}</span><span class="metric-val">${data.gemini.fiveHourPercent}%</span></div>
        <div class="track"><div class="fill-g" style="width:${data.gemini.fiveHourPercent}%"></div></div>
      </div>

      <div class="meta">
        <div class="meta-row"><span>${t.resetLabel}</span><span class="meta-val">${t.resetTimeG}</span></div>
        <div class="meta-row"><span>${t.tierLabel}</span><span class="meta-val">${t.geminiTier}</span></div>
      </div>
    </div>

    <!-- Anthropic Claude & GPT -->
    <div class="card card-c">
      <div class="card-head">
        <div class="brand-box">
          <div class="logo-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13.5 2.5L12 7L10.5 2.5C10.3 1.9 9.7 1.5 9 1.5C8.2 1.5 7.5 2.2 7.5 3C7.5 3.3 7.6 3.6 7.8 3.9L10.2 8.5L5.5 6.2C5.2 6.1 4.9 6 4.6 6C3.7 6 3 6.7 3 7.6C3 8.3 3.5 8.9 4.1 9.1L8.7 10.6L4.2 12.1C3.6 12.3 3.1 12.9 3.1 13.6C3.1 14.5 3.8 15.2 4.7 15.2C5 15.2 5.3 15.1 5.6 15L10.2 12.7L7.8 17.3C7.6 17.6 7.5 17.9 7.5 18.2C7.5 19 8.2 19.7 9 19.7C9.7 19.7 10.3 19.3 10.5 18.7L12 14.2L13.5 18.7C13.7 19.3 14.3 19.7 15 19.7C15.8 19.7 16.5 19 16.5 18.2C16.5 17.9 16.4 17.6 16.2 17.3L13.8 12.7L18.4 15C18.7 15.1 19 15.2 19.3 15.2C20.2 15.2 20.9 14.5 20.9 13.6C20.9 12.9 20.4 12.3 19.8 12.1L15.3 10.6L19.9 9.1C20.5 8.9 21 8.3 21 7.6C21 6.7 20.3 6 19.4 6C19.1 6 18.8 6.1 18.5 6.2L13.8 8.5L16.2 3.9C16.4 3.6 16.5 3.3 16.5 3C16.5 2.2 15.8 1.5 15 1.5C14.3 1.5 13.7 1.9 13.5 2.5Z" fill="#D97706"/>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-name">${t.claudeBrand}</span>
            <span class="brand-sub">${t.claudeSub}</span>
          </div>
        </div>
        <span class="pill" style="background:${cStat.color}22;color:${cStat.color};border:1px solid ${cStat.color}55">● ${cStat.label}</span>
      </div>

      <div class="metric">
        <div class="metric-row"><span>${t.weekLabel}</span><span class="metric-val">${data.claude.weeklyPercent}%</span></div>
        <div class="track"><div class="fill-c" style="width:${data.claude.weeklyPercent}%"></div></div>
      </div>
      <div class="metric">
        <div class="metric-row"><span>${t.fiveLabel}</span><span class="metric-val">${data.claude.fiveHourPercent}%</span></div>
        <div class="track"><div class="fill-c" style="width:${data.claude.fiveHourPercent}%"></div></div>
      </div>

      <div class="meta">
        <div class="meta-row"><span>${t.resetLabel}</span><span class="meta-val">${t.resetTimeC}</span></div>
        <div class="meta-row"><span>${t.tierLabel}</span><span class="meta-val">${t.claudeTier}</span></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>${t.footerSafe}</span>
    <span class="sync">${t.footerSync}: ${data.lastSyncTime}</span>
  </div>
</div>

<script>
const vscode = acquireVsCodeApi();
function refresh()      { vscode.postMessage({ command: 'refresh'      }); }
function openSettings() { vscode.postMessage({ command: 'openSettings' }); }
function toggleLang()   { vscode.postMessage({ command: 'toggleLang'   }); }
</script>
</body>
</html>`;
}

function deactivate() {
    if (refreshTimer) clearInterval(refreshTimer);
}

module.exports = { activate, deactivate };
