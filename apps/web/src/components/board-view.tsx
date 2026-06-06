"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { Issue, STATUS_LABELS, type IssueStatus } from "@/types";
import { updateIssue } from "@/lib/db";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowLeft } from "lucide-react";

const COLUMNS: IssueStatus[] = ["backlog", "todo", "in_progress", "in_review", "done"];

export function BoardView() {
  const { filteredIssues, updateIssue: updateStore } = useStore();
  const all = filteredIssues();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll("[data-board-card]");
    if (cards.length === 0) return;
    gsap.fromTo(cards, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.03, ease: "back.out(1.2)" });
  }, { scope: containerRef, dependencies: [all.length] });

  const moveIssue = async (id: string, status: IssueStatus) => {
    await updateIssue(id, { status });
    updateStore(id, { status });
  };

  return (
    <div className="h-full overflow-x-auto">
      <div ref={containerRef} className="flex gap-4 px-6 py-4 h-full min-w-max">
        {COLUMNS.map((col) => {
          const colIssues = all.filter((i) => i.status === col);
          return (
            <div key={col} className="w-80 flex flex-col h-full bg-hit-bg/50 rounded-xl border border-hit-border/50">
              <div className="flex items-center justify-between px-3 py-3 border-b border-hit-border/50">
                <span className="text-xs font-semibold text-hit-muted uppercase tracking-wider">{STATUS_LABELS[col]}</span>
                <span className="text-xs text-hit-muted bg-hit-elevated px-2 py-0.5 rounded-full">{colIssues.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {colIssues.map((issue) => (
                  <BoardCard key={issue.id} issue={issue} onMove={moveIssue} />
                ))}
                {colIssues.length === 0 && (
                  <div className="flex items-center justify-center h-20 text-hit-muted text-xs border border-dashed border-hit-border/50 rounded-lg">Move issues here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoardCard({ issue, onMove }: { issue: Issue; onMove: (id: string, status: IssueStatus) => void }) {
  const { setSelectedIssueId } = useStore();
  const order: IssueStatus[] = ["backlog", "todo", "in_progress", "in_review", "done"];
  const idx = order.indexOf(issue.status);
  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx < order.length - 1 ? order[idx + 1] : null;

  return (
    <div data-board-card onClick={() => setSelectedIssueId(issue.id)} className="group p-3 rounded-lg bg-hit-surface border border-hit-border hover:border-hit-accent/30 cursor-pointer transition-colors hover:shadow-lg hover:shadow-hit-accent/5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-hit-text leading-snug">{issue.title}</h4>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-mono text-hit-muted">{issue.identifier}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {prev && <button onClick={(e) => { e.stopPropagation(); onMove(issue.id, prev!); }} className="px-1.5 py-0.5 text-[10px] bg-hit-elevated border border-hit-border rounded text-hit-muted hover:text-hit-text transition-colors"><ArrowLeft className="w-3 h-3" /></button>}
          {next && <button onClick={(e) => { e.stopPropagation(); onMove(issue.id, next!); }} className="px-1.5 py-0.5 text-[10px] bg-hit-elevated border border-hit-border rounded text-hit-muted hover:text-hit-text transition-colors"><ArrowRight className="w-3 h-3" /></button>}
        </div>
      </div>
    </div>
  );
}