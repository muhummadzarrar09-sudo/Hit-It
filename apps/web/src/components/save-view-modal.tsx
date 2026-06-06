"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { createSavedView } from "@/lib/db";
import { IssueStatus, IssuePriority, type IssueViewMode } from "@/types";
import { X, Bookmark } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function SaveViewModal() {
  const {
    saveViewOpen,
    setSaveViewOpen,
    addSavedView,
    statusFilter,
    projectFilter,
    cycleFilter,
    priorityFilter,
    issueViewMode,
    projects,
    cycles,
  } = useStore();
  const [name, setName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (saveViewOpen) gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" });
  }, { dependencies: [saveViewOpen] });

  if (!saveViewOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const view = await createSavedView({
      name: name.trim(),
      filters: { status: statusFilter as IssueStatus | null, projectId: projectFilter, cycleId: cycleFilter, priority: priorityFilter as IssuePriority | null },
      sortBy: "updated",
      sortOrder: "desc",
      viewMode: issueViewMode,
    });
    addSavedView(view);
    setName("");
    setSaveViewOpen(false);
  };

  const filterDesc = [
    statusFilter ? `Status: ${statusFilter}` : null,
    projectFilter ? `Project: ${projects.find((p) => p.id === projectFilter)?.name}` : null,
    cycleFilter ? `Cycle: ${cycles.find((c) => c.id === cycleFilter)?.name}` : null,
    priorityFilter !== null ? `Priority: ${priorityFilter}` : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-md bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border">
            <div className="flex items-center gap-2 text-hit-text font-medium"><Bookmark className="w-4 h-4 text-hit-accent" /> Save Current View</div>
            <button type="button" onClick={() => setSaveViewOpen(false)} className="text-hit-muted hover:text-hit-text transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="View name (e.g. My Backlog)" className="w-full bg-transparent text-lg font-medium text-hit-text placeholder-hit-muted outline-none" />
            {filterDesc.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filterDesc.map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{f}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-end px-5 py-4 border-t border-hit-border bg-hit-bg/30 gap-2">
            <button type="button" onClick={() => setSaveViewOpen(false)} className="px-4 py-2 rounded-lg text-sm text-hit-muted hover:text-hit-text hover:bg-hit-elevated transition-colors">Cancel</button>
            <button type="submit" disabled={!name.trim()} className="px-4 py-2 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Save View</button>
          </div>
        </form>
      </div>
    </div>
  );
}