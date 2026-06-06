# 🏗 Hit It — Architecture & Stack

> Last updated: 2026-06-01

---

## Philosophy

**Local-first.** The browser is the database. The server is a sync target, not the UI's source of truth. This is how Linear feels instant — and how Hit It does too.

**Solo → SaaS.** Architect for one user today. Flip a switch for 1,000 teams tomorrow.

**Boring is fast.** TypeScript everywhere. No exotic languages. Hireable, maintainable, replaceable.

---

## Layer Map

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Tauri Desktop│  │ Browser (PWA)│  │ Mobile (PWA wrap)│ │
│  │   Rust       │  │   Next.js    │  │   Capacitor      │ │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘ │
│         │                 │                    │           │
│         └─────────────────┴────────────────────┘           │
│                           │                                │
│         ┌─────────────────┴──────────┐                 │
│         │     Next.js 16 App Router     │                 │
│         │  React 19 + Tailwind CSS v4   │                 │
│         └──────────────┬───────────────┘                 │
│                          │                                 │
│         ┌────────────────┴──────────────┐                  │
│         │   Zustand (local UI state)    │                  │
│         │   GSAP (animations)           │                  │
│         │   Custom hooks (shortcuts,      │                  │
│         │   animations, online/offline)  │                  │
│         └──────────────┬──────────────────┘                  │
│                        │                                   │
│         ┌──────────────┴──────────────┐                   │
│         │      Dexie.js / IndexedDB    │                   │
│         │   (Local source of truth)    │                   │
│         └──────────────┬────────────────┘                   │
└──────────────────────┼────────────────────────────────────┘
                       │
┌──────────────────────┼────────────────────────────────────┐
│  SERVER (Sprint 5+)  │                                    │
│  ┌───────────────────┴────────────────────┐               │
│  │        Next.js API Routes + tRPC         │               │
│  │     TypeScript end-to-end typesafety     │               │
│  └───────────────────┬────────────────────┘               │
│                      │                                     │
│         ┌──────────┴──────────┐                         │
│         │   PostgreSQL + Drizzle │                         │
│         │   (Authoritative store)│                         │
│         └──────────┬──────────┘                         │
│                    │                                       │
│         ┌──────────┴──────────┐                         │
│         │    Redis (cache/     │                         │
│         │    session store)     │                         │
│         └───────────────────────┘                         │
└───────────────────────────────────────────────────────────┘
```

---

## Technology Choices

### Frontend

| Tech | Version | Why |
|------|---------|-----|
| **Next.js** | 16.2.6 | App Router, Turbopack, SSR/SPA hybrid |
| **React** | 19.2.6 | Latest stable, concurrent features |
| **TypeScript** | 6.0.3 | End-to-end typesafety |
| **Tailwind CSS** | 4.3.0 | CSS-native tokens, 35× faster builds |
| **Zustand** | 5.0.13 | Minimal, no providers, excellent TS |
| **GSAP** | 3.15.0 | 60fps animations, scroll triggers, timelines |
| **@gsap/react** | 2.1.2 | useGSAP hook, automatic cleanup |
| **lucide-react** | 1.16.0 | Consistent, tree-shakeable icons |
| **Dexie.js** | 4.4.3 | Typed IndexedDB wrapper, transactions |

### Backend (Planned — Sprint 5)

| Tech | Version | Why |
|------|---------|-----|
| **Next.js API Routes** | 16.2.6 | Same framework, shared types |
| **tRPC** | 11.x | End-to-end typesafe APIs, no codegen |
| **PostgreSQL** | 15+ | Battle-tested, Drizzle-native |
| **Drizzle ORM** | 0.30+ | Type-safe SQL, zero runtime bloat |
| **Redis** | 7+ | Session cache, sync pub/sub |
| **Clerk** | 5.x | Auth, SSO, session management |

### Desktop

| Tech | Version | Why |
|------|---------|-----|
| **Tauri v2** | 2.x | 600KB binaries, Rust, native APIs |
| **Rust** | 1.75+ | Memory safety, async runtime |

---

## Build Pipeline

```
Development
├── npm run dev        → Next.js dev server (localhost:3000)
├── npm run tauri:dev  → Rust + Next.js concurrently (desktop window)
└── HMR via Turbopack  → 4s cold builds, instant incremental

Production Web
├── npm run build      → next build (static export to dist/)
└── Deploy to Vercel / Railway / Self-host

Production Desktop
├── npm run build      → Next.js static export
├── npm run tauri:build → Rust compile + package (.dmg, .msi, .AppImage, .deb)
└── Distribute via GitHub Releases / website
```

---

## Performance Budget

| Metric | Target | Method |
|--------|--------|--------|
| First Contentful Paint | < 1.0s | Static export, minimal JS |
| Time to Interactive | < 1.5s | Client-side hydration, no blocking requests |
| Issue create → render | < 50ms | Optimistic Zustand update, no network wait |
| List scroll 1000 items | 60fps | Virtualization (TanStack Virtual, Sprint 4+) |
| Bundle size (initial) | < 200KB | Code splitting, tree shaking, dynamic imports |
| Desktop binary | < 5MB | Tauri (Rust) vs Electron (150MB+) |

---

## Security Model

1. **Local-first data** never leaves the device unless explicitly synced.
2. **IndexedDB** is origin-scoped; no cross-origin access.
3. **Tauri** CSP restricts external resource loading.
4. **Auth tokens** (Sprint 5) stored in httpOnly cookies, never localStorage.
5. **Payment tokens** never touch client — Paddle/adapter handles checkout.

---

*Stack decisions are documented here so future contributors (or future you) understand the trade-offs.*