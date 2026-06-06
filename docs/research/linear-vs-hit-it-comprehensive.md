# 🔬 Linear Autopsy vs Hit It — Comprehensive Feature Gap Analysis

> **Research Date:** 2026-06-01  
> **Sources:** Linear.app official docs, changelog, pricing page, third-party reviews (ToolJunction, QuackBack, Tierly, Productivity Stack), Reddit discussions, API documentation, Pipedream/Reflex integration docs.  
> **Goal:** Know exactly what Linear does, what we do, and where we can be BETTER.

---

## 📊 LINEAR'S COMPLETE FEATURE INVENTORY (2026)

### 1. Core Issue Tracking
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Issue creation (title + markdown description) | ✅ Native | C key shortcut |
| Priority levels (None, Urgent, High, Medium, Low) | ✅ Native | 5 levels |
| Status workflow | ✅ Native | Backlog → Todo → In Progress → In Review → Done (customizable per team) |
| Labels with colors | ✅ Native | Custom labels per team |
| Custom fields | ✅ Business tier+ | Custom field types (text, number, date, etc.) |
| Sub-issues / parent-child | ✅ Native | Full hierarchy with tree view |
| Issue relations | ✅ Native | Blocks, blocked by, related, duplicates, duplicate of |
| Issue templates | ✅ Native | Bug, feature, refactor templates |
| Automatic issue numbering (TEAM-123) | ✅ Native | Team-scoped identifiers |
| Duplicate detection | ✅ Native | AI-powered duplicate suggestions |
| Issue history / activity log | ✅ Native | Full audit trail |
| Attachments / file uploads | ✅ Native | 10MB free, unlimited on paid |
| @mentions in descriptions | ✅ Native | User mentions inline |
| Markdown editor | ✅ Native | Rich markdown with preview |
| Code blocks in descriptions | ✅ Native | Syntax highlighting |
| Copy issue link | ✅ Native | Permalink to every issue |
| Archive issues | ✅ Native | Soft delete, recoverable |
| Bulk actions | ✅ Native | Multi-select + bulk status/assignee/label changes |
| Issue move between teams | ✅ Native | Preserves history |

### 2. Views & Navigation
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| List view | ✅ Native | Sortable, filterable, spreadsheet-like |
| Board view (Kanban) | ✅ Native | Drag-and-drop columns |
| Timeline / Roadmap view | ✅ Native | Project-level Gantt-style |
| Calendar view | ❌ NOT AVAILABLE | Linear deliberately omits this |
| Custom saved views | ✅ Native | Filter + sort + grouping presets |
| My Issues (personal dashboard) | ✅ Native | Assigned to me, across all projects |
| Triage inbox | ✅ Native | Unassigned/unprocessed backlog queue |
| Inbox notifications | ✅ Native | Notification center with read/unread |
| Favorites / bookmarks | ✅ Native | Pin issues, projects, views |
| Search (⌘K + global) | ✅ Native | Fuzzy search across ALL entities |
| Search syntax | ✅ Native | `is:done assignee:@me team:frontend` |
| Recent items | ✅ Native | Recently viewed issues |
| Command palette | ✅ Native | ⌘K universal actions |
| Keyboard shortcuts | ✅ Native | Full shortcut system with cheat sheet |
| Custom keyboard shortcuts | ❌ NOT AVAILABLE | Fixed shortcuts only |

### 3. Projects & Roadmaps
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Projects (initiative containers) | ✅ Native | Group issues under a project |
| Project status | ✅ Native | Planned, In Progress, Paused, Completed, Canceled |
| Project start/target dates | ✅ Native | Date range with visual timeline |
| Project milestones | ✅ Native | Sub-goals within a project |
| Project description / spec docs | ✅ Native | Markdown project README |
| Project updates / status reports | ✅ Native | Weekly/bi-weekly update posts |
| Project health indicators | ✅ Native | "On track", "At risk", "Off track" |
| Roadmap view | ✅ Native | Timeline of all projects |
| Multi-project portfolios | ✅ Native | Group projects into initiatives |
| Project Slack channel linking | ✅ 2026 NEW | `slackChannelId` on Project entity |
| Project teams channel linking | ✅ 2026 NEW | `microsoftTeamsChannelId` on Project |
| Project favorites | ✅ Native | Pin projects to sidebar |

