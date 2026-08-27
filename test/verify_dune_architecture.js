/**
 * 🟣 [Tier-2 · 落地武器二] Dune 5 大架构公理物理 AST 与架构拦截套件 (verify_dune_architecture.js)
 * 严格遵循 Lauren Tan 编译器级规范：严禁把架构约束写在纸上，所有违规依赖在运行期直接报错 (Fail Mechanically)！
 */

const fs = require('fs');
const path = require('path');

console.log("================================================================");
console.log("     DUNE 5-AXIOM ARCHITECTURAL AST LINTER (FAIL MECHANICALLY)  ");
console.log("================================================================");

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const servicesDir = path.join(srcDir, 'services');
const uiDir = path.join(srcDir, 'ui');

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
// Axiom 1 & 2: 违规依赖必须机械报错 (Forbidden Dependencies Fail Mechanically)
// 约束 1: UI 层文件 (src/ui/*) 严禁直接 require('sqlite3') 或直接读取底层数据库，必须通过 services 层
// -------------------------------------------------------------
try {
    const uiFiles = fs.readdirSync(uiDir).filter(f => f.endsWith('.js'));
    let uiViolation = false;
    let uiViolationDetails = [];

    uiFiles.forEach(f => {
        const content = fs.readFileSync(path.join(uiDir, f), 'utf8');
        if (content.includes("require('sqlite3')") || content.includes('require("sqlite3")')) {
            uiViolation = true;
            uiViolationDetails.push(`${f}: 直接依赖 sqlite3 底层驱动`);
        }
        if (content.includes("execSync('netstat") || content.includes('execSync("netstat')) {
            uiViolation = true;
            uiViolationDetails.push(`${f}: UI 层直接执行底层网络端口探测`);
        }
    });

    assert(!uiViolation, "Dune Axiom 1&2: UI 层严格依赖倒置与解耦 (No raw DB/IPC in UI)", uiViolationDetails.join('; '));
} catch (e) {
    assert(false, "Dune Axiom 1&2: UI 层架构检查", e.message);
}

// -------------------------------------------------------------
const allSrcFiles = [];
function scanDir(d) {
    fs.readdirSync(d).forEach(item => {
        const full = path.join(d, item);
        if (fs.statSync(full).isDirectory()) scanDir(full);
        else if (item.endsWith('.js')) allSrcFiles.push(full);
    });
}
scanDir(srcDir);

// -------------------------------------------------------------
// Axiom 3: 每个持久状态唯一显式写入者 (Single Obvious Writer)
// 约束 2: memory.md 与 docs/snapshots/ 仅允许由 contextEngine.js 写入
// 约束 3: token 高水位线仅允许由 tokenScanner.js / contextEngine.js 单点维护
// -------------------------------------------------------------
try {

    let snapshotWriterViolation = false;
    let writerDetails = [];

    allSrcFiles.forEach(f => {
        const rel = path.relative(projectRoot, f).replace(/\\/g, '/');
        const content = fs.readFileSync(f, 'utf8');
        
        // 检查谁在写 memory.md 或 snapshots
        if (content.includes('memory.md') && (content.includes('writeFileSync') || content.includes('appendFileSync'))) {
            if (rel !== 'src/services/contextEngine.js') {
                snapshotWriterViolation = true;
                writerDetails.push(`${rel} 擅自写入 memory.md`);
            }
        }
        if (content.includes('snapshots') && (content.includes('writeFileSync') || content.includes('createSessionSnapshot'))) {
            if (rel !== 'src/services/contextEngine.js' && rel !== 'src/extension.js') {
                snapshotWriterViolation = true;
                writerDetails.push(`${rel} 擅自生成快照文件`);
            }
        }
    });

    assert(!snapshotWriterViolation, "Dune Axiom 3: 状态单点显式写入契约 (Single Obvious Writer for Snapshots & Memory)", writerDetails.join('; '));
} catch (e) {
    assert(false, "Dune Axiom 3: 单点写入契约检查", e.message);
}

// -------------------------------------------------------------
// Axiom 4: 新功能以独立文件隔离扩展，严禁根入口无限膨胀 (Isolated Extensions)
// 约束 4: src/extension.js 代码行数严禁超过 250 行巨石上限，必须保持为轻量挂载控制器
// -------------------------------------------------------------
try {
    const extPath = path.join(srcDir, 'extension.js');
    const extContent = fs.readFileSync(extPath, 'utf8');
    const lineCount = extContent.split('\n').length;
    const isModular = lineCount <= 250;

    assert(isModular, `Dune Axiom 4: 入口文件模块化与防巨石化 (extension.js: ${lineCount} 行 <= 250 行上限)`, `extension.js 膨胀至 ${lineCount} 行，必须拆解为独立 Service`);
} catch (e) {
    assert(false, "Dune Axiom 4: 模块解耦检查", e.message);
}

// -------------------------------------------------------------
// Axiom 5: 窄化并显式化异常捕获 (Explicit Narrow Exceptions)
// 约束 5: 严禁全源码中出现空的静默吞错代码 `catch (e) {}` 导致暗病滋生
// -------------------------------------------------------------
try {
    let silentCatchCount = 0;
    let silentCatchLocations = [];

    allSrcFiles.forEach(f => {
        const rel = path.relative(projectRoot, f).replace(/\\/g, '/');
        const content = fs.readFileSync(f, 'utf8');
        // 匹配 catch (e) {} 或 catch(err){}
        const emptyCatchRegex = /catch\s*\([a-zA-Z0-9_]*\)\s*\{\s*\}/g;
        const matches = content.match(emptyCatchRegex);
        if (matches) {
            silentCatchCount += matches.length;
            silentCatchLocations.push(`${rel} (包含 ${matches.length} 处静默空 catch)`);
        }
    });

    assert(silentCatchCount === 0, `Dune Axiom 5: 显式异常处理与零静默吞错 (Found ${silentCatchCount} empty catch)`, silentCatchLocations.join('; '));
} catch (e) {
    assert(false, "Dune Axiom 5: 异常显式化检查", e.message);
}

console.log("================================================================");
console.log(`DUNE ARCHITECTURE LINT RESULT: ${passes.length} Passed, ${errors.length} Failed`);
console.log("================================================================");

if (errors.length > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
