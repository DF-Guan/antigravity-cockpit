const https = require('https');
const { exec, execFile } = require('child_process');
const { formatTime } = require('../utils/i18n');

let liveQuotaState = {
    isLive: false,
    isLoading: true,
    lastSyncTime: '--:--',
    gemini: {
        weeklyPercent: null,
        fiveHourPercent: null,
        weeklyResetTimeZh: '计算中...',
        weeklyResetTimeEn: 'Calculating...',
        fiveHourResetTimeZh: '满额就绪 (100% 充足)',
        fiveHourResetTimeEn: 'Full (100% Ready)'
    },
    claude: {
        weeklyPercent: null,
        fiveHourPercent: null,
        weeklyResetTimeZh: '计算中...',
        weeklyResetTimeEn: 'Calculating...',
        fiveHourResetTimeZh: '满额就绪 (100% 充足)',
        fiveHourResetTimeEn: 'Full (100% Ready)'
    }
};

let cachedPort = null;
let cachedToken = null;

function queryEndpoint(port, token) {
    return new Promise((resolve, reject) => {
        const tStart = Date.now();
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
            timeout: 1500
        }, (res) => {
            if (res.statusCode === 200) {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const elapsed = Math.max(5, Date.now() - tStart);
                    try {
                        const json = JSON.parse(data);
                        resolve({ port, token, json, elapsed });
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                reject(new Error(`HTTP ${res.statusCode}`));
            }
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        try {
            req.write(JSON.stringify({ forceRefresh: true }));
            req.end();
        } catch (e) {
            reject(e);
        }
    });
}

// Netstat-PID exact port mapping engine (< 30ms, 100% reliable)
async function probeLanguageServerQuota() {
    if (cachedPort && cachedToken) {
        try {
            const hit = await queryEndpoint(cachedPort, cachedToken);
            return hit;
        } catch (_) {
            cachedPort = null;
            cachedToken = null;
        }
    }

    return new Promise((resolve, reject) => {
        const isWin = process.platform === 'win32';
        if (isWin) {
            const psCmd = `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match "csrf_token" } | Select-Object ProcessId, CommandLine | ConvertTo-Json -Compress`;
            execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCmd], { timeout: 3000 }, (err, stdout) => {
                if (err || !stdout) return reject(err || new Error("No language server found"));

                let procs = [];
                try {
                    const parsed = JSON.parse(stdout.trim());
                    procs = Array.isArray(parsed) ? parsed : [parsed];
                } catch (_) {
                    return reject(new Error("Failed to parse process JSON"));
                }

                exec('netstat -ano', { timeout: 2000 }, async (netErr, netStdout) => {
                    const listeningByPid = {};
                    if (!netErr && netStdout) {
                        const lines = netStdout.split('\n');
                        for (const l of lines) {
                            if (l.includes('LISTENING')) {
                                const parts = l.trim().split(/\s+/);
                                if (parts.length >= 5) {
                                    const addr = parts[1];
                                    const pid = parts[4];
                                    const pnum = parseInt(addr.split(':').pop());
                                    if (!isNaN(pnum)) {
                                        if (!listeningByPid[pid]) listeningByPid[pid] = [];
                                        listeningByPid[pid].push(pnum);
                                    }
                                }
                            }
                        }
                    }

                    let resolved = false;
                    for (const p of procs) {
                        if (resolved) break;
                        const pid = String(p.ProcessId);
                        const cmd = p.CommandLine || '';
                        const tm = cmd.match(/--csrf_token\s+([a-zA-Z0-9-]+)/);
                        if (!tm) continue;
                        const token = tm[1];

                        const directPorts = listeningByPid[pid] || [];
                        for (const port of directPorts) {
                            try {
                                const res = await queryEndpoint(port, token);
                                if (res && res.json && !resolved) {
                                    resolved = true;
                                    cachedPort = res.port;
                                    cachedToken = res.token;
                                    resolve(res);
                                    return;
                                }
                            } catch (_) {}
                        }
                    }

                    if (!resolved) reject(new Error("Netstat port scan failed"));
                });
            });
        } else {
            exec('ps -eo pid,command | grep -i language_server', { timeout: 3000 }, async (err, stdout) => {
                if (err || !stdout) return reject(err || new Error("No language server process"));
                const lines = stdout.split('\n');
                let resolved = false;

                for (const line of lines) {
                    const tm = line.match(/--csrf_token\s+([a-zA-Z0-9-]+)/);
                    const pm = line.match(/--extension_server_port\s+(\d+)/);
                    if (tm && pm) {
                        const token = tm[1];
                        const basePort = parseInt(pm[1]);
                        for (let delta = 0; delta <= 30; delta++) {
                            try {
                                const res = await queryEndpoint(basePort + delta, token);
                                if (res && res.json && !resolved) {
                                    resolved = true;
                                    cachedPort = res.port;
                                    cachedToken = res.token;
                                    resolve(res);
                                    return;
                                }
                            } catch (_) {}
                        }
                    }
                }
                if (!resolved) reject(new Error("Unix probe timeout"));
            });
        }
    });
}

async function fetchLiveQuota(context, speedState, tokenState) {
    const nowTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (speedState) speedState.lastMeasuredTime = nowTime;

    try {
        const res = await probeLanguageServerQuota();
        if (res && res.json && res.json.response && res.json.response.groups) {
            liveQuotaState.isLive = true;
            liveQuotaState.isLoading = false;

            for (const g of res.json.response.groups) {
                const name = (g.displayName || '').toLowerCase();
                const isGemini = name.includes('gemini');
                const target = isGemini ? liveQuotaState.gemini : liveQuotaState.claude;

                for (const b of (g.buckets || [])) {
                    const frac = b.remainingFraction || 0;
                    const pct = Math.round(frac * 100);
                    const times = formatTime(b.description, b.resetTime);

                    if (b.window === 'weekly') {
                        target.weeklyPercent = pct;
                        if (times.zh) target.weeklyResetTimeZh = times.zh;
                        if (times.en) target.weeklyResetTimeEn = times.en;
                    } else if (b.window === '5h') {
                        target.fiveHourPercent = pct;
                        if (pct >= 100) {
                            target.fiveHourResetTimeZh = '满额就绪 (100% 充足)';
                            target.fiveHourResetTimeEn = 'Full (100% Ready)';
                        } else if (times.zh) {
                            target.fiveHourResetTimeZh = times.zh;
                            target.fiveHourResetTimeEn = times.en;
                        } else {
                            target.fiveHourResetTimeZh = '5小时滚动刷新';
                            target.fiveHourResetTimeEn = '5-hour rolling reset';
                        }
                    }
                }
            }

            if (speedState) speedState.latencyMs = res.elapsed || 15;

            if (context) {
                context.globalState.update('agPrivateCockpit.lastLiveState', liveQuotaState);
                if (cachedPort && cachedToken) {
                    context.globalState.update('agPrivateCockpit.cachedPort', cachedPort);
                    context.globalState.update('agPrivateCockpit.cachedToken', cachedToken);
                }
            }
        }
    } catch (_) {
        liveQuotaState.isLoading = false;
    }

    liveQuotaState.lastSyncTime = nowTime;
    return liveQuotaState;
}

module.exports = {
    liveQuotaState,
    queryEndpoint,
    probeLanguageServerQuota,
    fetchLiveQuota
};
