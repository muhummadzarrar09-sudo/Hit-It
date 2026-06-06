# 🗄 Database Schema

> Last updated: 2026-06-01
>
> Covers both the **local IndexedDB** (Dexie.js, current) and the **future PostgreSQL** schema (Drizzle ORM, Sprint 5+).

---

## Local Schema (IndexedDB v3)

Managed by Dexie.js. All tables use `crypto.randomUUID()` primary keys.

### `issues`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `identifier` | string | ✅ | Auto-generated `HIT-{n}` |
| `title` | string | ✅ | Full-text searchable |
| `description` | string | — | Markdown plain text |
| `status` | enum | ✅ | `backlog` / `todo` / `in_progress` / `in_review` / `done` |
| `priority` | number | ✅ | `0`=none, `1`=urgent, `2`=high, `3`=medium, `4`=low |
| `projectId` | string? | ✅ | FK → `projects.id` |
| `cycleId` | string? | ✅ | FK → `cycles.id` |
| `parentId` | string? | — | FK → `issues.id` (sub-issue hierarchy) |
| `labels` | string[] | — | Future: label reference array |
| `createdAt` | number | ✅ | epoch ms |
| `updatedAt` | number | ✅ | epoch ms |

**Indexes:**
```typescript
"++id, identifier, status, priority, projectId, cycleId, parentId, createdAt, updatedAt"
```

### `projects`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `name` | string | ✅ | |
| `description` | string | — | |
| `status` | enum | ✅ | `planned` / `in_progress` / `paused` / `completed` / `canceled` |
| `startDate` | number? | — | epoch ms |
| `targetDate` | number? | — | epoch ms |
| `createdAt` | number | ✅ | |
| `updatedAt` | number | ✅ | |

### `cycles`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `name` | string | ✅ | e.g. "Sprint 3: Power" |
| `startDate` | number | ✅ | epoch ms |
| `endDate` | number | ✅ | epoch ms |
| `status` | enum | ✅ | `active` / `upcoming` / `completed` |
| `createdAt` | number | ✅ | |

### `comments`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `issueId` | string | ✅ | FK → `issues.id` |
| `userName` | string | — | `"You"` until auth (Sprint 5) |
| `body` | string | — | Plain text |
| `createdAt` | number | ✅ | epoch ms |

### `issueRelations`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `sourceId` | string | ✅ | FK → `issues.id` |
| `targetId` | string | ✅ | FK → `issues.id` |
| `type` | enum | ✅ | `blocks` / `blocked_by` / `related` / `duplicates` / `duplicate_of` |
| `createdAt` | number | ✅ | |

### `savedViews`

| Field | Type | Indexed | Notes |
|-------|------|---------|-------|
| `id` | string | PK | UUID |
| `name` | string | ✅ | User-defined label |
| `filters` | object | — | `{ status, projectId, cycleId, priority }` |
| `sortBy` | enum | — | `created` / `updated` / `priority` |
| `sortOrder` | enum | — | `asc` / `desc` |
| `viewMode` | enum | — | `list` / `board` |
| `createdAt` | number | ✅ | |

---

## Future PostgreSQL Schema (Drizzle ORM)

When backend sync is introduced (Sprint 5), the same shape maps to SQL:

```typescript
// Drizzle schema draft (pending Sprint 5)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
  plan: varchar("plan", { length: 50 }).notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaceMembers = pgTable("workspace_members", {
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  userId: uuid("user_id").references(() => users.id),
  role: varchar("role", { length: 50 }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// issues, projects, cycles tables follow identical shape to IndexedDB
// with additions: workspaceId, assigneeId, creatorId, subscriberIds
```

---

## Migration Strategy (Sprint 5)

1. Dexie data exports to JSON via `db.export()`
2. Backend import API ingests the JSON, assigns server UUIDs
3. Client re-initializes from server bootstrap (same as Linear's `/sync/bootstrap`)
4. Local IndexedDB becomes a **cache**, PostgreSQL becomes **source of truth**
5. Sync engine reconciles conflicts using `updatedAt` timestamps + operational transforms

---

*This schema is designed to be boring and obvious. Every table has a UUID PK, epoch timestamps, and nullable foreign keys. No surprises.*