//﻿​‌​​​​​‌​‌​‌​‌​‌​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​‌​​‌​​​‌​​​‌​​​‌‌​​​‌​‌‌​‌​‌​​​‌‌‌​‌‌‌​‌​‌​‌‌​​​​‌​‌‌​‌‌‌​​‌‌‌‌‌​​​‌​‌​​‌‌​‌​​‌​​‌​‌​​​‌‌‌​​‌‌‌​‌​​​‌‌​​​​​​‌‌​‌‌​​​‌‌​​​‌​​‌‌​‌​​​‌‌​​​​‌​‌‌​​​‌‌​‌‌​​​‌‌​​‌‌​​​​​‌‌​​​‌​​​‌‌‌​​​​‌‌​​‌​​​​‌‌​​​​​‌‌​​​‌​​‌‌​​​​‌​​‌‌​​​‌​​‌‌​​‌​‍
const https = require('https');
const { exec, execFile } = require('child_process');
const { formatTime } = require('../utils/i18n');

// 🔒 Shared state object across modules (Object reference preserved)
const liveQuotaState = {
    isLive: false,
    isLoading: true,
    lastSyncTime: '--:--:--',
    availableModels: [],
    geminiModels: ['Gemini 3.8 Flash', 'Gemini 3.7 Flash', 'Gemini 3.5 Flash', 'Gemini 3.1 Pro'],
    claudeModels: ['Claude Sonnet 4.6 (Thinking)', 'Claude Opus 4.6 (Thinking)', 'GPT-OSS 120B (Medium)'],
    gemini: {
        weeklyPercent: 0,
        weeklyResetTimeZh: '7天周期',
        weeklyResetTimeEn: '7-Day Rolling',
        fiveHourPercent: 0,
        fiveHourResetTimeZh: '5小时滚动刷新',
        fiveHourResetTimeEn: '5-hour rolling reset'
    },
    claude: {
        weeklyPercent: 0,
        weeklyResetTimeZh: '7天周期',
        weeklyResetTimeEn: '7-Day Rolling',
        fiveHourPercent: 0,
        fiveHourResetTimeZh: '5小时滚动刷新',
        fiveHourResetTimeEn: '5-hour rolling reset'
    }
};

let cachedPort = null;
let cachedToken = null;

function getLiveQuotaState() {
    return liveQuotaState;
}

// Low-level HTTPS query to local language server (< 25ms)
function queryEndpoint(port, token) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const postData = JSON.stringify({ forceRefresh: true });
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: '/exa.language_server_pb.LanguageServerService/RetrieveUserQuotaSummary',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-codeium-csrf-token': token,
                'X-CSRF-Token': token,
                'Content-Length': Buffer.byteLength(postData)
            },
            rejectUnauthorized: false,
            timeout: 800
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                const elapsed = Date.now() - start;
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.response && parsed.response.groups) {
                        resolve({ port, token, json: parsed, elapsed });
                    } else {
                        reject(new Error('Invalid quota response structure'));
                    }
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
        try {
            req.write(postData);
            req.end();
        } catch (e) {
            reject(e);
        }
    });
}


// Query user status & dynamically discover all available models (< 25ms)
function queryUserStatus(port, token) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({});
        const options = {
            hostname: '127.0.0.1',
            port: port,
            path: '/exa.language_server_pb.LanguageServerService/GetUserStatus',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-codeium-csrf-token': token,
                'X-CSRF-Token': token,
                'Content-Length': Buffer.byteLength(postData)
            },
            rejectUnauthorized: false,
            timeout: 1200
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (_) {
                    resolve(null);
                }
            });
        });

        req.on('error', () => resolve(null));
        req.on('timeout', () => { req.destroy(); resolve(null); });
        try {
            req.write(postData);
            req.end();
        } catch (_) {
            resolve(null);
        }
    });
}

