# 📚 Hit It — Documentation Hub

> **Project:** Hit It — The Linear Spiritual Successor  
> **Started:** 2026-06-01  
> **Architecture:** Node.js + Next.js + TypeScript + IndexedDB local-first  
> **Author:** Solo dev → potential SaaS

---

## 📁 Folder Structure

```
docs/
├── README.md                          # You are here
├── session-logs/                      # Date-stamped progress records
│   └── session-2026-06-01.md         # Initial scaffold through Sprint 4
├── architecture/                      # System design docs
│   ├── sync-engine.md               # Local-first architecture
│   ├── stack.md                      # Tech stack & rationale
│   └── database-schema.md            # Dexie/PostgreSQL models
├── sprints/                           # Sprint-by-sprint build log
│   ├── sprint-0.md                   # Local issue tracker scaffold
│   ├── sprint-1.md                   # Backend + Auth (future)
│   ├── sprint-2.md                   # Projects + Cycles + Roadmap
│   ├── sprint-3.md                   # Triage + Relations + Comments + Saved Views + GSAP
│   └── sprint-4.md                   # Tauri Desktop + PWA + Offline + Performance
└── payments/
    └── stripe-alternatives-for-pakistan.md   # Payment processor research
```

---

## 🎯 Mission Statement

Build a **keyboard-first, local-first, blazingly fast** issue tracker that starts as a personal productivity tool and can graduate into a SaaS. Every decision prioritizes:

1. **Speed** — Optimistic UI, no spinners, 60fps animations
2. **Craft** — Every pixel intentional, every animation purposeful
3. **Solo → Team** — Architected for multiplayer from day one
4. **Pakistan-first** — Payment infrastructure that actually works at home

---

## 🛠 Current Stack (Latest Versions)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.6 | App Router, Turbopack |
| Runtime | React | 19.2.6 | UI layer |
| Language | TypeScript | 6.0.3 | End-to-end types |
| Styling | Tailwind CSS | 4.3.0 | CSS-native tokens |
| State | Zustand | 5.0.13 | Global state |
| Database (local) | Dexie.js | 4.4.3 | IndexedDB wrapper |
| Animations | GSAP | 3.15.0 | Production-grade motion |
| React GSAP | @gsap/react | 2.1.2 | useGSAP hook |
| Desktop | Tauri v2 | 2.x | Rust wrapper |
| Icons | lucide-react | 1.16.0 | Consistent iconography |
| Utility | tailwind-merge | 3.4.0 | Class merging |
| Utility | clsx | 2.1.1 | Conditional classes |

---

## 🗺 Roadmap Overview

| Sprint | Status | Deliverable |
|--------|--------|-------------|
| **0** | ✅ Done | Local issue tracker, keyboard shortcuts, dark mode, IndexedDB |
| **1** | 🔮 Planned | PostgreSQL + tRPC + Clerk auth + TanStack Query sync |
| **2** | ✅ Done | Projects, Cycles (sprints), Roadmap view, auto-rollover |
| **3** | ✅ Done | Triage inbox, sub-issues, relations, comments, saved views, GSAP everywhere |
| **4** | 🚧 In Progress | Tauri desktop app, PWA, offline badge, global hotkey, performance |
| **5** | 🔮 Planned | Teams, real-time sync, WebSockets, multiplayer |
| **6** | 🔮 Planned | Payments (Paddle), billing tiers, landing page, public launch |

---

## ⚡ Quick Start

```bash
cd hit-it/apps/web
npm install
npm run dev        # Web dev server
npm run tauri:dev  # Desktop dev (requires Rust)
```

---

## 🧠 Architecture Principles

1. **Browser as Database** — IndexedDB is the source of truth locally. Server reconciles asynchronously.
2. **Optimistic by Default** — UI updates instantly. Network is background noise.
3. **Keyboard-First** — Every action has a shortcut. Mouse is optional.
4. **Animation as Feedback** — GSAP provides spatial awareness, not decoration.
5. **No Seed Data** — App starts blank. You own your data from issue #1.

---

*Last updated: 2026-06-01 by Arena.ai Agent Mode*