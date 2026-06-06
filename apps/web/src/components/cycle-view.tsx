"use client";

import { useRef, useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getIssuesByCycle, deleteCycle, rolloverIncompleteIssues, getIncompleteIssuesByCycle } from "@/lib/db";
import { CYCLE_STATUS_LABELS, type Issue } from "@/types";
import { Timer, Trash2, ArrowLeft, RotateCcw, CalendarDays } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CycleView() {
  const { cycles, selectedCycleId, setSelectedCycleId, setMainView, removeCycle, issues, setIssues } = useStore();
  const [cycleIssues, setCycleIssues] = useState<Issue[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const cycle = cycles.find((c) => c.id === selectedCycleId);
  const doneCount = cycleIssues.filter((i) => i.status === "done").length;
  const totalCount = cycleIssues.length;
  const incompleteCount = totalCount - doneCount;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  useGSAP(() => {
    const list = listRef.current;
    if (!list || selectedCycleId) return;
    gsap.fromTo(list.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "back.out(1.2)" });
  }, { dependencies: [cycles.length, selectedCycleId] });

  useEffect(() => {
    if (!selectedCycleId) { setCycleIssues([]); return; }
    getIssuesByCycle(selectedCycleId).then(setCycleIssues);
  }, [selectedCycleId, issues]);

  useGSAP(() => {
    if (!pctRef.current) return;
    const obj = { val: 0 };
    gsap.fromTo(obj, { val: 0 }, { val: progress, duration: 0.6, ease: "power2.out", onUpdate: () => { if (pctRef.current) pctRef.current.textContent = String(Math.round(obj.val)); } });
  }, { dependencies: [progress, selectedCycleId] });

  if (selectedCycleId && cycle) {
    const handleRollover = async () => {
      const nextCycle = cycles.find((c) => c.status === "active" && c.id !== cycle.id);
      if (!nextCycle) { alert("No active upcoming cycle to rollover to."); return; }
      const count = await rolloverIncompleteIssues(cycle.id, nextCycle.id);
      const updatedIssues = await getIssuesByCycle(nextCycle.id);
      setIssues(issues.map((i) => updatedIssues.find((u) => u.id === i.id) || i));
      setCycleIssues(cycleIssues.filter((i) => i.status === "done"));
      alert(`Rolled over ${count} incomplete issues to ${nextCycle.name}.`);
    };

    return (
      <div className="h-full overflow-y-auto px-6 py-6">
        <button onClick={() => setSelectedCycleId(null)} className="flex items-center gap-1.5 text-xs text-hit-muted hover:text-hit-text mb-4 transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Back to cycles</button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-hit-accent" />
              <h1 className="text-xl font-semibold text-hit-text">{cycle.name}</h1>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full", cycle.status === "active" ? "bg-hit-accent/10 text-hit-accent" : cycle.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-hit-muted/20 text-hit-muted")}>{CYCLE_STATUS_LABELS[cycle.status]}</span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-hit-muted">
              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}</span>
              <span>{totalCount} issues</span><span>{doneCount} done</span>
              {incompleteCount > 0 && cycle.status === "completed" && <span className="text-hit-warning">{incompleteCount} incomplete</span>}
            </div>
            {totalCount > 0 && <div className="mt-3 w-64 h-1.5 bg-hit-bg rounded-full overflow-hidden border border-hit-border"><div className="h-full bg-hit-accent rounded-full transition-all duration-700" style={{ width: `${progress}%` }} /></div>}
          </div>
          <div className="flex items-center gap-1">
            {cycle.status === "completed" && <button onClick={handleRollover} className="p-2 rounded-lg hover:bg-hit-elevated text-hit-muted hover:text-hit-text transition-colors" title="Rollover incomplete issues to active cycle"><RotateCcw className="w-4 h-4" /></button>}
            <button onClick={async () => { await deleteCycle(cycle.id); removeCycle(cycle.id); setSelectedCycleId(null); }} className="p-2 rounded-lg hover:bg-red-500/10 text-hit-muted hover:text-red-400 transition-colors" title="Delete cycle"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="mt-6 space-y-1">
          {cycleIssues.length === 0 && <div className="text-sm text-hit-muted py-8 text-center">No issues assigned to this cycle.</div>}
          {cycleIssues.map((issue) => (
            <div key={issue.id} className="flex items-center gap-3 px-6 py-3 rounded-lg hover:bg-hit-elevated/50 border border-hit-border/30 cursor-pointer transition-colors">
              <span className="text-xs font-mono text-hit-muted">{issue.identifier}</span>
              <span className="text-sm text-hit-text flex-1">{issue.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{issue.status.replace("_", " ")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-hit-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-hit-text">Cycles</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{cycles.length}</span>
      </div>
      <div ref={listRef} className="px-6 py-4 space-y-2 max-w-2xl">
        {cycles.map((cycle) => {
          const cIssues = issues.filter((i) => i.cycleId === cycle.id);
          const done = cIssues.filter((i) => i.status === "done").length;
          const total = cIssues.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <button key={cycle.id} onClick={() => setSelectedCycleId(cycle.id)} className="w-full text-left p-4 rounded-xl bg-hit-surface border border-hit-border hover:border-hit-accent/30 transition-colors flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-hit-elevated border border-hit-border flex items-center justify-center shrink-0"><Timer className="w-5 h-5 text-hit-accent" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="text-sm font-medium text-hit-text">{cycle.name}</span><span className={cn("text-[10px] px-2 py-0.5 rounded-full", cycle.status === "active" ? "bg-hit-accent/10 text-hit-accent" : cycle.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-hit-muted/20 text-hit-muted")}>{CYCLE_STATUS_LABELS[cycle.status]}</span></div>
                <div className="mt-1 text-xs text-hit-muted flex items-center gap-3"><span>{new Date(cycle.startDate).toLocaleDateString()} — {new Date(cycle.endDate).toLocaleDateString()}</span><span>{total} issues</span><span>{done} done</span></div>
                {total > 0 && <div className="mt-2 h-1 bg-hit-bg rounded-full overflow-hidden"><div className="h-full bg-hit-accent rounded-full transition-all duration-700" style={{ width: `${pct}%` }} /></div>}
              </div>
            </button>
          );
        })}
        {cycles.length === 0 && <div className="text-center text-sm text-hit-muted py-12">No cycles yet. Create one from the sidebar or Command Palette.</div>}
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}