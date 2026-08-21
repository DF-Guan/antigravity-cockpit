# Changelog

All notable changes to **Antigravity Private Cockpit** are documented here.

---

## [1.0.0] – 2026-08-21 🚀 Initial Release

### Added
- **Persistent Status Bar**: Always-visible real-time quota display with full model names (`✨ Gemini: xx% | 🤖 Claude/GPT: xx% | ⏱️ 5h: xx%`)
- **3-Tier Smart Alert**: Green (>50%) → Orange warning (<50%) → Red critical (<20%) status bar background
- **Hover Tooltip**: Rich markdown quota card with countdown timers (e.g. `6 days 18 hours`)
- **Responsive Webview Dashboard**: Auto-adapts from 280px side panel to 1200px full screen (CSS auto-fit grid)
- **Official Brand SVG UI**: Google Gemini aurora 4-point star + Anthropic Claude sunburst vector icons with official gradient palettes
- **Bilingual i18n**: One-click 🌐 中文/English switch syncing Dashboard, Tooltip, QuickPick menu & notifications globally
- **Custom Thresholds**: Configurable warning/critical alert percentages via IDE settings
- **Auto-Refresh**: Configurable 15-second background polling with manual refresh command
- **Compact Status Bar**: Optional compact display mode for space-saving layouts
- **Privacy-First Architecture**: Zero external network requests, zero plaintext credential storage
- **Custom App Icon**: 512×512 dark glassmorphism dual-arc tachometer icon
