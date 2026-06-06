"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { Issue, STATUS_LABELS, PRIORITY_ICONS, PRIORITY_COLORS } from "@/types";
import { cn } from "@/lib/utils";
import { updateIssue } from "@/lib/db";
import { useHoverScale } from "@/hooks/use-gsap-animations";

export function IssueCard({
  issue,
  compact = false,
}: {
  issue: Issue;
  compact?: boolean;
}) {
  const { setSelectedIssueId, selectedIssueId, updateIssue: updateStore, projects, cycles } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const hoverHandlers = useHoverScale(cardRef);
  const isSelected = selectedIssueId === issue.id;

  const cycleStatus = async () => {
    const order: Issue["status"][] = ["backlog", "todo", "in_progress", "in_review", "done"];
    const next = order[(order.indexOf(issue.status) + 1) % order.length];
    await updateIssue(issue.id, { status: next });
    updateStore(issue.id, { status: next });
  };

  const project = projects.find((p) => p.id === issue.projectId);
  const cycle = cycles.find((c) => c.id === issue.cycleId);

  if (compact) {
    return (
      <div
        ref={cardRef}
        onClick={() => setSelectedIssueId(issue.id)}
        {...hoverHandlers}
        className={cn(
          "group flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors origin-left",
          isSelected ? "bg-hit-elevated" : "hover:bg-hit-elevated/50"
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); cycleStatus(); }}
          className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
            issue.status === "done" ? "bg-emerald-500 border-emerald-500" : "border-hit-muted hover:border-hit-text"
          )}
        >
          {issue.status === "done" && (
            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className="flex flex-col min-w-0">
          <span className={cn("text-sm font-medium truncate", issue.status === "done" ? "text-hit-muted line-through" : "text-hit-text")}>{issue.title}</span>
          <div className="flex items-center gap-2 mt-0.5">
            {project && <span className="text-[10px] px-1.5 py-0.5 rounded bg-hit-elevated border border-hit-border text-hit-muted truncate max-w-[120px]">{project.name}</span>}
            {cycle && <span className="text-[10px] px-1.5 py-0.5 rounded bg-hit-elevated border border-hit-border text-hit-muted">{cycle.name}</span>}
          </div>
        </div>
        <span className="ml-auto text-xs font-mono text-hit-muted shrink-0">{issue.identifier}</span>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onClick={() => setSelectedIssueId(issue.id)}
      {...hoverHandlers}
      className={cn(
        "group p-4 rounded-xl border cursor-pointer transition-all origin-center",
        isSelected ? "bg-hit-elevated border-hit-accent/30" : "bg-hit-surface border-hit-border hover:border-hit-border/80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-hit-muted">{issue.identifier}</span>
          <span className={cn("text-xs", PRIORITY_COLORS[issue.priority])}>{PRIORITY_ICONS[issue.priority]}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-hit-bg border border-hit-border text-hit-muted">{STATUS_LABELS[issue.status]}</span>
      </div>
      <h3 className="mt-2 text-sm font-medium text-hit-text leading-snug">{issue.title}</h3>
      {issue.description && <p className="mt-1 text-xs text-hit-muted line-clamp-2">{issue.description}</p>}
      <div className="flex items-center gap-2 mt-2">
        {project && <span className="text-[10px] px-2 py-0.5 rounded bg-hit-elevated border border-hit-border text-hit-muted">{project.name}</span>}
        {cycle && <span className="text-[10px] px-2 py-0.5 rounded bg-hit-elevated border border-hit-border text-hit-muted">{cycle.name}</span>}
      </div>
    </div>
  );
}