### 4. Cycles (Sprints)
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Cycles (time-boxed sprints) | ✅ Native | 1-2 week configurable duration |
| Auto-rollover incomplete issues | ✅ Native | Undone issues move to next cycle |
| Cycle capacity planning | ✅ Native | Estimate team capacity vs. assigned work |
| Velocity tracking | ✅ Native | Completion rate per cycle |
| Cycle completion metrics | ✅ Native | Charts: started, completed, cancelled |
| Cycle history | ✅ Native | Past cycles with full stats |
| Burndown charts | ✅ Native | Visual progress within cycle |
| Issue scope changes during cycle | ✅ Native | Track added/removed issues |
| Automatic cycle creation | ✅ Native | Recurring cycles |

### 5. Teams & Collaboration
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Teams (workspace subdivisions) | ✅ Native | Engineering, Design, Product, etc. |
| Team-specific workflows | ✅ Native | Each team has its own statuses |
| Team-specific labels | ✅ Native | Scoped labels |
| Team-specific templates | ✅ Native | Issue templates per team |
| Team members / roles | ✅ Native | Admin, Member, Viewer |
| Private teams | ✅ Business+ | Hidden from non-members |
| Guests / external users | ✅ Business+ | Limited access for contractors |
| Assignee / owner | ✅ Native | Single assignee per issue |
| Subscribers / watchers | ✅ Native | Get notifications without being assignee |
| @mentions in comments | ✅ Native | Notify users inline |
| Reactions on comments | ✅ Native | Emoji reactions |
| Comment threads | ✅ Native | Threaded discussions |
| Comment resolution | ✅ Native | Mark threads as resolved |
| User profiles / avatars | ✅ Native | User directory |
| User availability / OOO | ❌ NOT AVAILABLE | No built-in vacation tracking |

### 6. Integrations (Native)
| Integration | Linear Status | Tier | Notes |
|-------------|--------------|------|-------|
| GitHub | ✅ Native | Free | Auto-link PRs, branch creation, status sync on merge |
| GitLab | ✅ Native | Free | Same as GitHub |
| Slack | ✅ Native | Free | Issue creation from Slack, notifications, unfurls |
| Microsoft Teams | ✅ Native | Free | Notifications, tab integration |
| Figma | ✅ Native | Free | Embed live Figma frames in issues |
| Sentry | ✅ Native | Free | Auto-create bugs from crash reports |
| Zendesk | ✅ Business+ | Paid | Convert support tickets to issues |
| Intercom | ✅ Business+ | Paid | Customer feedback → issues |
| Front | ✅ Native | Free | Email → issues |
| Discord | ✅ Native | Free | Notifications |
| Notion | ❌ Third-party | — | Via Zapier/Pipedream only |
| Calendly / Google Calendar | ❌ NOT AVAILABLE | — | No calendar integration |
| Zapier | ✅ Native | Free | Workflow automation |
| Webhooks | ✅ Native | Free | Custom HTTP webhooks on all events |
| GraphQL API | ✅ Native | Free | Full read/write API |
| REST API | ❌ NOT AVAILABLE | — | GraphQL only |
| OAuth apps | ✅ Native | Free | Build third-party apps |
| Personal API keys | ✅ Native | Free | Script access |
| Git auto-linking | ✅ Native | Free | `fixes TEAM-123` in commit messages |
| Branch auto-creation | ✅ Native | Free | Start issue → create branch |
| PR review status sync | ✅ Native | Free | In Review → changes requested → approved |
| Code Intelligence (NEW 2026) | ✅ Beta | All | AI context from connected repos |
| Releases | ✅ 2026 NEW | All | Track software releases |
| Project Slack channel | ✅ 2026 NEW | All | Link project to Slack channel |

### 7. AI Features (2025-2026)
| Feature | Linear Status | Tier | Notes |
|---------|--------------|------|-------|
| AI Triage Intelligence | ✅ Native | Business+ | Auto-classify incoming issues |
| Linear Insights (analytics AI) | ✅ Native | Business+ | Cycle time, velocity predictions |
| Linear Asks | ✅ Native | Business+ | Natural language issue creation |
| AI Semantic Search | ✅ Native | All plans | Natural language search |
| AI Issue Summarization | ✅ Native | All plans | Summarize long threads |
| AI Duplicate Detection | ✅ Native | All plans | Suggest duplicates |
| AI Auto-categorization | ✅ Native | All plans | Suggest labels/priority |
| MCP Agent Support | ✅ 2026 NEW | All | AI agents interact with Linear via MCP |
| Coding Agent Integration | ✅ 2026 NEW | All | Claude Opus / Cursor agent context |
| AI Standup Summaries | ❌ NOT AVAILABLE | — | No daily standup AI |
| AI Sprint Planning | ✅ Insights | Business+ | Suggests cycle contents |

