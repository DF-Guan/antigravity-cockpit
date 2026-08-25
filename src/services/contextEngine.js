//﻿​‌​​​​​‌​‌​‌​‌​‌​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​‌​​‌​​​‌​​​‌​​​‌‌​​​‌​‌‌​‌​‌​​​‌‌‌​‌‌‌​‌​‌​‌‌​​​​‌​‌‌​‌‌‌​​‌‌‌‌‌​​​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌‌‌​‌​​​‌‌​​​​​​‌‌​‌‌​​​‌‌​​​‌​​‌‌​‌​​​‌‌​​​​‌​‌‌​​​‌‌​‌‌​​​‌‌​​‌‌​​​​​‌‌​​​‌​​​‌‌‌​​​​‌‌​​‌​​​​‌‌​​​​​‌‌​​​‌​​‌‌​​​​‌​​‌‌​​​‌​​‌‌​​‌​‍


// 🛡️ Context Saturation High-Water Mark Cache: 确保提炼后及未提炼状态下占用严格单调递增
let contextHighWaterMarks = {};
let persistentContextStorage = null;

function initContextEngineStorage(globalState) {
    if (globalState) {
        persistentContextStorage = globalState;
        const saved = globalState.get('agPrivateCockpit.contextHighWaterMarks', {});
        if (saved && typeof saved === 'object') {
            contextHighWaterMarks = Object.assign({}, saved);
        }
    }
}


const fs = require('fs');
const path = require('path');

// 🎯 主流模型原生上下文窗口上限矩阵 (Model Context Capacities)
const MODEL_CAPACITIES = {
    'gemini':    1048576, // 1M  (Google Gemini 2.0 / 3.7 Flash & Pro)
    'gemini-2m': 2097152, // 2M  (Google Gemini 1.5 Pro)
    'claude':     200000, // 200K (Anthropic Claude 3.5 / 3.7 Sonnet)
    'gpt4':       128000, // 128K (OpenAI GPT-4o / GPT-4.5)
    'deepseek':    64000  // 64K  (DeepSeek V3 / R1)
};

// 🔒 Shared Context Saturation State across modules
const contextState = {
    modelType: 'gemini',
    windowCapacity: 1048576, // 默认 1M
    usedTokens: 0,
    workingTokens: 0,
    saturationPercent: 0,
    saturationFormatted: '0.0%',
    isCompacted: false,
    lastCompactedTime: null,
    lastSnapshotPath: null,
    stageCode: 'safe',
    stageNameZh: '充裕敏捷',
    stageNameEn: 'Optimal',
    colorHex: '#38bdf8',
    statusText: '🧠 0.0%',
    attentionHealthZh: '100% (极佳 · 零衰减)',
    attentionHealthEn: '100% (Optimal · Zero Decay)'
};

// 内存基线缓存 (跨函数共享)
const sessionCompactionBaselines = {};

function getContextState() {
    return contextState;
}

/**
 * 🔍 精准识别当前活跃子项目根目录 (跨子项目物理隔离防护)
 */
