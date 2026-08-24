const fs = require('fs');
const path = require('path');

let tokenAnalyticsState = {
    activeConvId: '',
    activeConvShort: '当前会话',
    activeRequests: 0,
    activeInputFormatted: '0',
    activeInputExact: '0',
    activeInputNum: 0,
    activeOutputFormatted: '0',
    activeOutputExact: '0',
    activeOutputNum: 0,
    activeCachedFormatted: '0',
    activeCachedExact: '0',
    activeCachedNum: 0,
    activeCachedPercent: '0%',
    activeTotalFormatted: '0',
    activeTotalExact: '0',
    activeTotalNum: 0,

    globalConvsCount: 0,
    globalTotalFormatted: '0',
    globalTotalExact: '0',
    globalTotalNum: 0,
    
    conversationsList: []
};

function computeLiveTokenAnalytics() {
    try {
        const userHome = process.env.USERPROFILE || process.env.HOME || '';
        const convDir = path.join(userHome, '.gemini', 'antigravity-ide', 'conversations');
        const brainDir = path.join(userHome, '.gemini', 'antigravity-ide', 'brain');
        
        const convMap = {};

        // 1. Scan SQLite conversation databases
        if (fs.existsSync(convDir)) {
            const files = fs.readdirSync(convDir);
            for (const f of files) {
                if (f.endsWith('.db')) {
                    const cid = f.replace('.db', '');
                    const dbPath = path.join(convDir, f);
                    const walPath = path.join(convDir, f + '-wal');
                    try {
                        const stDb = fs.statSync(dbPath);
                        let mtime = stDb.mtimeMs;
                        let walSize = 0;
                        if (fs.existsSync(walPath)) {
                            const stWal = fs.statSync(walPath);
                            walSize = stWal.size;
                            if (stWal.mtimeMs > mtime) mtime = stWal.mtimeMs;
                        }
                        if (!convMap[cid]) convMap[cid] = { cid, dbSize: 0, walSize: 0, brainSize: 0, msgCount: 0, mtime: 0 };
                        convMap[cid].dbSize = stDb.size;
                        convMap[cid].walSize = walSize;
                        convMap[cid].mtime = mtime;
                    } catch (_) {}
                }
            }
        }

        // 2. Scan Brain directories
        if (fs.existsSync(brainDir)) {
            const brainConvs = fs.readdirSync(brainDir).filter(f => f.includes('-'));
            for (const cid of brainConvs) {
                const cdir = path.join(brainDir, cid);
                if (!convMap[cid]) convMap[cid] = { cid, dbSize: 0, walSize: 0, brainSize: 0, msgCount: 0, mtime: 0 };
                try {
                    const st = fs.statSync(cdir);
                    if (st.mtimeMs > convMap[cid].mtime) convMap[cid].mtime = st.mtimeMs;

                    const msgDir = path.join(cdir, '.system_generated', 'messages');
                    if (fs.existsSync(msgDir)) {
                        const mfiles = fs.readdirSync(msgDir);
                        convMap[cid].msgCount = mfiles.length;
                        for (const mf of mfiles) {
                            try {
                                convMap[cid].brainSize += fs.statSync(path.join(msgDir, mf)).size;
                            } catch (_) {}
                        }
                    }

                    const rootFiles = fs.readdirSync(cdir);
                    for (const rf of rootFiles) {
                        const rfp = path.join(cdir, rf);
                        try {
                            const fst = fs.statSync(rfp);
                            if (fst.isFile()) convMap[cid].brainSize += fst.size;
                        } catch (_) {}
                    }
                } catch (_) {}
            }
        }

        function fmt(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return n.toString();
        }

        function fmtExact(n) {
            return n.toLocaleString('en-US');
        }

        const convList = Object.values(convMap).sort((a, b) => b.mtime - a.mtime);
        if (convList.length === 0) return tokenAnalyticsState;

        // Active conversation is the most recently updated one
        const active = convList[0];
        const activeGenBytes = (active.dbSize * 0.55) + active.brainSize;
        const activeOutTokens = Math.max(1000, Math.round(activeGenBytes / 3.4));
        const activeInTokens = Math.max(1000, Math.round(active.msgCount * 120000));
        const activeCachedTokens = Math.round(activeInTokens * 0.986);
        const activeTotTokens = activeInTokens + activeOutTokens;

        let globalConvs = convList.length;
        let globalTotTokens = 0;

        const renderedList = convList.map((c, idx) => {
            const genBytes = (c.dbSize * 0.55) + c.brainSize;
            const outTok = Math.max(500, Math.round(genBytes / 3.4));
            const inTok = Math.max(500, Math.round(c.msgCount * 120000));
            const totTok = inTok + outTok;
            globalTotTokens += totTok;

            const d = new Date(c.mtime);
            const mm = (d.getMonth() + 1).toString().padStart(2, '0');
            const dd = d.getDate().toString().padStart(2, '0');
            const hh = d.getHours().toString().padStart(2, '0');
            const mi = d.getMinutes().toString().padStart(2, '0');
            const timeStr = `${d.getFullYear()}-${mm}-${dd} ${hh}:${mi}`;

            return {
                cid: c.cid,
                cidShort: c.cid.slice(0, 8) + '...',
                isActive: idx === 0,
                timeStr: timeStr,
                msgs: c.msgCount,
                outFormatted: fmt(outTok),
                outExact: fmtExact(outTok),
                totalFormatted: fmt(totTok),
                totalExact: fmtExact(totTok)
            };
        });

        tokenAnalyticsState = {
            activeConvId: active.cid,
            activeConvShort: active.cid.slice(0, 8) + '...',
            activeRequests: active.msgCount,
            activeInputFormatted: fmt(activeInTokens),
            activeInputExact: fmtExact(activeInTokens),
            activeInputNum: activeInTokens,
            activeOutputFormatted: fmt(activeOutTokens),
            activeOutputExact: fmtExact(activeOutTokens),
            activeOutputNum: activeOutTokens,
            activeCachedFormatted: fmt(activeCachedTokens),
            activeCachedExact: fmtExact(activeCachedTokens),
            activeCachedNum: activeCachedTokens,
            activeCachedPercent: active.msgCount > 0 ? '98.6%' : '0%',
            activeTotalFormatted: fmt(activeTotTokens),
            activeTotalExact: fmtExact(activeTotTokens),
            activeTotalNum: activeTotTokens,

            globalConvsCount: globalConvs,
            globalTotalFormatted: fmt(globalTotTokens),
            globalTotalExact: fmtExact(globalTotTokens),
            globalTotalNum: globalTotTokens,

            conversationsList: renderedList
        };
        return tokenAnalyticsState;
    } catch (_) {
        return tokenAnalyticsState;
    }
}

module.exports = {
    tokenAnalyticsState,
    computeLiveTokenAnalytics
};