### 8. Automation & Workflows
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Custom workflow states | ✅ Native | Per-team status customization |
| Auto-assignment rules | ✅ Native | Round-robin, code owner matching |
| Auto-status transitions | ✅ Native | PR merged → Done |
| Auto-labeling | ✅ Native | Rules-based |
| Auto-archive old issues | ✅ Native | Configurable |
| Webhook-triggered automations | ✅ Native | HTTP webhooks on any event |
| Integration-triggered automations | ✅ Native | GitHub/Slack events → Linear actions |
| Custom automation rules engine | ✅ Native | Visual rule builder |
| API-triggered automations | ✅ Native | GraphQL mutations as triggers |
| Scheduled automations | ❌ Limited | No cron-style scheduling |

### 9. Reporting & Analytics
| Feature | Linear Status | Tier | Notes |
|---------|--------------|------|-------|
| Cycle completion metrics | ✅ Native | Free | Done vs. started vs. scope change |
| Velocity tracking | ✅ Native | Free | Issues per cycle trend |
| Issue throughput | ✅ Native | Free | Created vs. completed |
| Cycle time analysis | ✅ Native | Business+ | Time in each status |
| Team performance dashboards | ✅ Native | Business+ | Linear Insights |
| Custom dashboards | ❌ NOT AVAILABLE | — | No dashboard builder |
| Export to CSV | ✅ Native | Free | Basic export |
| Export to JSON | ✅ API | Free | Via GraphQL |
| Burn-up / burn-down charts | ✅ Native | Free | Cycle-level |
| Forecasting | ✅ Insights | Business+ | Predict completion dates |

### 10. Security & Compliance
| Feature | Linear Status | Tier | Notes |
|---------|--------------|------|-------|
| SOC 2 Type II | ✅ Certified | All | Third-party audited |
| GDPR compliance | ✅ Native | All | EU data protection |
| Data encryption at rest | ✅ Native | All | AES-256 |
| Data encryption in transit | ✅ Native | All | TLS 1.3 |
| SAML SSO | ✅ Enterprise | Paid | Okta, Azure AD, etc. |
| SCIM provisioning | ✅ Enterprise | Paid | Automated user provisioning |
| Audit logs | ✅ Enterprise | Paid | Admin audit trail |
| Granular admin controls | ✅ Enterprise | Paid | Workspace-level permissions |
| IP allowlisting | ❌ NOT AVAILABLE | — | No IP restrictions |
| Custom data retention | ❌ NOT AVAILABLE | — | Fixed retention policy |
| HIPAA compliance | ❌ NOT AVAILABLE | — | Not HIPAA eligible |

### 11. Platform & Deployment
| Feature | Linear Status | Notes |
|---------|--------------|-------|
| Web app | ✅ Native | Primary platform |
| macOS desktop app | ✅ Native | Native Mac app |
| Windows desktop app | ✅ Native | Native Windows app |
| iOS app | ✅ Native | iPhone/iPad native |
| Android app | ✅ Native | Android native |
| Self-hosting | ❌ NOT AVAILABLE | Cloud-only |
| On-premises | ❌ NOT AVAILABLE | No enterprise install |
| Offline mode | ⚠️ Partial | Read-only offline, edits queue |
| PWA | ❌ NOT AVAILABLE | No installable web app |
| Browser extension | ❌ NOT AVAILABLE | No Chrome/Firefox extension |
| VS Code extension | ✅ Third-party | Community extensions |
| CLI tool | ❌ NOT AVAILABLE | API-only |

### 12. Billing & Plans (2026)

| Plan | Price | Members | Teams | Issues | AI | Key Limitations |
|------|-------|---------|-------|--------|-----|-----------------|
| **Free** | $0 | Unlimited | 2 | 250 (non-archived) | AI agents included | No private teams, no guests, no Insights |
| **Basic** | $10/user/mo (annual) | Unlimited | 5 | Unlimited | Basic AI | No Zendesk/Intercom, no Insights |
| **Business** | $16/user/mo (annual) | Unlimited | Unlimited | Unlimited | Full AI | No SSO/SCIM |
| **Enterprise** | Custom (annual) | Unlimited | Unlimited | Unlimited | Full AI | Everything + migration support |

**Billing Mechanics:**
- Annual ONLY for paid plans (monthly NOT available as of 2026)
- Prorated when adding users mid-year
- Prorated credits when removing users (not cash refunds)
- No published volume discounts below Enterprise
- 250-issue hard cap on Free — BLOCKS creation immediately, no grace period

---

## 🥊 WHAT HIT IT HAS (Current — Sprint 0-4)

