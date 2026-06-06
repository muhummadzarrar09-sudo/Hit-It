"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { IssueCard } from "./issue-card";
import { STATUS_LABELS } from "@/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Filter, Bookmark } from "lucide-react";

export function ListView() {
  const { filteredIssues, statusFilter, setStatusFilter, setSaveViewOpen, issues, activeFiltersCount, clearAllFilters } = useStore();
  const issuesList = filteredIssues();
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const els = itemsRef.current.filter(Boolean);
    if (els.length === 0) return;
    gsap.fromTo(els, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.025, ease: "power2.out", overwrite: true });
  }, { dependencies: [issuesList.length, issues.length] });

  if (issuesList.length === 0 && issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-hit-muted">
        <p className="text-sm">No issues yet.</p>
        <p className="text-xs mt-1">Press <kbd className="px-1.5 py-0.5 bg-hit-elevated border border-hit-border rounded text-[10px]">C</kbd> to create your first issue.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-hit-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-hit-text">Issues</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{issuesList.length}</span>
          {activeFiltersCount() > 0 && (
            <button onClick={clearAllFilters} className="text-xs text-hit-accent hover:underline flex items-center gap-1">
              <Filter className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter ?? ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="bg-hit-bg border border-hit-border rounded-md px-2 py-1 text-xs text-hit-text outline-none focus:border-hit-accent/50"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          {activeFiltersCount() > 0 && (
            <button onClick={() => setSaveViewOpen(true)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-hit-elevated border border-hit-border text-xs text-hit-muted hover:text-hit-text transition-colors">
              <Bookmark className="w-3 h-3" /> Save view
            </button>
          )}
        </div>
      </div>
      {issuesList.length === 0 && issues.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-hit-muted">
          <Filter className="w-6 h-6 mb-2 opacity-50" />
          <p className="text-sm">No issues match your filters.</p>
          <button onClick={clearAllFilters} className="mt-2 text-xs text-hit-accent hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="divide-y divide-hit-border/30">
          {issuesList.map((issue, i) => (
            <div key={issue.id} ref={(el) => { itemsRef.current[i] = el; }}>
              <IssueCard issue={issue} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}