// 🪟 Windows Prober: PowerShell Win32_Process + netstat -ano
function probeWindows() {
    return new Promise((resolve, reject) => {
        const psCmd = `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match "csrf_token" } | Select-Object ProcessId, CommandLine | ConvertTo-Json -Compress`;
        execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psCmd], { timeout: 3000 }, (err, stdout) => {
            if (err || !stdout) return reject(err || new Error("No language server found on Windows"));

            let procs = [];
            try {
                const parsed = JSON.parse(stdout.trim());
                procs = Array.isArray(parsed) ? parsed : [parsed];
            } catch (_) {
                return reject(new Error("Failed to parse Windows process JSON"));
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
                    const tm = cmd.match(/--csrf_token[\s=]+([a-zA-Z0-9-]+)/);
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
                        } catch (_) { /* Explicit safe fallback: non-blocking */ }
                    }
                }

                if (!resolved) reject(new Error("Windows netstat port scan failed"));
            });
        });
    });
}

// 🍎 macOS (Darwin) Prober: ps -eo pid,command + lsof -nP -iTCP -sTCP:LISTEN -p <PID>
function probeDarwin() {
    return new Promise((resolve, reject) => {
        exec('ps -eo pid,command | grep -i language_server', { timeout: 3000 }, (err, stdout) => {
            if (err || !stdout) return reject(err || new Error("No language server process on macOS"));

            const lines = stdout.split('\n');
            const targetProcs = [];

            for (const line of lines) {
                if (line.includes('grep')) continue;
                const tm = line.match(/--csrf_token[\s=]+([a-zA-Z0-9-]+)/);
                const pidMatch = line.trim().match(/^(\d+)/);
                if (tm && pidMatch) {
                    targetProcs.push({ pid: pidMatch[1], token: tm[1], line });
                }
            }

            if (targetProcs.length === 0) return reject(new Error("No matching language_server token found on macOS"));

            let completed = 0;
            let resolved = false;

            targetProcs.forEach(tp => {
                // Query exact listening ports using macOS native lsof
                exec(`lsof -nP -iTCP -sTCP:LISTEN -p ${tp.pid}`, { timeout: 2000 }, async (lsofErr, lsofOut) => {
                    if (resolved) return;
                    const ports = [];

                    if (!lsofErr && lsofOut) {
                        const lLines = lsofOut.split('\n');
                        for (const ll of lLines) {
                            const pm = ll.match(/[:.](\d+)\s+\(LISTEN\)/);
                            if (pm) {
                                const p = parseInt(pm[1]);
                                if (!isNaN(p) && !ports.includes(p)) ports.push(p);
                            }
                        }
                    }

                    // Try direct ports first
                    for (const p of ports) {
                        try {
                            const res = await queryEndpoint(p, tp.token);
                            if (res && res.json && !resolved) {
                                resolved = true;
                                cachedPort = res.port;
                                cachedToken = res.token;
                                resolve(res);
                                return;
                            }
                        } catch (_) { /* Explicit safe fallback: non-blocking */ }
                    }

                    // Fallback to base port range scan if lsof didn't catch it
                    const basePortMatch = tp.line.match(/--extension_server_port\s+(\d+)/);
                    if (basePortMatch && !resolved) {
                        const basePort = parseInt(basePortMatch[1]);
                        for (let delta = 0; delta <= 30; delta++) {
                            try {
                                const res = await queryEndpoint(basePort + delta, tp.token);
                                if (res && res.json && !resolved) {
                                    resolved = true;
                                    cachedPort = res.port;
                                    cachedToken = res.token;
                                    resolve(res);
                                    return;
                                }
                            } catch (_) { /* Explicit safe fallback: non-blocking */ }
                        }
                    }

                    completed++;
                    if (completed >= targetProcs.length && !resolved) {
                        reject(new Error("macOS lsof/scan probe failed"));
                    }
                });
            });
        });
    });
}

