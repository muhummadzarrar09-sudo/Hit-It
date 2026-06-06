"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/lib/store";
import {
  STATUS_LABELS,
  PROJECT_STATUS_LABELS,
  type IssueStatus,
} from "@/types";
import { Search, LayoutList, Columns3, Plus, Filter, FolderKanban, Timer, Map, CircleDot, Inbox } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CommandPalette() {
  const {
    commandOpen,
    setCommandOpen,
    setCreateIssueOpen,
    setCreateProjectOpen,
    setCreateCycleOpen,
    setMainView,
    setIssueViewMode,
    setStatusFilter,
    setProjectFilter,
    setCycleFilter,
    setPriorityFilter,
    issues,
    projects,
    cycles,
    setSelectedIssueId,
    setSelectedProjectId,
    setSelectedCycleId,
    savedViews,
  } = useStore();

  const [query, setQuery] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (commandOpen) {
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.96, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(1.4)" });
    }
  }, { dependencies: [commandOpen] });

  useEffect(() => { if (!commandOpen) setQuery(""); }, [commandOpen]);

  if (!commandOpen) return null;

  const q = query.toLowerCase();

  const matchedIssues = q ? issues.filter((i) => i.title.toLowerCase().includes(q) || i.identifier.toLowerCase().includes(q)) : [];
  const matchedProjects = q ? projects.filter((p) => p.name.toLowerCase().includes(q)) : [];
  const matchedCycles = q ? cycles.filter((c) => c.name.toLowerCase().includes(q)) : [];
  const matchedViews = q ? savedViews.filter((v) => v.name.toLowerCase().includes(q)) : [];

  const actions = [
    { id: "create-issue", label: "Create new issue", icon: <Plus className="w-4 h-4" />, shortcut: "C", action: () => { setCommandOpen(false); setCreateIssueOpen(true); } },
    { id: "create-project", label: "Create new project", icon: <FolderKanban className="w-4 h-4" />, action: () => { setCommandOpen(false); setCreateProjectOpen(true); } },
    { id: "create-cycle", label: "Create new cycle", icon: <Timer className="w-4 h-4" />, action: () => { setCommandOpen(false); setCreateCycleOpen(true); } },
    { id: "view-triage", label: "Go to Triage", icon: <Inbox className="w-4 h-4" />, shortcut: "G T", action: () => { setMainView("triage"); setCommandOpen(false); } },
    { id: "view-issues-list", label: "Switch to List view", icon: <LayoutList className="w-4 h-4" />, shortcut: "1", action: () => { setMainView("issues"); setIssueViewMode("list"); setCommandOpen(false); } },
    { id: "view-issues-board", label: "Switch to Board view", icon: <Columns3 className="w-4 h-4" />, shortcut: "2", action: () => { setMainView("issues"); setIssueViewMode("board"); setCommandOpen(false); } },
    { id: "view-projects", label: "Go to Projects", icon: <FolderKanban className="w-4 h-4" />, shortcut: "G P", action: () => { setMainView("projects"); setCommandOpen(false); } },
    { id: "view-cycles", label: "Go to Cycles", icon: <Timer className="w-4 h-4" />, shortcut: "G C", action: () => { setMainView("cycles"); setCommandOpen(false); } },
    { id: "view-roadmap", label: "Go to Roadmap", icon: <Map className="w-4 h-4" />, shortcut: "G R", action: () => { setMainView("roadmap"); setCommandOpen(false); } },
  ];

  const statusFilters = Object.entries(STATUS_LABELS).filter(([key, label]) => !q || label.toLowerCase().includes(q) || key.includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-xl bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-hit-border">
          <Search className="w-5 h-5 text-hit-muted" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command or search..." className="flex-1 bg-transparent text-hit-text placeholder-hit-muted outline-none text-base" />
          <kbd className="px-2 py-1 text-xs bg-hit-elevated border border-hit-border rounded text-hit-muted">ESC</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {q === "" && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5">Actions</div>
              {actions.map((a) => (
                <button key={a.id} onClick={a.action} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <span className="text-hit-accent">{a.icon}</span>
                  <span className="flex-1 text-sm text-hit-text">{a.label}</span>
                  {a.shortcut && <kbd className="px-1.5 py-0.5 text-xs bg-hit-elevated border border-hit-border rounded text-hit-muted">{a.shortcut}</kbd>}
                </button>
              ))}
            </div>
          )}
          {statusFilters.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5">Filter by Status</div>
              {statusFilters.map(([status, label]) => (
                <button key={status} onClick={() => { setMainView("issues"); setStatusFilter(status); setCommandOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <Filter className="w-4 h-4 text-hit-accent" />
                  <span className="text-sm text-hit-text">{label}</span>
                </button>
              ))}
            </div>
          )}
          {matchedIssues.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center gap-2"><CircleDot className="w-3.5 h-3.5" /> Issues</div>
              {matchedIssues.slice(0, 6).map((issue) => (
                <button key={issue.id} onClick={() => { setMainView("issues"); setSelectedIssueId(issue.id); setCommandOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <span className="text-xs font-mono text-hit-muted">{issue.identifier}</span>
                  <span className="text-sm text-hit-text truncate">{issue.title}</span>
                </button>
              ))}
            </div>
          )}
          {matchedProjects.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center gap-2"><FolderKanban className="w-3.5 h-3.5" /> Projects</div>
              {matchedProjects.slice(0, 4).map((project) => (
                <button key={project.id} onClick={() => { setMainView("projects"); setSelectedProjectId(project.id); setCommandOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <span className="text-sm text-hit-text truncate">{project.name}</span>
                  <span className="text-xs text-hit-muted ml-auto">{PROJECT_STATUS_LABELS[project.status]}</span>
                </button>
              ))}
            </div>
          )}
          {matchedCycles.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center gap-2"><Timer className="w-3.5 h-3.5" /> Cycles</div>
              {matchedCycles.slice(0, 4).map((cycle) => (
                <button key={cycle.id} onClick={() => { setMainView("cycles"); setSelectedCycleId(cycle.id); setCommandOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <span className="text-sm text-hit-text truncate">{cycle.name}</span>
                  <span className="text-xs text-hit-muted ml-auto">{new Date(cycle.startDate).toLocaleDateString()}</span>
                </button>
              ))}
            </div>
          )}
          {matchedViews.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center gap-2"><LayoutList className="w-3.5 h-3.5" /> Saved Views</div>
              {matchedViews.map((view) => (
                <button key={view.id} onClick={() => { 
                  setMainView("issues"); 
                  setIssueViewMode(view.viewMode); 
                  setStatusFilter(view.filters.status); 
                  setProjectFilter(view.filters.projectId); 
                  setCycleFilter(view.filters.cycleId); 
                  setPriorityFilter(view.filters.priority); 
                  setCommandOpen(false); 
                }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hit-elevated text-left transition-colors">
                  <span className="text-sm text-hit-text">{view.name}</span>
                </button>
              ))}
            </div>
          )}
          {q && matchedIssues.length === 0 && matchedProjects.length === 0 && matchedCycles.length === 0 && matchedViews.length === 0 && statusFilters.length === 0 && (
            <div className="px-6 py-8 text-center text-hit-muted text-sm">No results for &ldquo;{query}&rdquo;</div>
          )}
        </div>
      </div>
    </div>
  );
}