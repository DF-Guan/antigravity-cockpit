# =====================================================
# build-and-publish.ps1 — 发布流程快捷指导
# =====================================================

# 步骤 1：本地打包（生成 .vsix 离线安装包）
node publish.mjs

# 步骤 2：发布到 Open VSX（需要先在 open-vsx.org 注册并生成 Token）
# $env:OPEN_VSX_TOKEN = "your_token_here"
# node publish.mjs --open-vsx

# 步骤 3：发布到 VS Code Marketplace（需要 Azure DevOps PAT）
# $env:VSCE_PAT = "your_azure_pat_here"
# node publish.mjs --vscode

# 步骤 4：同时发布到两个市场
# node publish.mjs --all
