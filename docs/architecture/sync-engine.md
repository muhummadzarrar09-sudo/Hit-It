# ⚡ Sync Engine Architecture

> Last updated: 2026-06-01
>
> How Hit It goes from **local-first** to **team-synced** without losing speed.

---

## The Problem

Most web apps:
1. User clicks
2. Spinner appears
3. HTTP request fires
4. Server responds
5. UI updates

**Perceived latency: 200ms–3s.**

Linear proved this is wrong. Hit It follows the same philosophy.

---

## The Hit It Way: Local-First

```
User clicks → Zustand updates instantly → Dexie persists → UI renders
                                    ↓
                              (background flush to server)
```

1. **UI responds in < 16ms.** No network dependency.
2. **IndexedDB is the database.** Browser crash? Data survives.
3. **Server is a sync target.** Receives batched mutations asynchronously.
4. **Conflict resolution is last-write-wins + operational transforms.**

---

## Sprint 0–4: Solo Mode

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│   User   │────▶│   Zustand   │────▶│  IndexedDB   │
│  Action  │     │   (state)   │     │ (persistent) │
└──────────┘     └─────────────┘     └──────────────┘
```

- All CRUD is synchronous from the user's perspective.
- IndexedDB transactions are async but non-blocking.
- GSAP animates state transitions, not loading states.

---

## Sprint 5+: Team Sync Mode

```
┌──────────┐     ┌─────────────┐     ┌──────────────┐
│   User   │────▶│   Zustand   │────▶│  IndexedDB   │
│  Action  │     │   (state)   │     │ (local cache)│
└──────────┘     └──────┬──────┘     └───────┬──────┘
                          │                    │
                          │         ┌──────────┴──────────┐
                          │         │   Sync Engine Worker  │
                          │         │   (background thread) │
                          │         └──────────┬──────────┘
                          │                    │
                          ▼                    ▼
                   ┌─────────────┐     ┌──────────────┐
                   │   TanStack  │     │  PostgreSQL  │
                   │    Query    │     │ (authoritative)│
                   │ (optimistic)│     └──────────────┘
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  WebSocket  │
                   │  (realtime) │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Other Users │
                   │   (live)    │
                   └─────────────┘
```

### Sync Protocol (inspired by Linear)

**Bootstrap (first load):**
```
GET /sync/bootstrap?type=full
→ Returns all workspace entities as newline-delimited JSON
→ Client hydrates IndexedDB + Zustand
```

**Mutations:**
```typescript
// Optimistic
issue.title = "New title";
updateStore(issue.id, { title: "New title" });
await db.issues.update(issue.id, { title: "New title", updatedAt: now });

// Background sync
syncQueue.push({
  type: "UPDATE",
  table: "issues",
  id: issue.id,
  delta: { title: "New title" },
  clientTimestamp: now,
});
flushSyncQueue(); // debounced 200ms
```

**Realtime (WebSocket):**
- Client subscribes to workspace channel.
- Server broadcasts `SyncAction` deltas to all clients.
- Client applies delta to local store if the mutation wasn't local.

### Conflict Resolution

1. **Server is source of truth** for correctness.
2. **Client applies its own mutations immediately** (optimistic).
3. **If server rejects**, rollback to server state + toast notification.
4. **If server accepts but with different timestamp**, merge using `updatedAt` LWW.
5. **For concurrent edits to same field**, use operational transform or structured merge.

---

## Offline Strategy

```
Online:   Mutations flush immediately via HTTP/WebSocket.
Offline:  Mutations queue in IndexedDB sync table.
Restore:  Queue drains automatically when connection returns.
```

Since IndexedDB already persists everything, the app works identically offline. The only difference is the background sync thread pauses.

---

## Performance Guarantees

| Scenario | Latency | Method |
|----------|---------|--------|
| Create issue | < 50ms | Zustand + IndexedDB write |
| Update status | < 16ms | Zustand only (IndexedDB async) |
| Load 100 issues | < 100ms | Dexie indexed read |
| Search | < 50ms | IndexedDB cursor + in-memory Zustand filter |
| Sync to server | < 2s | Debounced batch, background thread |
| Realtime receive | < 100ms | WebSocket delta apply |

---

## Why Not Build a Custom Sync Engine Today?

Linear's CTO wrote the sync engine on day one. For Hit It:

- **Sprints 0–4:** No server. No sync needed. Dexie is enough.
- **Sprint 5:** TanStack Query + REST/tRPC gets us 90% of the way there with optimistic updates.
- **Sprint 7+:** If team scale demands it, build a dedicated sync engine (WebSocket + delta protocol).

Premature optimization is the enemy. Speed comes from optimistic UI, not a custom protocol.

---

*This document ensures that when we flip from solo to team mode, the transition is architectural — not a rewrite.*