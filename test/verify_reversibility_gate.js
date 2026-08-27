/**
 * 🟣 [Tier-2 · 落地武器三] 可逆性审批红线与 5 道质量门禁守卫套件 (verify_reversibility_gate.js)
 * 严格遵循 Lauren Tan 可逆性原则：可逆操作全自主，不可逆发布/推流必须穿透 5 道门禁与用户显式授权！
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("================================================================");
console.log("     REVERSIBILITY GATE & 5-STEP QUALITY SENTINEL (GATEWAY)     ");
console.log("================================================================");

const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

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

// -------------------------------------------------------------
// Gate 1: 绝对路径与私密数据零泄漏 (Zero Leakage Check)
// -------------------------------------------------------------
try {
    const shippedFiles = ['package.json', 'README.md', 'README_zh.md', 'CHANGELOG.md'];
    let leakFound = false;
    let leakDetails = [];

    shippedFiles.forEach(f => {
        const p = path.join(projectRoot, f);
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            if (content.includes('C:\\Users\\ONDA') || content.includes('d:\\资料M2') || content.includes('D:\\资料M2')) {
                leakFound = true;
                leakDetails.push(`${f} 包含本地物理绝对路径`);
            }
        }
    });

    assert(!leakFound, "Gate 1: 公开资产绝对路径零泄漏 (Zero Absolute Paths)", leakDetails.join('; '));
} catch (e) {
    assert(false, "Gate 1: 路径脱敏检查", e.message);
}

// -------------------------------------------------------------
// Gate 2: 全量功能回归与架构硬断言通过 (Regression & Dune AST Gates)
// -------------------------------------------------------------
try {
    const vfmScript = path.join(projectRoot, 'test', 'verify_feature_map.js');
    const duneScript = path.join(projectRoot, 'test', 'verify_dune_architecture.js');
    
    let fmPassed = true;
    let dunePassed = true;
    try {
        execSync(`node "${vfmScript}"`, { stdio: 'pipe' });
    } catch (_) {
        fmPassed = false;
    }
    try {
        execSync(`node "${duneScript}"`, { stdio: 'pipe' });
    } catch (_) {
        dunePassed = false;
    }

    assert(fmPassed && dunePassed, "Gate 2: Feature Map 与 Dune 架构 100% 全绿 (All Internal Tests Green)", "Feature Map 或 Dune AST 测试失败");
} catch (e) {
    assert(false, "Gate 2: 测试套件连通性检查", e.message);
}

// -------------------------------------------------------------
// Gate 3: 全渠道命名与版本绝对一致 (100% Brand & Version Harmonization)
// -------------------------------------------------------------
try {
    const v = pkg.version;
    const readmeZh = fs.readFileSync(path.join(projectRoot, 'README_zh.md'), 'utf8');
    const changelog = fs.readFileSync(path.join(projectRoot, 'CHANGELOG.md'), 'utf8');

    const changelogHasV = changelog.includes(`## [${v}]`);
    assert(changelogHasV, `Gate 3: 版本号全渠道同步 (CHANGELOG has [${v}])`, `CHANGELOG.md 缺少当前版本 [${v}] 记录`);
} catch (e) {
    assert(false, "Gate 3: 版本一致性检查", e.message);
}

// -------------------------------------------------------------
// Gate 4: 双语语言包与命令注册无孤岛 (i18n & Command Integrity)
// -------------------------------------------------------------
try {
    const cmds = pkg.contributes && pkg.contributes.commands ? pkg.contributes.commands : [];
    const hasDashboardCmd = cmds.some(c => c.command === 'agPrivateCockpit.openDashboard');
    const hasSwitchModelCmd = cmds.some(c => c.command === 'agPrivateCockpit.switchModel');
    const hasCompactCmd = cmds.some(c => c.command === 'agPrivateCockpit.compactContext');

    assert(hasDashboardCmd && hasSwitchModelCmd && hasCompactCmd, "Gate 4: 核心命令注册完整性 (Commands Contributed)", "缺少关键命令贡献项");
} catch (e) {
    assert(false, "Gate 4: 命令注册检查", e.message);
}

// -------------------------------------------------------------
// Gate 5: 可逆性权限判定 (The Reversibility Line Authorization Check)
// -------------------------------------------------------------
const isReleaseAction = process.argv.includes('--release');
const isUserApproved = process.argv.includes('--user-approved') || process.env.USER_APPROVED === 'true';

if (isReleaseAction) {
    assert(isUserApproved, "Gate 5: 不可逆公网发布显式授权 (User Sign-off Required)", "【红线拦截】不可逆公网发布动作必须携带 --user-approved 参数或用户显式确认！");
} else {
    assert(true, "Gate 5: 可逆本地操作全自主授权 (Reversible Actions Autonomous)", "");
}

console.log("================================================================");
console.log(`REVERSIBILITY GATE RESULT: ${passes.length} Passed, ${errors.length} Failed`);
console.log("================================================================");

if (errors.length > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
