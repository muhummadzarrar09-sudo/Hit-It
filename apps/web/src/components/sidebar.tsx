"use client";

import { useStore } from "@/lib/store";
import { useRef } from "react";
import {
  LayoutList, Columns3, Inbox, Search, FolderKanban, Timer,
  Map, Zap, CircleDot, Bookmark, Filter, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Sidebar() {
  const {
    mainView, setMainView,
    setIssueViewMode, issueViewMode,
    setCommandOpen,
    setCreateIssueOpen, setCreateProjectOpen, setCreateCycleOpen, setSaveViewOpen,
    statusFilter, setStatusFilter,
    setSearchQuery,
    setSelectedProjectId, setSelectedCycleId,
    setProjectFilter, setCycleFilter, setPriorityFilter,
    clearAllFilters,
    activeFiltersCount,
    projects, cycles, savedViews,
    deleteSavedView,
  } = useStore();

  const sidebarRef = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = sidebarRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-sidebar-item]");
    gsap.fromTo(items, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.015, ease: "power2.out", delay: 0.1 });
  }, { scope: sidebarRef });

  const navItems = [
    {
      id: "triage",
      label: "Triage",
      icon: <Inbox className="w-4 h-4" />,
      action: () => { setMainView("triage"); setStatusFilter(null); setSearchQuery(""); clearAllFilters(); },
      isActive: mainView === "triage",
    },
  ];

  return (
    <aside ref={sidebarRef} className="w-64 h-full bg-hit-surface border-r border-hit-border flex flex-col shrink-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-3 py-4 border-b border-hit-border" data-sidebar-item>
        <div className="flex items-center gap-2 text-hit-text font-semibold text-sm">
          <div className="w-5 h-5 rounded bg-hit-accent flex items-center justify-center text-white text-xs font-bold">H</div>
          Hit It
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3" data-sidebar-item>
        <button onClick={() => setCommandOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-hit-elevated border border-hit-border text-hit-muted hover:text-hit-text transition-colors text-sm">
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search or jump to...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-hit-surface border border-hit-border rounded">⌘K</kbd>
        </button>
      </div>

      {/* Workspace Nav */}
      <div className="px-3 py-2 space-y-0.5">
        <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5" data-sidebar-item>Workspace</div>
        {[
          { id: "issues", label: "Issues", icon: <CircleDot className="w-4 h-4" />, onClick: () => { setMainView("issues"); setStatusFilter(null); setSelectedProjectId(null); setSelectedCycleId(null); clearAllFilters(); } },
          { id: "projects", label: "Projects", icon: <FolderKanban className="w-4 h-4" />, onClick: () => { setMainView("projects"); setStatusFilter(null); setSelectedProjectId(null); } },
          { id: "cycles", label: "Cycles", icon: <Timer className="w-4 h-4" />, onClick: () => { setMainView("cycles"); setStatusFilter(null); setSelectedCycleId(null); } },
          { id: "roadmap", label: "Roadmap", icon: <Map className="w-4 h-4" />, onClick: () => { setMainView("roadmap"); setStatusFilter(null); } },
        ].map((item) => (
          <button key={item.id} data-sidebar-item onClick={item.onClick} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors", mainView === item.id ? "bg-hit-elevated text-hit-text" : "text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50")}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Issue Views */}
      {mainView === "issues" && (
        <div className="px-3 py-2 space-y-0.5">
          <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5" data-sidebar-item>Views</div>
          <button data-sidebar-item onClick={() => setIssueViewMode("list")} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors", issueViewMode === "list" ? "bg-hit-elevated text-hit-text" : "text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50")}>
            <LayoutList className="w-4 h-4" /> List <kbd className="ml-auto px-1.5 py-0.5 text-[10px] bg-hit-surface border border-hit-border rounded text-hit-muted">1</kbd>
          </button>
          <button data-sidebar-item onClick={() => setIssueViewMode("board")} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors", issueViewMode === "board" ? "bg-hit-elevated text-hit-text" : "text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50")}>
            <Columns3 className="w-4 h-4" /> Board <kbd className="ml-auto px-1.5 py-0.5 text-[10px] bg-hit-surface border border-hit-border rounded text-hit-muted">2</kbd>
          </button>
        </div>
      )}

      {/* Your Space */}
      <div className="px-3 py-2 space-y-0.5">
        <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5" data-sidebar-item>Your Space</div>
        {navItems.map((item) => (
          <button key={item.id} data-sidebar-item onClick={item.action} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors", item.isActive ? "bg-hit-elevated text-hit-text" : "text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50")}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Saved Views */}
      {savedViews.length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center justify-between" data-sidebar-item>
            Saved Views
            <button onClick={() => setSaveViewOpen(true)} className="text-hit-accent hover:text-hit-text transition-colors"><Bookmark className="w-3 h-3" /></button>
          </div>
          {savedViews.map((view) => (
            <div key={view.id} data-sidebar-item className="group flex items-center gap-1">
              <button onClick={() => { setMainView("issues"); setIssueViewMode(view.viewMode); setStatusFilter(view.filters.status); setProjectFilter(view.filters.projectId); setCycleFilter(view.filters.cycleId); setPriorityFilter(view.filters.priority); }} className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50 transition-colors truncate text-left">
                <Bookmark className="w-3 h-3 shrink-0" />
                <span className="truncate">{view.name}</span>
              </button>
              <button onClick={() => { deleteSavedView(view.id); }} className="opacity-0 group-hover:opacity-100 p-1.5 text-hit-muted hover:text-red-400 transition-all rounded-md hover:bg-hit-elevated">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center justify-between" data-sidebar-item>
            Projects
            <button onClick={() => setCreateProjectOpen(true)} className="text-hit-accent hover:text-hit-text transition-colors"><Zap className="w-3 h-3" /></button>
          </div>
          {projects.slice(0, 6).map((project) => (
            <button key={project.id} data-sidebar-item onClick={() => { setMainView("projects"); setSelectedProjectId(project.id); }} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50 transition-colors truncate text-left">
              <div className="w-2 h-2 rounded-full bg-hit-accent shrink-0" />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cycles */}
      {cycles.length > 0 && (
        <div className="px-3 py-2 space-y-0.5">
          <div className="text-[11px] font-semibold text-hit-muted uppercase tracking-wider px-3 py-1.5 flex items-center justify-between" data-sidebar-item>
            Cycles
            <button onClick={() => setCreateCycleOpen(true)} className="text-hit-accent hover:text-hit-text transition-colors"><Zap className="w-3 h-3" /></button>
          </div>
          {cycles.slice(0, 6).map((cycle) => (
            <button key={cycle.id} data-sidebar-item onClick={() => { setMainView("cycles"); setSelectedCycleId(cycle.id); }} className={cn("w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors truncate text-left", cycle.status === "active" ? "text-hit-accent hover:text-hit-text hover:bg-hit-elevated/50" : "text-hit-muted hover:text-hit-text hover:bg-hit-elevated/50")}>
              <Timer className="w-3 h-3 shrink-0" />
              <span className="truncate">{cycle.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {activeFiltersCount() > 0 && (
        <div className="px-3 py-2" data-sidebar-item>
          <button onClick={clearAllFilters} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-hit-accent hover:bg-hit-accent/10 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Clear {activeFiltersCount()} filter{activeFiltersCount() > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* New Issue Button */}
      <div className="mt-auto px-3 py-4 border-t border-hit-border space-y-2">
        <button data-sidebar-item onClick={() => setCreateIssueOpen(true)} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors">
          <Zap className="w-4 h-4" />
          New Issue
          <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded">C</kbd>
        </button>
      </div>
    </aside>
  );
}