function resolveActiveSubproject(workspaceRoot, activeFilePath) {
    const ws = workspaceRoot || process.cwd();

    // 1. 【子项目直接打开兼容】工作区本身直接打开的是某个子项目 (如 D:/.../projects/my-app)
    const normWs = ws.replace(/\\/g, '/');
    const wsProjectMatch = normWs.match(/\/projects\/([^\/]+)$/);
    if (wsProjectMatch) {
        const subName = wsProjectMatch[1];
        return { 
            name: subName, 
            path: ws, 
            relPath: '.', 
            isSubproject: true,
            displayCategory: `projects/${subName}`
        };
    }

    // 2. 【活跃文件精准定位】根据当前激活文件路径精准锁定子项目
    if (activeFilePath && typeof activeFilePath === 'string') {
        const norm = activeFilePath.replace(/\\/g, '/');
        const match = norm.match(/\/projects\/([^\/]+)/);
        if (match) {
            const subName = match[1];
            const subPath = path.join(ws, 'projects', subName);
            if (fs.existsSync(subPath)) {
                return { 
                    name: subName, 
                    path: subPath, 
                    relPath: `projects/${subName}`, 
                    isSubproject: true,
                    displayCategory: `projects/${subName}`
                };
            } else if (path.basename(ws) === subName) {
                return { 
                    name: subName, 
                    path: ws, 
                    relPath: '.', 
                    isSubproject: true,
                    displayCategory: `projects/${subName}`
                };
            }
        }
    }

    // 3. 【Monorepo 目录扫描】扫描工作区 projects/ 目录
    const projectsDir = path.join(ws, 'projects');
    if (fs.existsSync(projectsDir)) {
        const cockpitDir = path.join(projectsDir, 'antigravity-cockpit');
        if (fs.existsSync(cockpitDir)) {
            return { 
                name: 'antigravity-cockpit', 
                path: cockpitDir, 
                relPath: 'projects/antigravity-cockpit', 
                isSubproject: true,
                displayCategory: 'projects/antigravity-cockpit'
            };
        }
        try {
            const subs = fs.readdirSync(projectsDir).filter(d => {
                const p = path.join(projectsDir, d);
                return fs.statSync(p).isDirectory();
            });
            if (subs.length > 0) {
                return { 
                    name: subs[0], 
                    path: path.join(projectsDir, subs[0]), 
                    relPath: `projects/${subs[0]}`, 
                    isSubproject: true,
                    displayCategory: `projects/${subs[0]}`
                };
            }
        } catch (_) {}
    }

    // 4. 【默认工作区兼容模式 (Workspace Compatibility Mode)】
    // 用户未自定义 projects/ 目录时，全面自适应为通用工作区 (workspace)
    let wsName = path.basename(ws) || 'workspace';
    const pkgFile = path.join(ws, 'package.json');
    if (fs.existsSync(pkgFile)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
            if (pkg.name) wsName = pkg.name;
        } catch (_) {}
    }

    return { 
        name: wsName, 
        path: ws, 
        relPath: '.', 
        isSubproject: false,
        displayCategory: `workspace (${wsName})`
    };
}
/**
 * 💾 磁盘持久化扫描：自动探测当前会话在物理磁盘上是否已有已归档的快照文件
 * （解决窗口重载 Reload Window 后内存丢失的问题）
 */
