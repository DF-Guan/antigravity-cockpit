const fs = require('fs');
const path = require('path');

// 🔒 Shared Context Saturation State across modules
const contextState = {
    windowCapacity: 1048576, // 1M Standard Window for Gemini 3.7 / 2.0 / Claude 3.7
    activeTokens: 0,
    saturationPercent: 0,
    saturationFormatted: '0%',
    expression: '(•‿•)',
    ringIcon: '○',
    stageNameZh: '充裕敏捷',
    stageNameEn: 'Pristine & Agile',
    colorHex: '#22c55e',
    statusText: '(•‿•) ○ 0%',
    attentionHealthZh: '100% (极佳 · 零注意力衰减)',
    attentionHealthEn: '100% (Optimal · Zero Decay)'
};

function getContextState() {
    return contextState;
}

/**
 * 🧠 5-Stage Expression & Dynamic Circular Ring State Machine
 * 
 * 1. 0%  ~ 25%: (•‿•) ○ 充裕敏捷 (Safe Green #22c55e)
 * 2. 25% ~ 50%: (•_•) ◔ 稳健运行 (Sky Blue #38bdf8)
 * 3. 50% ~ 75%: (•᷅_•᷄) ◑ 轻度注意 (Amber Yellow #eab308)
 * 4. 75% ~ 90%: (⊙_⊙;) ◕ 注意力衰减警示 (Warning Orange #f97316)
 * 5. 90% ~ 100%: (×_×) ● 上下文已满·建议压缩 (Alert Crimson #ef4444)
 */
function computeContextSaturation(activeTotalTokens, customCapacity, activeRequests) {
    const capacity = customCapacity && customCapacity > 0 ? customCapacity : 1048576;
    
    let workingTokens = 0;
    if (typeof activeTotalTokens === 'number' && activeTotalTokens > 0) {
        if (activeRequests !== undefined && activeRequests > 0) {
            // Context working memory dynamically estimated from conversation history depth & size
            workingTokens = Math.min(capacity, Math.round(18000 + (activeRequests * 4200) + (activeTotalTokens * 0.015)));
        } else {
            workingTokens = Math.min(capacity, activeTotalTokens);
        }
    }

    const ratio = Math.min(1.0, workingTokens / capacity);
    const pct = Math.round(ratio * 1000) / 10; // 保留一位小数，如 18.4%

    let expr = '(•‿•)';
    let ring = '○';
    let stageZh = '充裕敏捷';
    let stageEn = 'Pristine & Agile';
    let color = '#22c55e';
    let healthZh = '100% (极佳 · 零注意力衰减)';
    let healthEn = '100% (Optimal · Zero Decay)';

    if (pct < 25) {
        expr = '(•‿•)';
        ring = '○';
        stageZh = '充裕敏捷';
        stageEn = 'Pristine & Agile';
        color = '#22c55e';
        healthZh = '100% (极佳 · 零注意力衰减)';
        healthEn = '100% (Optimal · Zero Decay)';
    } else if (pct < 50) {
        expr = '(•_•)';
        ring = '◔';
        stageZh = '稳健运行';
        stageEn = 'Normal & Stable';
        color = '#38bdf8';
        healthZh = '95% (良好 · 逻辑严密)';
        healthEn = '95% (Good · Coherent)';
    } else if (pct < 75) {
        expr = '(•᷅_•᷄)';
        ring = '◑';
        stageZh = '轻度注意';
        stageEn = 'Moderate Load';
        color = '#eab308';
        healthZh = '80% (轻度衰减 · 早期上下文开始模糊)';
        healthEn = '80% (Mild Decay · Early context fading)';
    } else if (pct < 90) {
        expr = '(⊙_⊙;)';
        ring = '◕';
        stageZh = '注意力衰减警示';
        stageEn = 'Attention Decay Warning';
        color = '#f97316';
        healthZh = '60% (中度衰减 · 建议及时 /compact 压缩)';
        healthEn = '60% (Decaying · Recommend /compact soon)';
    } else {
        expr = '(×_×)';
        ring = '●';
        stageZh = '上下文已满 · 必须压缩';
        stageEn = 'Context Saturated · Must Compact';
        color = '#ef4444';
        healthZh = '30% (重度失忆风险 · 必须立即压缩或新开会话)';
        healthEn = '30% (Critical Amnesia Risk · Must Compact)';
    }

    Object.assign(contextState, {
        windowCapacity: capacity,
        activeTokens: workingTokens,
        saturationPercent: pct,
        saturationFormatted: `${pct}%`,
        expression: expr,
        ringIcon: ring,
        stageNameZh: stageZh,
        stageNameEn: stageEn,
        colorHex: color,
        statusText: `${expr} ${ring} ${pct}%`,
        attentionHealthZh: healthZh,
        attentionHealthEn: healthEn
    });

    return contextState;
}

/**
 * 📋 生成类似 Claude Code /compact 的智能压缩提示词
 */
function generateCompactPrompt(activeConvId, tokenState) {
    const nowStr = new Date().toLocaleString('zh-CN');
    const totFormatted = tokenState ? tokenState.activeTotalFormatted : '当前会话';
    const totExact = tokenState ? tokenState.activeTotalExact : '0';

    return `/compact
================================================================
          CONTEXT COMPACTION & STATE CHECKPOINT (会话上下文压缩)
================================================================
【会话标识】: ${activeConvId || '当前活跃会话'}
【压缩时间】: ${nowStr}
【当前物理消耗】: ${totFormatted} Tokens (精确: ${totExact} Tokens)
【窗口占用】: ${contextState.saturationFormatted} / ${Math.round(contextState.windowCapacity / 1000)}K (${contextState.stageNameZh})

【压缩指令 (Compact Instructions)】:
请将本会话迄今为止的所有交互、决策与代码成果进行深度提炼，生成一份紧凑的高密度状态快照，丢弃过往冗长工具输出与中间临时调试日志：

1. 🎯 核心目标与项目架构 (Goals & Architecture)
2. ✅ 已完成的关键特性与修复 (Accomplished Deliverables)
3. 🚧 当前正在进行的上下文状态 (In-Progress State & Active File Focus)
4. 📌 核心硬性约束与专属开发规则 (Strict Constraints & Rules)
5. 📋 接下来明确的待办事项 (Next Immediate Action Items)

提炼完成后，后续交互将以此精简快照为基准基线，重置并释放上下文窗口注意力！
================================================================`;
}

module.exports = {
    contextState,
    getContextState,
    computeContextSaturation,
    generateCompactPrompt
};
