"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { createCycle } from "@/lib/db";
import { CycleStatus, CYCLE_STATUS_LABELS } from "@/types";
import { X, Timer } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CreateCycleModal() {
  const { createCycleOpen, setCreateCycleOpen, addCycle } = useStore();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<CycleStatus>("upcoming");
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (createCycleOpen) gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" });
  }, { dependencies: [createCycleOpen] });

  if (!createCycleOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    const cycle = await createCycle({ name: name.trim(), startDate: new Date(startDate).getTime(), endDate: new Date(endDate).getTime(), status });
    addCycle(cycle);
    setName(""); setStartDate(""); setEndDate(""); setStatus("upcoming");
    setCreateCycleOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-lg bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border">
            <div className="flex items-center gap-2 text-hit-text font-medium"><Timer className="w-4 h-4 text-hit-accent" /> New Cycle</div>
            <button type="button" onClick={() => setCreateCycleOpen(false)} className="text-hit-muted hover:text-hit-text transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Cycle name (e.g. Sprint 3)" className="w-full bg-transparent text-lg font-medium text-hit-text placeholder-hit-muted outline-none" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Start</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none focus:border-hit-accent/50" /></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">End</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none focus:border-hit-accent/50" /></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Status</span><select value={status} onChange={(e) => setStatus(e.target.value as CycleStatus)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none focus:border-hit-accent/50">{Object.entries(CYCLE_STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
            </div>
          </div>
          <div className="flex items-center justify-end px-5 py-4 border-t border-hit-border bg-hit-bg/30 gap-2">
            <button type="button" onClick={() => setCreateCycleOpen(false)} className="px-4 py-2 rounded-lg text-sm text-hit-muted hover:text-hit-text hover:bg-hit-elevated transition-colors">Cancel</button>
            <button type="submit" disabled={!name.trim() || !startDate || !endDate} className="px-4 py-2 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create Cycle</button>
          </div>
        </form>
      </div>
    </div>
  );
}