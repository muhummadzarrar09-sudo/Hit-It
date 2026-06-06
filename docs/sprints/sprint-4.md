# 🖥 Sprint 4: Desktop, PWA, Offline, Performance

> **Goal:** Ship Hit It everywhere. Desktop app via Tauri. PWA for mobile. Offline badge. Performance tuned.

---

## ✅ Deliverables

### 1. Tauri v2 Desktop Application
- **Stack:** Rust-based wrapper (NOT Electron)
- **Why Tauri:** 600KB binary vs 150MB Electron. Memory-safe. Native OS integrations.
- **Platforms:** Windows, macOS, Linux from single codebase
- **Global Hotkey:** `Cmd/Ctrl + Shift + H` toggles window visibility anywhere
- **Single Instance:** Prevents multiple app windows
- **Window:** 1400×900, centered, resizable, native decorations

### 2. Progressive Web App (PWA)
- `manifest.json` — Installable on mobile/desktop
- Theme-aware icons, standalone display mode
- Service Worker caches app shell for offline loading

### 3. Offline Mode Detection
- Real-time `navigator.onLine` monitoring
- Offline badge in UI when connection drops
- App continues working (IndexedDB is already local-first)
- Sync indicator when connection restored

### 4. Performance Infrastructure
- **Next.js static export** (`output: 'export'`) for Tauri bundling
- **Bundle audit** setup — analyze JS chunks
- **Code splitting** — already handled by Next.js dynamic imports
- **Virtualized lists** prepped for 1000+ issues (TanStack Virtual ready)

---

## 📁 New Files

```
apps/web/
├── src-tauri/                 # Rust desktop scaffold
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/main.rs
│   └── capabilities/
│       └── default.json
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
├── src/components/
│   └── offline-indicator.tsx  # Network status badge
├── src/lib/
│   └── payment-adapter.ts     # Payment-agnostic interface (Sprint 6 prep)
└── next.config.ts             # Updated for static export
```

---

## 🎹 Global Hotkey

```rust
// Tauri main.rs
// Registers Cmd/Ctrl + Shift + H globally
// Even when app is hidden/minimized
// Toggles window visibility
```

---

## 📲 PWA Spec

- **Name:** Hit It
- **Short Name:** HitIt
- **Theme:** `#0f1117` (matches dark UI)
- **Background:** `#0f1117`
- **Display:** standalone
- **Orientation:** any
- **Scope:** /

---

## 🔌 Offline Architecture

Hit It is already offline-capable because of the local-first design:

```
User Action → Zustand Store → Dexie/IndexedDB → UI updates instantly
                                    ↓
                              (Future: Background sync to server)
```

The Service Worker ensures the **app shell** (HTML/JS/CSS) loads without network.
IndexedDB ensures the **data** is always available.

---

## 🏗 Tauri Build Commands

```bash
# Development (launches Rust + Next.js dev server)
npm run tauri:dev

# Production build (builds Next.js static, compiles Rust, packages installer)
npm run tauri:build
```

---

## 🎯 Success Criteria

- [ ] `npm run tauri:dev` opens native desktop window
- [ ] `Cmd+Shift+H` (or `Ctrl+Shift+H`) toggles window from anywhere
- [ ] App installs as PWA on Chrome/Android
- [ ] Disconnecting internet shows offline badge
- [ ] Reconnecting hides badge, shows sync ready
- [ ] Static export builds without errors

---

## 🔮 Sprint 5 Preview

- PostgreSQL + tRPC backend
- Clerk authentication
- TanStack Query for server reconciliation
- Real-time sync via WebSockets (PartyKit or Socket.io)
- Team invites + member roles

---

*Sprint 4 built: 2026-06-01*