function findPersistentSnapshot(subprojectDir, convId, workspaceRoot) {
    const candidateDirs = [];

    if (subprojectDir && fs.existsSync(subprojectDir)) {
        candidateDirs.push(path.join(subprojectDir, 'docs', 'snapshots'));
    }

    if (workspaceRoot && fs.existsSync(workspaceRoot) && workspaceRoot !== subprojectDir) {
        candidateDirs.push(path.join(workspaceRoot, 'docs', 'snapshots'));
        const pDir = path.join(workspaceRoot, 'projects');
        if (fs.existsSync(pDir)) {
            try {
                fs.readdirSync(pDir).forEach(sub => {
                    const subSnap = path.join(pDir, sub, 'docs', 'snapshots');
                    if (fs.existsSync(subSnap)) candidateDirs.push(subSnap);
                });
            } catch (_) {}
        }
    }

    for (const snapDir of candidateDirs) {
        if (!fs.existsSync(snapDir)) continue;
        try {
            const files = fs.readdirSync(snapDir).filter(f => f.startsWith('snapshot_') && f.endsWith('.md'));
            if (files.length === 0) continue;

            files.sort().reverse();
            for (const f of files) {
                const fpath = path.join(snapDir, f);
                const content = fs.readFileSync(fpath, 'utf-8');
                // 🛡️ 严格会话隔离：必须真实包含当前活跃会话 ID（且不能为 default/test 伪造）
                if (convId && convId !== 'default' && convId.length >= 16 && content.includes(convId) && !content.includes('[TEST_MOCK]')) {
                    const timeMatch = content.match(/(?:快照)?归档时间[\*\s：:]+`([^`]+)`/);
                    const tokenMatch = content.match(/`(\d[\d,]*)`\s*Tokens/);
                    
                    let totalAtCompact = 0;
                    if (tokenMatch) {
                        totalAtCompact = parseInt(tokenMatch[1].replace(/,/g, ''), 10) || 0;
                    }

                    return {
                        fileName: f,
                        filePath: fpath,
                        dateReadable: timeMatch ? timeMatch[1] : f.replace('snapshot_', '').replace('.md', ''),
                        totalAtCompact: totalAtCompact
                    };
                }
            }
        } catch (_) {}
    }

    return null;
}
/**
 * 🧠 统一高精度上下文额度饱和度测算引擎 (支持物理磁盘快照自动持久化识别)
 */
function computeContextSaturation(tokenStateOrTokens, customCapacity, modelType, subprojectDir, workspaceRoot) {
    let capacity = 1048576; // 默认 Gemini 1M
    const mType = modelType ? String(modelType).toLowerCase() : 'gemini';

    if (customCapacity && typeof customCapacity === 'number' && customCapacity > 0) {
        capacity = customCapacity;
    } else if (MODEL_CAPACITIES[mType]) {
        capacity = MODEL_CAPACITIES[mType];
    }

    let usedTokens = 0;
    let convId = 'default';
    let isCompacted = false;
    let lastCompactedTime = null;
    let lastSnapshotPath = null;

    if (typeof tokenStateOrTokens === 'object' && tokenStateOrTokens !== null) {
        convId = tokenStateOrTokens.activeConvId || 'default';
        const reqs = tokenStateOrTokens.activeRequests || 0;
        const tot = tokenStateOrTokens.activeTotalNum || 0;
        
        // 1. 优先检查内存基线
        let baseline = sessionCompactionBaselines[convId];

        // 2. 若内存无基线（如刚刚 Reload Window），自动扫描物理磁盘持久化快照！
        if (!baseline && subprojectDir) {
            const diskSnapshot = findPersistentSnapshot(subprojectDir, convId, workspaceRoot);
            if (diskSnapshot) {
                baseline = {
                    dateReadable: diskSnapshot.dateReadable,
                    totalAtCompact: diskSnapshot.totalAtCompact || tot,
                    requestsAtCompact: reqs,
                    filePath: diskSnapshot.filePath
                };
                sessionCompactionBaselines[convId] = baseline;
            }
        }

        if (baseline) {
            isCompacted = true;
            lastCompactedTime = baseline.dateReadable;
            lastSnapshotPath = baseline.filePath;
            const baseTokens = baseline.totalAtCompact || tot;
            const deltaTokens = Math.max(0, tot - baseTokens);
            // 提炼后基线以高密度 Snapshot 为基准 (16,000 Tokens) + 提炼后真实增量
            usedTokens = Math.min(capacity, Math.round(16000 + (deltaTokens * 0.008)));
        } else {
            if (reqs > 0 || tot > 0) {
                usedTokens = Math.min(capacity, Math.round(15000 + (reqs * 3600) + (tot * 0.008)));
            }
        }

        // 🛡️ 全状态单调递增防护 (Strict Monotonic High-Water Mark):
        // 无论是在未提炼状态还是在提炼后的增量演进中，同一个提炼周期内的占用数值绝对只增不减，彻底杜绝回退抖动
        if (convId && convId !== 'default') {
            const hwmKey = isCompacted ? `${convId}_compact_${baseline ? baseline.dateReadable : 'c'}` : `${convId}_raw`;
            if (!contextHighWaterMarks[hwmKey]) {
                contextHighWaterMarks[hwmKey] = usedTokens;
            } else {
                usedTokens = Math.max(contextHighWaterMarks[hwmKey], usedTokens);
                contextHighWaterMarks[hwmKey] = usedTokens;
            }
            if (persistentContextStorage) {
                persistentContextStorage.update('agPrivateCockpit.contextHighWaterMarks', contextHighWaterMarks);
            }
        }
    } else if (typeof tokenStateOrTokens === 'number' && tokenStateOrTokens > 0) {
        usedTokens = Math.min(capacity, tokenStateOrTokens);
    }

    const ratio = Math.min(1.0, usedTokens / capacity);
    const pct = Math.round(ratio * 1000) / 10; // 0.0% ~ 100.0%

    let stageCode = 'safe';
    let stageZh = isCompacted ? '充裕敏捷 (已提炼)' : '充裕敏捷';
    let stageEn = isCompacted ? 'Optimal (Refined)' : 'Optimal';
    let color = '#38bdf8';
    let healthZh = isCompacted ? '100% (已提炼归档 · 注意力重置)' : '100% (极佳 · 零衰减)';
    let healthEn = isCompacted ? '100% (Refined · Reset)' : '100% (Optimal · Zero Decay)';

    if (pct < 40) {
        stageCode = 'safe';
        stageZh = isCompacted ? '充裕敏捷 (已提炼)' : '充裕敏捷';
        stageEn = isCompacted ? 'Optimal (Refined)' : 'Optimal';
        color = '#38bdf8';
        healthZh = isCompacted ? '100% (已提炼归档 · 注意力重置)' : '100% (极佳 · 零衰减)';
        healthEn = isCompacted ? '100% (Refined · Reset)' : '100% (Optimal · Zero Decay)';
    } else if (pct < 70) {
        stageCode = 'normal';
        stageZh = '稳健运行';
        stageEn = 'Normal';
        color = '#3b82f6';
        healthZh = '95% (良好 · 逻辑严密)';
        healthEn = '95% (Good · Coherent)';
    } else if (pct < 85) {
        stageCode = 'warning';
        stageZh = '注意力衰减预警';
        stageEn = 'Attention Decay';
        color = '#f59e0b';
        healthZh = '75% (轻度衰减 · 建议提炼)';
        healthEn = '75% (Mild Decay · Recommend Snapshot)';
    } else {
        stageCode = 'critical';
        stageZh = '上下文临界 · 必须提炼';
        stageEn = 'Saturated · Must Snapshot';
        color = '#ef4444';
        healthZh = '40% (重度失忆风险 · 需提炼)';
        healthEn = '40% (Critical Amnesia Risk · Must Snapshot)';
    }

    Object.assign(contextState, {
        modelType: mType,
        windowCapacity: capacity,
        usedTokens: usedTokens,
        workingTokens: usedTokens,
        saturationPercent: pct,
        saturationFormatted: `${pct.toFixed(1)}%`,
        isCompacted: isCompacted,
        lastCompactedTime: lastCompactedTime,
        lastSnapshotPath: lastSnapshotPath,
        stageCode: stageCode,
        stageNameZh: stageZh,
        stageNameEn: stageEn,
        colorHex: color,
        statusText: `🧠 ${pct.toFixed(1)}%`,
        attentionHealthZh: healthZh,
        attentionHealthEn: healthEn
    });

    return contextState;
}

/**
 * 📸 在指定子项目目录下物理归档 session_snapshot.md，并更新对应子项目的 memory.md 索引与基线
 */
function createSessionSnapshot(subprojectDir, activeConvId, tokenState, subprojectName) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const tsStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const dateReadable = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const targetDir = subprojectDir || process.cwd();
    const snapshotsDir = path.join(targetDir, 'docs', 'snapshots');
    try {
        if (!fs.existsSync(snapshotsDir)) {
            fs.mkdirSync(snapshotsDir, { recursive: true });
        }
    } catch (_) {}

    const fileName = `snapshot_${tsStr}.md`;
    const filePath = path.join(snapshotsDir, fileName);
    const subName = subprojectName || path.basename(targetDir);
    const isSub = subprojectDir && subprojectDir.replace(/\\/g, '/').includes('/projects/');
    const relDisplayPath = isSub ? `projects/${subName}/docs/snapshots/${fileName}` : `docs/snapshots/${fileName}`;

    const totFormatted = tokenState ? tokenState.activeTotalFormatted : '0 Tokens';
    const totExact = tokenState ? tokenState.activeTotalExact : '0';
    const inFormatted = tokenState ? tokenState.activeInputFormatted : '0';
    const outFormatted = tokenState ? tokenState.activeOutputFormatted : '0';
    const cachedPercent = tokenState ? tokenState.activeCachedPercent : '0%';
    const capFormatted = Math.round(contextState.windowCapacity / 1000) + 'K';

    const snapshotContent = `# 📸 会话上下文状态快照 (Session Snapshot)

> 💡 本文件由 **Antigravity Private Cockpit** 自动提炼生成。作为所属子项目 \`${subName}\` 的高密度基线索引，后续对话可直接读取本快照以重置注意力，避免长文本失忆。

---

## 📊 会话物理度量基线 (Telemetry Baseline)
- **归属子项目**: \`${subName}\`
- **快照归档时间**: \`${dateReadable}\` (时间戳: \`${tsStr}\`)
- **对应会话标识**: \`${activeConvId || '当前活跃会话'}\`
- **会话总物理吞吐**: **${totFormatted}** (\`${totExact}\` Tokens)
- **输入与缓存**: 📥 **${inFormatted}** ｜ ⚡ 前缀缓存率: **${cachedPercent}**
- **实际生成输出**: 📤 **${outFormatted}** (代码与思考)
- **上下文额度占用**: **${contextState.saturationFormatted}** / ${capFormatted} (${contextState.stageNameZh})
- **长文本注意力保留率**: **${contextState.attentionHealthZh}**

---

## 🎯 一、核心目标与项目架构 (Goals & Architecture)
- **子项目定位**: \`${subName}\` 专属技术交付基线。
- **架构模块**: 严密遵循子项目物理隔离规则，独立归档于所属工程目录。

---

## ✅ 二、已完成的关键特性与修复 (Accomplished Deliverables)
1. **上下文额度提炼体系**: 实现单键秒级状态快照归档，无侵入式自动索引；
2. **多子项目物理隔离**: 精准隔离至 \`${subName}\`，彻底防止跨项目污染；
3. **注意力基线重置与持久化**: 提炼后自动重置活跃上下文度量至安全绿区，并持久化感知。

---

## 🚧 三、当前正在进行的上下文状态 (In-Progress State & Active Focus)
- **当前活跃焦点**: 当前功能模块交付与测试验证；
- **所属子项目**: \`${subName}\`。

---

## 📌 四、核心硬性约束与专属开发规则 (Strict Constraints & Rules)
1. **物理隔离铁律**: 严禁在工作区根目录生成非授权文件，所有产物归属于 \`projects/${subName}/\`；
2. **三层文档联动**: 任何关键节点同步更新本子项目的 \`memory.md\` 与 \`docs/tech_spec.md\`。
`;

    fs.writeFileSync(filePath, snapshotContent, 'utf-8');

    // 🌟 记录当前会话的提炼基线
    const convKey = activeConvId || 'default';
    sessionCompactionBaselines[convKey] = {
        timestamp: tsStr,
        dateReadable: dateReadable,
        requestsAtCompact: tokenState ? tokenState.activeRequests : 0,
        totalAtCompact: tokenState ? tokenState.activeTotalNum : 0,
        filePath: filePath
    };

    // 立即重新计算并更新状态
    computeContextSaturation(tokenState, contextState.windowCapacity, contextState.modelType, targetDir);

    // 自动同步更新对应子项目的 memory.md 快照索引指针 (若无 memory.md 则自动初始化标准模板)
    const memoryFile = path.join(targetDir, 'memory.md');
    const pointerSection = `## 📸 最新上下文快照索引 (Active Snapshot Pointer)
- **所属子项目**: \`${subName}\`
- **最新快照基线**: [docs/snapshots/${fileName}](file:///${filePath.replace(/\\/g, '/')})
- **归档时间戳**: \`${dateReadable}\` (\`${tsStr}\`)
- **会话物理消耗**: **${totFormatted}** (\`${totExact}\` Tokens ｜ 状态: **已完成基线提炼 · 注意力重置**)
- **长文本注意力**: \`100% (已提炼归档 · 零衰减)\`
`;
    try {
        let memContent = '';
        if (fs.existsSync(memoryFile)) {
            memContent = fs.readFileSync(memoryFile, 'utf-8');
            if (memContent.includes('## 📸 最新上下文快照索引')) {
                memContent = memContent.replace(/## 📸 最新上下文快照索引[\s\S]*?(?=\n## |$)/, pointerSection);
            } else {
                memContent = pointerSection + '\n' + memContent;
            }
        } else {
            memContent = `# 项目进度与上下文记忆看板 (${subName})\n\n${pointerSection}\n## 🚀 当前进度\n- **上次做到**: 上下文状态提炼归档已完成；\n- **当前状态**: 开发中；\n\n## 📋 待办事项 (TODO)\n- [ ] 持续进行模块交付\n`;
        }
        fs.writeFileSync(memoryFile, memContent, 'utf-8');
    } catch (e) {
        console.error('Failed to update memory.md pointer:', e);
    }

    return {
        fileName,
        filePath,
        relPath: `docs/snapshots/${fileName}`,
        relDisplayPath,
        subName,
        timestamp: tsStr,
        dateReadable
    };
}

module.exports = {
    initContextEngineStorage,
    MODEL_CAPACITIES,
    contextState,
    getContextState,
    resolveActiveSubproject,
    findPersistentSnapshot,
    computeContextSaturation,
    createSessionSnapshot
};
