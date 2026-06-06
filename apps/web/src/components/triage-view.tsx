"use client";

import { useRef } from "react";
import { useStore } from "@/lib/store";
import { IssueCard } from "./issue-card";
import { updateIssue } from "@/lib/db";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Inbox, ArrowRight, CheckCircle2 } from "lucide-react";

export function TriageView() {
  const { issues, cycles, updateIssue: updateStore } = useStore();
  const triageIssues = issues.filter((i) => i.status === "backlog" && !i.cycleId);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = container.querySelectorAll("[data-triage-item]");
    if (items.length === 0) return;
    gsap.fromTo(items, { opacity: 0, x: -20, scale: 0.98 }, { opacity: 1, x: 0, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(1.2)" });
  }, { scope: containerRef, dependencies: [triageIssues.length] });

  const activeCycle = cycles.find((c) => c.status === "active");

  const assignToCycle = async (issueId: string) => {
    if (!activeCycle) return;
    await updateIssue(issueId, { cycleId: activeCycle.id });
    updateStore(issueId, { cycleId: activeCycle.id });
  };

  const setTodo = async (issueId: string) => {
    await updateIssue(issueId, { status: "todo" });
    updateStore(issueId, { status: "todo" });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-hit-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Inbox className="w-4 h-4 text-hit-accent" />
          <h2 className="text-sm font-semibold text-hit-text">Triage Inbox</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{triageIssues.length}</span>
        </div>
        <div className="text-xs text-hit-muted">{activeCycle ? `Active cycle: ${activeCycle.name}` : "No active cycle"}</div>
      </div>

      {triageIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-hit-muted">
          <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500 opacity-50" />
          <p className="text-sm">Inbox zero. Nothing to triage!</p>
        </div>
      ) : (
        <div ref={containerRef} className="divide-y divide-hit-border/30">
          {triageIssues.map((issue) => (
            <div key={issue.id} data-triage-item className="group">
              <div className="flex items-center gap-2 px-6 py-2 bg-hit-bg/30">
                <button onClick={() => setTodo(issue.id)} className="px-2 py-1 rounded-md bg-hit-elevated border border-hit-border text-[11px] text-hit-muted hover:text-hit-text hover:border-hit-accent/30 transition-colors flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Todo
                </button>
                {activeCycle && (
                  <button onClick={() => assignToCycle(issue.id)} className="px-2 py-1 rounded-md bg-hit-elevated border border-hit-border text-[11px] text-hit-muted hover:text-hit-text hover:border-hit-accent/30 transition-colors flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" /> {activeCycle.name}
                  </button>
                )}
                <span className="text-[11px] text-hit-muted ml-2">Press actions to process</span>
              </div>
              <IssueCard issue={issue} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}