"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { createProject } from "@/lib/db";
import { ProjectStatus, PROJECT_STATUS_LABELS } from "@/types";
import { X, FolderKanban } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CreateProjectModal() {
  const { createProjectOpen, setCreateProjectOpen, addProject } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [targetDate, setTargetDate] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (createProjectOpen) gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" });
  }, { dependencies: [createProjectOpen] });

  if (!createProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const project = await createProject({ name: name.trim(), description: description.trim(), status, startDate: Date.now(), targetDate: targetDate ? new Date(targetDate).getTime() : null });
    addProject(project);
    setName(""); setDescription(""); setStatus("planned"); setTargetDate("");
    setCreateProjectOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-lg bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border">
            <div className="flex items-center gap-2 text-hit-text font-medium"><FolderKanban className="w-4 h-4 text-hit-accent" /> New Project</div>
            <button type="button" onClick={() => setCreateProjectOpen(false)} className="text-hit-muted hover:text-hit-text transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="w-full bg-transparent text-lg font-medium text-hit-text placeholder-hit-muted outline-none" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." rows={3} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2.5 text-sm text-hit-text placeholder-hit-muted outline-none focus:border-hit-accent/50 resize-none" />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Status</span><select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none focus:border-hit-accent/50">{Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
              <div className="flex items-center gap-2"><span className="text-xs text-hit-muted uppercase font-medium">Target</span><input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none focus:border-hit-accent/50" /></div>
            </div>
          </div>
          <div className="flex items-center justify-end px-5 py-4 border-t border-hit-border bg-hit-bg/30 gap-2">
            <button type="button" onClick={() => setCreateProjectOpen(false)} className="px-4 py-2 rounded-lg text-sm text-hit-muted hover:text-hit-text hover:bg-hit-elevated transition-colors">Cancel</button>
            <button type="submit" disabled={!name.trim()} className="px-4 py-2 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}