| Category | Feature | Status |
|----------|---------|--------|
| **Issues** | Create, title, description, priority, status | ✅ Done |
| | 5 workflow states (Backlog→Done) | ✅ Done |
| | Auto-numbering (HIT-1) | ✅ Done |
| | Sub-issues (parent-child) | ✅ Sprint 3 |
| | Issue relations (blocks/blocked_by/related/duplicates) | ✅ Sprint 3 |
| | Comments / threaded discussion | ✅ Sprint 3 |
| | Attachments | ❌ Not built |
| | @mentions in descriptions | ❌ Not built |
| | Archive/soft delete | ❌ Not built (hard delete only) |
| | Bulk actions | ❌ Not built |
| | Markdown editor | ⚠️ Plain textarea (no rich editor) |
| **Views** | List view | ✅ Done |
| | Board view | ✅ Done |
| | Roadmap / Timeline | ✅ Sprint 2 |
| | Custom saved views | ✅ Sprint 3 |
| | Search / Command Palette | ✅ Done (fuzzy search) |
| | Triage inbox | ✅ Sprint 3 |
| | Calendar view | ❌ Not built |
| | Search syntax (`is:done`) | ❌ Not built |
| **Projects** | Projects with status/dates | ✅ Sprint 2 |
| | Project progress bars | ✅ Sprint 2 |
| | Project milestones | ❌ Not built |
| | Project updates / status reports | ❌ Not built |
| | Multi-project portfolios | ❌ Not built |
| | Project Slack linking | ❌ Not built |
| **Cycles** | Cycles (sprints) | ✅ Sprint 2 |
| | Auto-rollover | ✅ Sprint 2 |
| | Velocity tracking | ⚠️ Basic (progress %) |
| | Burndown charts | ❌ Not built |
| | Cycle capacity | ❌ Not built |
| | Automatic cycle creation | ❌ Not built |
| **Teams** | Single workspace only | ⚠️ Solo mode |
| | Multi-team support | ❌ Sprint 5 planned |
| | Team-specific workflows | ❌ Not built |
| | Private teams | ❌ Not built |
| | Guests | ❌ Not built |
| | Assignees | ⚠️ Only "You" (no auth) |
| | Subscribers | ❌ Not built |
| | User profiles | ❌ Not built |
| **Integrations** | GitHub auto-linking | ❌ Sprint 5 planned |
| | GitLab | ❌ Not built |
| | Slack | ❌ Not built |
| | Figma | ❌ Not built |
| | API (GraphQL/REST) | ❌ Sprint 5 planned |
| | Webhooks | ❌ Sprint 5 planned |
| | Zapier | ❌ Not built |
| | Import from Jira/Asana | ❌ Not built |
| **AI** | AI Triage | ❌ Not built |
| | AI Insights | ❌ Not built |
| | AI Search | ❌ Not built |
| | AI Summarization | ❌ Not built |
| | AI Duplicate Detection | ❌ Not built |
| | MCP Agent Support | ❌ Not built |
| **Automation** | Auto-assignment | ❌ Not built |
| | Auto-status from Git | ❌ Not built |
| | Auto-labeling | ❌ Not built |
| | Custom automation rules | ❌ Not built |
| | Webhook automations | ❌ Not built |
| **Analytics** | Cycle completion % | ⚠️ Basic |
| | Velocity trend | ❌ Not built |
| | Issue throughput | ❌ Not built |
| | Cycle time | ❌ Not built |
| | Custom dashboards | ❌ Not built |
| | CSV export | ❌ Not built |
| **Security** | Auth / Login | ❌ Sprint 5 planned |
| | SSO / SAML | ❌ Not built |
| | Audit logs | ❌ Not built |
| | Encryption | ⚠️ IndexedDB browser-level |
| **Platform** | Web app | ✅ Done |
| | PWA (installable) | ✅ Sprint 4 scaffolded |
| | Desktop (Tauri) | ✅ Sprint 4 scaffolded |
| | Offline badge | ✅ Sprint 4 |
| | Service Worker | ✅ Sprint 4 |
| | iOS/Android native | ❌ Not built |
| | Browser extension | ❌ Not built |
| **Billing** | Payment adapter (Paddle/Paymob) | ✅ Sprint 4 interface |
| | Plans structure | ✅ Designed |
| | Usage-based gating | ❌ Not built |
| | Subscription webhooks | ❌ Not built |
| **Performance** | Optimistic UI | ✅ Done |
| | Local-first (IndexedDB) | ✅ Done |
| | Keyboard shortcuts | ✅ Done |
| | Command palette | ✅ Done |
| | GSAP animations | ✅ Sprint 3 |
| | Sub-100ms interactions | ✅ Done (local-only) |
| **UX** | Dark mode | ✅ Done |
| | Keyboard-first | ✅ Done |
| | Create issue (C key) | ✅ Done |
| | Global search (⌘K) | ✅ Done |
| | Detail panel slide-in | ✅ Done |
| | Drag-and-drop board | ⚠️ Click-to-move (no DnD yet) |
| | Rich text editor | ❌ Not built |
| | Syntax highlighting | ❌ Not built |

