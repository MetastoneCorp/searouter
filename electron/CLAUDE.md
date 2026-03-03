[Root](../CLAUDE.md) > **electron**

---

# Electron Module - Desktop Application

> Last Updated: 2026-02-24 11:39:50

## Module Responsibility

The electron module provides a desktop wrapper for the web application:
- Native desktop application packaging
- System tray integration
- Auto-launching backend service
- Cross-platform support (Windows, macOS, Linux)

---

## Entry Points

- `main.js` - Electron main process
- `preload.js` - Preload script for IPC

---

## Key Files

| File | Description |
|------|-------------|
| `main.js` | Main Electron process, window management |
| `preload.js` | Preload script for secure IPC |
| `create-tray-icon.js` | System tray icon creation |
| `package.json` | Electron dependencies and build config |
| `icon.png` | Application icon |

---

## Build Configuration

From `package.json`:

```json
{
  "build": {
    "appId": "com.newapi.desktop",
    "productName": "New-API-App",
    "mac": {
      "target": ["dmg", "zip"],
      "extraResources": [
        {"from": "../new-api", "to": "bin/new-api"},
        {"from": "../web/dist", "to": "web/dist"}
      ]
    },
    "win": {
      "target": ["nsis", "portable"],
      "extraResources": [
        {"from": "../new-api.exe", "to": "bin/new-api.exe"}
      ]
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "extraResources": [
        {"from": "../new-api", "to": "bin/new-api"}
      ]
    }
  }
}
```

---

## Scripts

```bash
# Development
npm run dev-app    # Run in development mode

# Production
npm run start-app  # Run production build

# Build
npm run build      # Build for current platform
npm run build:mac  # Build for macOS
npm run build:win  # Build for Windows
npm run build:linux # Build for Linux
```

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| electron | 35.7.5 | Electron framework |
| electron-builder | ^24.9.1 | Build and packaging |
| cross-env | ^7.0.3 | Cross-platform env vars |

---

## Architecture

```
Electron App
    |
    +-- Main Process (main.js)
    |       |
    |       +-- Spawns Go backend (new-api binary)
    |       +-- Creates BrowserWindow
    |       +-- System tray
    |
    +-- Renderer Process (web/dist)
            |
            +-- React frontend
```

---

## FAQ

**Q: How does the app start the backend?**
A: The main process spawns the Go binary as a child process and loads the frontend from the bundled files.

**Q: How do I build for a specific platform?**
A: Run the appropriate build script: `npm run build:mac`, `npm run build:win`, or `npm run build:linux`.

---

## Related Files

- `main.js` - Main process
- `preload.js` - Preload script
- `package.json` - Build configuration

---

## Changelog

| Date | Change |
|------|--------|
| 2026-02-24 | Initial module documentation |
