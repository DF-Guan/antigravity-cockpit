# 🤝 Contributing to Antigravity Private Cockpit

Thank you for your interest in contributing to **Antigravity Private Cockpit**! We welcome bug reports, feature suggestions, code enhancements, and documentation improvements.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DF-Guan/antigravity-cockpit.git
   cd antigravity-cockpit
   ```

2. **Install development toolchain**:
   ```bash
   npm install -g @vscode/vsce ovsx
   ```

3. **Validate code syntax & integrity**:
   ```bash
   node -c src/extension.js
   node -c src/services/contextEngine.js
   node -c src/services/quotaService.js
   node -c src/services/tokenScanner.js
   ```

---

## 🛡️ Core Contribution Guidelines

- **🔒 100% Offline & Zero Telemetry**:
  - The extension must NEVER make outbound telemetry requests to any third-party server.
  - All metrics must be computed strictly locally from the local Language Server and SQLite storage.
- **⚡ Performance First**:
  - Keep status bar updates sub-millisecond and non-blocking.
  - Webview dashboard must remain snappy with zero heavy client-side bundle bloat.
- **🌐 Bilingual Consistency**:
  - Any new UI text or tooltip must support both English and Chinese (`src/utils/i18n.js`).

---

## 🚀 Pull Request Process

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/my-cool-feature
   ```
2. Commit your changes following standard semantic commits (`feat:`, `fix:`, `docs:`, `chore:`).
3. Ensure all tests pass.
4. Submit a Pull Request targeting `main`.
