/**
 * 🟣 [Tier-2 · 机械校验] Feature Map 自动化物理断言套件 (verify_feature_map.js)
 * 遵循 Lauren Tan 编译器级防漂移规范，逐项断言 docs/feature_map.md 中定义的所有三维契约。
 */

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("     FEATURE MAP MECHANICAL VALIDATION SUITE (FAIL MECHANICALLY) ");
console.log("================================================================");

const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs');
const featureMapPath = path.join(docsDir, 'feature_map.md');

// Mock vscode environment
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(moduleName) {
    if (moduleName === 'vscode') {
        return {
            window: { 
                createStatusBarItem: () => ({ show: () => {}, hide: () => {}, text: '', tooltip: '' }), 
                showInformationMessage: () => {}, 
                showQuickPick: () => Promise.resolve(),
                createWebviewPanel: () => ({ webview: { html: '', onDidReceiveMessage: () => ({ dispose: () => {} }), postMessage: () => {} }, onDidDispose: () => ({ dispose: () => {} }), reveal: () => {} })
            },
            StatusBarAlignment: { Right: 1, Left: 2 },
            workspace: { getConfiguration: () => ({ get: (k, d) => d }), onDidChangeConfiguration: () => ({ dispose: () => {} }), workspaceFolders: [{ uri: { fsPath: path.join(projectRoot, '..', '..') } }] },
            commands: { registerCommand: () => ({ dispose: () => {} }), executeCommand: () => {} },
            env: { language: 'zh-CN' },
            ViewColumn: { One: 1 },
            MarkdownString: function() { this.isTrusted = true; this.appendMarkdown = () => {}; }
        };
    }
    return originalRequire.apply(this, arguments);
};

const errors = [];
const passes = [];

function assert(condition, name, failMsg) {
    if (condition) {
        passes.push(`✅ PASS: ${name}`);
        console.log(`✅ PASS: ${name}`);
    } else {
        errors.push(`❌ FAIL: ${name} -> ${failMsg}`);
        console.error(`❌ FAIL: ${name} -> ${failMsg}`);
    }
}

// 1. Feature Map Document Integrity (When present locally)
if (fs.existsSync(featureMapPath)) {
    assert(true, "FM-01: docs/feature_map.md exists", "");
    const fmContent = fs.readFileSync(featureMapPath, 'utf8');
    assert(fmContent.includes("User POV") && fmContent.includes("Agent Drive") && fmContent.includes("Observable State"),
        "FM-02: 3-Layer Schema Compliance", "Missing User POV / Agent Drive / Observable State headers");
} else {
    console.log("ℹ️ CI Environment: docs/ is gitignored in remote repository. Skipping FM-01 & FM-02.");
}

// 2. Feature 1: Quota Service Exports & Invariants
try {
    const quotaService = require(path.join(projectRoot, 'src', 'services', 'quotaService'));
    assert(typeof quotaService.fetchLiveQuota === 'function' && quotaService.liveQuotaState !== undefined,
        "FM-03 [Feature 1]: Quota Service Exports", "fetchLiveQuota or liveQuotaState missing");
} catch (e) {
    assert(false, "FM-03 [Feature 1]: Quota Service Exports", e.message);
}

// 3. Feature 2: Speed Engine Exports & Invariants
try {
    const speedEngine = require(path.join(projectRoot, 'src', 'services', 'speedEngine'));
    assert(typeof speedEngine.updateLiveSpeedEngine === 'function' && speedEngine.liveSpeedState !== undefined,
        "FM-04 [Feature 2]: Speed Engine Exports", "updateLiveSpeedEngine or liveSpeedState missing");
} catch (e) {
    assert(false, "FM-04 [Feature 2]: Speed Engine Exports", e.message);
}

// 4. Feature 3: Token Scanner Exports & Invariants
try {
    const tokenScanner = require(path.join(projectRoot, 'src', 'services', 'tokenScanner'));
    assert(typeof tokenScanner.computeLiveTokenAnalytics === 'function' && typeof tokenScanner.getTokenAnalyticsState === 'function',
        "FM-05 [Feature 3]: Token Scanner Exports", "computeLiveTokenAnalytics missing");
} catch (e) {
    assert(false, "FM-05 [Feature 3]: Token Scanner Exports", e.message);
}

// 5. Feature 4: UI StatusBar HUD API
try {
    const statusBar = require(path.join(projectRoot, 'src', 'ui', 'statusBar'));
    assert(typeof statusBar.initStatusBarItems === 'function' && typeof statusBar.renderStatusBar === 'function' && typeof statusBar.buildUnifiedTooltip === 'function',
        "FM-06 [Feature 4]: Status Bar HUD API", "initStatusBarItems / renderStatusBar / buildUnifiedTooltip missing");
} catch (e) {
    assert(false, "FM-06 [Feature 4]: Status Bar HUD API", e.message);
}

// 6. Feature 5: UI Dashboard Webview API
try {
    const dashboard = require(path.join(projectRoot, 'src', 'ui', 'dashboard'));
    assert(typeof dashboard.showDashboard === 'function' && typeof dashboard.updateDashboardIfOpen === 'function' && typeof dashboard.showQuickOverview === 'function',
        "FM-07 [Feature 5]: Dashboard Webview API", "showDashboard / updateDashboardIfOpen / showQuickOverview missing");
} catch (e) {
    assert(false, "FM-07 [Feature 5]: Dashboard Webview API", e.message);
}

// 7. Feature 6: Extension Public Programmatic API (Ecosystem Infrastructure)
try {
    const extension = require(path.join(projectRoot, 'src', 'extension'));
    assert(typeof extension.activate === 'function' && typeof extension.deactivate === 'function',
        "FM-08 [Feature 6]: Extension Lifecycle API", "activate/deactivate missing");
    const mockContext = {
        subscriptions: [],
        globalState: { get: () => null, update: () => {} },
        extension: { packageJSON: { version: '2.1.14' } }
    };
    const exportsApi = extension.activate(mockContext);
    assert(exportsApi && typeof exportsApi.getQuotaState === 'function' && typeof exportsApi.getSpeedState === 'function' && typeof exportsApi.getTokenAnalytics === 'function',
        "FM-09 [Feature 6]: Public Exported API Invariants", "Public API missing getQuotaState / getSpeedState / getTokenAnalytics");
    extension.deactivate();
} catch (e) {
    assert(false, "FM-08 [Feature 6]: Extension Public API Exports", e.message);
}

console.log("================================================================");
console.log(`FEATURE MAP VALIDATION RESULT: ${passes.length} Passed, ${errors.length} Failed`);
console.log("================================================================");

if (errors.length > 0) {
    process.exit(1);
} else {
    process.exit(0);
}