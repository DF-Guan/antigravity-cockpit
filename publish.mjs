#!/usr/bin/env node
// ============================================================
//  publish.mjs  –  Antigravity Cockpit 一键发布脚本
//  用法:
//    node publish.mjs                    → 打包 .vsix (本地分发)
//    node publish.mjs --open-vsx         → 发布到 Open VSX 市场
//    node publish.mjs --vscode           → 发布到 VS Code Marketplace
//    node publish.mjs --all              → 同时发布到两个市场
//
//  发布前请先设置环境变量 (PowerShell):
//    $env:OPEN_VSX_TOKEN="<your-open-vsx-token>"
//    $env:VSCE_PAT="<your-azure-devops-pat>"
// ============================================================

import { execSync } from 'child_process';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VSIX_PATH = path.join(__dirname, 'dist', 'antigravity-cockpit-1.0.0.vsix');
const args = process.argv.slice(2);

function run(cmd, label) {
    console.log('\n▶  ' + label + '...');
    try {
        execSync(cmd, { stdio: 'inherit', cwd: __dirname });
        console.log('✅  ' + label + ' done');
    } catch (e) {
        console.error('❌  ' + label + ' failed: ' + e.message);
        process.exit(1);
    }
}

// 1. Package
mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
run(`vsce package --out "${VSIX_PATH}" --no-dependencies`, 'Packaging .vsix');

// 2. Publish to Open VSX
if (args.includes('--open-vsx') || args.includes('--all')) {
    if (!process.env.OPEN_VSX_TOKEN) {
        console.error('❌  Missing env var OPEN_VSX_TOKEN');
        process.exit(1);
    }
    run(`ovsx publish "${VSIX_PATH}" --pat ${process.env.OPEN_VSX_TOKEN}`, 'Publishing to Open VSX');
}

// 3. Publish to VS Code Marketplace
if (args.includes('--vscode') || args.includes('--all')) {
    if (!process.env.VSCE_PAT) {
        console.error('❌  Missing env var VSCE_PAT');
        process.exit(1);
    }
    run(`vsce publish --pat ${process.env.VSCE_PAT} --packagePath "${VSIX_PATH}"`, 'Publishing to VS Code Marketplace');
}

console.log('\n🎉  All done!');
console.log('📦  .vsix: ' + VSIX_PATH);
