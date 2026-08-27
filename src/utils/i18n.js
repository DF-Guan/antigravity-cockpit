//﻿​‌​​​​​‌​‌​‌​‌​‌​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​‌​​‌​​​‌​​​‌​​​‌‌​​​‌​‌‌​‌​‌​​​‌‌‌​‌‌‌​‌​‌​‌‌​​​​‌​‌‌​‌‌‌​​‌‌‌‌‌​​​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌‌‌​‌​​​‌‌​​​​​​‌‌​‌‌​​​‌‌​​​‌​​‌‌​‌​​​‌‌​​​​‌​‌‌​​​‌‌​‌‌​​​‌‌​​‌‌​​​​​‌‌​​​‌​​​‌‌‌​​​​‌‌​​‌​​​​‌‌​​​​​‌‌​​​‌​​‌‌​​​​‌​​‌‌​​​‌​​‌‌​​‌​‍
const vscode = require('vscode');

function getEffectiveLang() {
    const cfg = vscode.workspace.getConfiguration('agPrivateCockpit');
    const pref = cfg.get('defaultLanguage', 'auto');
    if (pref === 'zh') return 'zh';
    if (pref === 'en') return 'en';
    const locale = vscode.env.language || 'en';
    return locale.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function formatTime(desc, isoResetTime) {
    if (desc) {
        const match = desc.match(/refresh in\s+([^.]+)/i);
        if (match) {
            const raw = match[1].trim();
            let zh = raw.replace(/less than a minute/i, '不足1分钟')
                        .replace(/days?/i, '天')
                        .replace(/hours?/i, '小时')
                        .replace(/minutes?/i, '分钟')
                        .replace(/,\s*/g, ' ') + '后';
            return { zh, en: 'in ' + raw };
        }
    }
    if (isoResetTime) {
        try {
            const diffMs = new Date(isoResetTime).getTime() - Date.now();
            if (diffMs <= 0) return { zh: '即将满额', en: 'Refreshing now' };
            const totalMins = Math.round(diffMs / 60000);
            const days = Math.floor(totalMins / 1440);
            const hours = Math.floor((totalMins % 1440) / 60);
            const mins = totalMins % 60;
            let zhParts = [];
            let enParts = [];
            if (days > 0) { zhParts.push(`${days}天`); enParts.push(`${days}d`); }
            if (hours > 0) { zhParts.push(`${hours}小时`); enParts.push(`${hours}h`); }
            if (mins > 0 && days === 0) { zhParts.push(`${mins}分钟`); enParts.push(`${mins}m`); }
            if (zhParts.length === 0) return { zh: '不足1分钟后', en: 'in <1 min' };
            return { zh: zhParts.join(' ') + '后', en: 'in ' + enParts.join(' ') };
        } catch (_) { /* Explicit safe fallback: non-blocking */ }
    }
    return { zh: '', en: '' };
}

module.exports = {
    getEffectiveLang,
    formatTime
};
