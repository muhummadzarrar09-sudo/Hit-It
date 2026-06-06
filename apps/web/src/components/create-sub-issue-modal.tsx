"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { createIssue } from "@/lib/db";
import { IssueStatus, IssuePriority, STATUS_LABELS, PRIORITY_LABELS, PRIORITY_ICONS } from "@/types";
import { X, GitBranch } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CreateSubIssueModal() {
  const { createSubIssueOpen, setCreateSubIssueOpen, addIssue, selectedIssueId, projects, cycles } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<IssueStatus>("backlog");
  const [priority, setPriority] = useState<IssuePriority>(0);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [cycleId, setCycleId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (createSubIssueOpen) gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" });
  }, { dependencies: [createSubIssueOpen] });

  if (!createSubIssueOpen || !selectedIssueId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const issue = await createIssue({ title: title.trim(), description: description.trim(), status, priority, projectId, cycleId, labels: [], parentId: selectedIssueId });
    addIssue(issue);
    setTitle(""); setDescription(""); setStatus("backlog"); setPriority(0); setProjectId(null); setCycleId(null);
    setCreateSubIssueOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-lg bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border">
            <div className="flex items-center gap-2 text-hit-text font-medium"><GitBranch className="w-4 h-4 text-hit-accent" /> New Sub-Issue</div>
            <button type="button" onClick={() => setCreateSubIssueOpen(false)} className="text-hit-muted hover:text-hit-text transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div><input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sub-issue title" className="w-full bg-transparent text-lg font-medium text-hit-text placeholder-hit-muted outline-none" /></div>
            <div><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." rows={3} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2.5 text-sm text-hit-text placeholder-hit-muted outline-none focus:border-hit-accent/50 resize-none" /></div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Status</span><select value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none">{Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Priority</span><select value={priority} onChange={(e) => setPriority(Number(e.target.value) as IssuePriority)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none">{Object.entries(PRIORITY_LABELS).map(([key, label]) => <option key={key} value={Number(key)}>{PRIORITY_ICONS[Number(key) as IssuePriority]} {label}</option>)}</select></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Project</span><select value={projectId ?? ""} onChange={(e) => setProjectId(e.target.value || null)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none"><option value="">None</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Cycle</span><select value={cycleId ?? ""} onChange={(e) => setCycleId(e.target.value || null)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none"><option value="">None</option>{cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>
          </div>
          <div className="flex items-center justify-end px-5 py-4 border-t border-hit-border bg-hit-bg/30 gap-2">
            <button type="button" onClick={() => setCreateSubIssueOpen(false)} className="px-4 py-2 rounded-lg text-sm text-hit-muted hover:text-hit-text hover:bg-hit-elevated transition-colors">Cancel</button>
            <button type="submit" disabled={!title.trim()} className="px-4 py-2 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create Sub-Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
}