---

## 🎯 THE GAP — WHERE WE CAN BE BETTER

### Hit It's Advantages Over Linear
1. **Self-hosting option** — Linear refuses. We have Tauri + could add Docker.
2. **Pakistan-compatible payments** — Paddle + Paymob vs Stripe-only Linear.
3. **Open architecture** — Our adapter pattern lets users swap payment providers.
4. **PWA-first** — Linear has no PWA. We do (installable, offline-capable).
5. **Desktop wrapper (Tauri)** — 600KB vs Linear's ~50MB Electron-ish app.
6. **Calendar view** — Linear deliberately omits it. We could add it.
7. **Monthly billing option** — Linear forces annual. We could offer monthly.
8. **Rich text from day one** — We can integrate Plate/Tiptap editor early.
9. **Simpler pricing for emerging markets** — PKR pricing via Paymob.
10. **Full offline editing** — Linear is read-only offline. We're write-always (local-first).

### What Linear Has That We MUST Add To Compete
**Immediate (Sprint 5-6):**
- **GitHub/GitLab integration** — Auto-link PRs, branch creation, status sync. This is Linear's #1 lock-in feature.
- **Real assignees + auth** — Issues need owners. Requires Clerk/NextAuth.
- **Slack integration** — Create issues from Slack, push notifications.
- **API + Webhooks** — Developers won't adopt without programmatic access.
- **Import from Jira/Asana/GitHub Issues** — Migration path for switchers.
- **Rich text editor** — Markdown is fine for MVP, but rich text is table stakes.
- **Bulk actions** — Multi-select issues for batch operations.
- **Archive / soft delete** — Not hard delete.
- **User mentions** — @username in comments/descriptions.
- **Drag-and-drop board** — Click arrows is cute but DnD is expected.

**Medium (Sprint 7-8):**
- **Figma embed** — Design-led teams demand this.
- **Sentry integration** — Auto-bug creation from crashes.
- **Zapier integration** — Non-dev workflow automation.
- **CSV export** — Data portability.
- **Reactions on comments** — Emoji reactions (lightweight social feature).
- **Comment resolution** — Mark threads resolved.
- **Project updates / status reports** — Write + publish project updates.
- **Project milestones** — Sub-goals within projects.
- **Multi-project portfolios / Initiatives** — Group projects.
- **Velocity trend charts** — Historical velocity.
- **Cycle time analysis** — Time spent per status.

**Advanced (Sprint 9+):**
- **AI Triage** — Auto-classify incoming issues.
- **AI Insights** — Predict cycle completion, flag at-risk issues.
- **AI Semantic Search** — Natural language search.
- **Custom fields** — Per-team custom data (Business tier equivalent).
- **Private teams** — Team-level privacy.
- **Guest access** — Contractor/ external access.
- **SAML/SCIM** — Enterprise SSO (Enterprise tier equivalent).
- **Audit logs** — Admin audit trail.
- **Mobile native apps** — iOS/Android (PWA is stopgap).
- **Browser extension** — Create issues from any webpage.
- **VS Code extension** — Create/view issues from editor.

---

## 🧠 STRATEGIC RECOMMENDATIONS

### What Makes Linear "Linear"
Linear's moat is NOT its feature count. It's:
1. **Speed** — Everything feels instant. No spinners.
2. **Git integration** — PR ↔ Issue sync is seamless.
3. **Design craft** — Every pixel considered.
4. **Opinionated workflow** — They force good habits (triage, cycles).
5. **Developer-native** — Built BY devs FOR devs.

### What Makes "Hit It" Different
Our differentiators should be:
1. **Emerging market friendly** — Pakistan payments, lower pricing, local support.
2. **True offline-first** — Linear claims offline but is read-only. We write-always.
3. **Self-host option** — Docker deploy for privacy-conscious teams.
4. **Calendar view** — Linear omits it. General productivity users want it.
5. **Monthly billing** — Linear forces annual. We give flexibility.
6. **Open adapter architecture** — Swap payment providers, swap auth providers.

---

*Research compiled from 15+ sources. Next step: User selects what to add to the blueprint.*