// 🐧 Linux Prober: ps -eo pid,command + ss -tulpn / lsof
function probeLinux() {
    return new Promise((resolve, reject) => {
        exec('ps -eo pid,command | grep -i language_server', { timeout: 3000 }, (err, stdout) => {
            if (err || !stdout) return reject(err || new Error("No language server process on Linux"));

            const lines = stdout.split('\n');
            const targetProcs = [];

            for (const line of lines) {
                if (line.includes('grep')) continue;
                const tm = line.match(/--csrf_token[\s=]+([a-zA-Z0-9-]+)/);
                const pidMatch = line.trim().match(/^(\d+)/);
                if (tm && pidMatch) {
                    targetProcs.push({ pid: pidMatch[1], token: tm[1], line });
                }
            }

            if (targetProcs.length === 0) return reject(new Error("No matching language_server token on Linux"));

            let completed = 0;
            let resolved = false;

            targetProcs.forEach(tp => {
                // Try modern Linux `ss -tulpn` first, fallback to lsof
                exec(`ss -tulpn 2>/dev/null | grep ${tp.pid} || lsof -nP -iTCP -sTCP:LISTEN -p ${tp.pid} 2>/dev/null`, { timeout: 2000 }, async (cmdErr, cmdOut) => {
                    if (resolved) return;
                    const ports = [];

                    if (!cmdErr && cmdOut) {
                        const cLines = cmdOut.split('\n');
                        for (const cl of cLines) {
                            // Match ports from ss or lsof output
                            const ssMatch = cl.match(/(?:127\.0\.0\.1|0\.0\.0\.0|\*|::):(\d+)/);
                            const lsofMatch = cl.match(/[:.](\d+)\s+\(LISTEN\)/);
                            const foundPort = ssMatch ? parseInt(ssMatch[1]) : (lsofMatch ? parseInt(lsofMatch[1]) : null);
                            if (foundPort && !isNaN(foundPort) && !ports.includes(foundPort)) {
                                ports.push(foundPort);
                            }
                        }
                    }

                    // Direct ports check
                    for (const p of ports) {
                        try {
                            const res = await queryEndpoint(p, tp.token);
                            if (res && res.json && !resolved) {
                                resolved = true;
                                cachedPort = res.port;
                                cachedToken = res.token;
                                resolve(res);
                                return;
                            }
                        } catch (_) { /* Explicit safe fallback: non-blocking */ }
                    }

                    // Fallback range scan
                    const basePortMatch = tp.line.match(/--extension_server_port\s+(\d+)/);
                    if (basePortMatch && !resolved) {
                        const basePort = parseInt(basePortMatch[1]);
                        for (let delta = 0; delta <= 30; delta++) {
                            try {
                                const res = await queryEndpoint(basePort + delta, tp.token);
                                if (res && res.json && !resolved) {
                                    resolved = true;
                                    cachedPort = res.port;
                                    cachedToken = res.token;
                                    resolve(res);
                                    return;
                                }
                            } catch (_) { /* Explicit safe fallback: non-blocking */ }
                        }
                    }

                    completed++;
                    if (completed >= targetProcs.length && !resolved) {
                        reject(new Error("Linux ss/lsof probe failed"));
                    }
                });
            });
        });
    });
}

// 🌐 Unified Cross-Platform Dispatcher (< 30ms, 100% Reliable across Win/macOS/Linux)
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

    const platform = process.platform;
    if (platform === 'win32') {
        return probeWindows();
    } else if (platform === 'darwin') {
        return probeDarwin();
    } else {
        return probeLinux();
    }
}

async function fetchLiveQuota(context, speedState, tokenState) {
    const nowTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (speedState) speedState.lastMeasuredTime = nowTime;

    try {
        const res = await probeLanguageServerQuota();
        if (res && res.json && res.json.response && res.json.response.groups) {
            // 🌟 Parallel live model discovery
            if (cachedPort && cachedToken) {
                queryUserStatus(cachedPort, cachedToken).then(userStatusRes => {
                    if (userStatusRes && userStatusRes.userStatus && userStatusRes.userStatus.cascadeModelConfigData) {
                        const configs = userStatusRes.userStatus.cascadeModelConfigData.clientModelConfigs || [];
                        const models = [];
                        const geminis = [];
                        const claudes = [];

                        configs.forEach(m => {
                            const lbl = m.label || '';
                            if (lbl && !models.includes(lbl)) models.push(lbl);
                            if (lbl.toLowerCase().includes('gemini') && !geminis.includes(lbl)) geminis.push(lbl);
                            else if ((lbl.toLowerCase().includes('claude') || lbl.toLowerCase().includes('gpt')) && !claudes.includes(lbl)) claudes.push(lbl);
                        });

                        if (models.length > 0) liveQuotaState.availableModels = models;
                        if (geminis.length > 0) liveQuotaState.geminiModels = geminis;
                        if (claudes.length > 0) liveQuotaState.claudeModels = claudes;
                    }
                }).catch(() => {});
            }
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
    getLiveQuotaState,
    queryEndpoint,
    probeWindows,
    probeDarwin,
    probeLinux,
    probeLanguageServerQuota,
    fetchLiveQuota
};
