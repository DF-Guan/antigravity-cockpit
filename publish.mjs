#!/usr/bin/env node
import { execSync } from 'child_process';
import { mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = pkg.version || '1.0.50';
const VSIX_PATH = path.join(__dirname, 'dist', `antigravity-cockpit-${version}.vsix`);
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
run(`vsce package --out "${VSIX_PATH}" --no-dependencies`, `Packaging .vsix (v${version})`);

// 2. Publish to Open VSX
if (args.includes('--open-vsx') || args.includes('--all')) {
    const token = process.env.OPEN_VSX_TOKEN || args.find(a => a.startsWith('--token='))?.split('=')[1];
    if (!token) {
        console.error('❌  Missing env var OPEN_VSX_TOKEN or --token=<PAT>');
        process.exit(1);
    }
    run(`ovsx publish "${VSIX_PATH}" --pat ${token}`, `Publishing v${version} to Open VSX`);
}

// 3. Publish to VS Code Marketplace
if (args.includes('--vscode') || args.includes('--all')) {
    if (!process.env.VSCE_PAT) {
        console.error('❌  Missing env var VSCE_PAT');
        process.exit(1);
    }
    run(`vsce publish --pat ${process.env.VSCE_PAT} --packagePath "${VSIX_PATH}"`, `Publishing v${version} to VS Code Marketplace`);
}

console.log('\n🎉  All done!');
console.log('📦  .vsix: ' + VSIX_PATH);
