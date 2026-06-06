"use client";

import { useRef, useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getIssuesByProject, deleteProject } from "@/lib/db";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, type Issue } from "@/types";
import { FolderKanban, Trash2, ArrowLeft, CalendarDays } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function ProjectView() {
  const { projects, selectedProjectId, setSelectedProjectId, setMainView, removeProject, issues } = useStore();
  const [projectIssues, setProjectIssues] = useState<Issue[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const project = projects.find((p) => p.id === selectedProjectId);
  const doneCount = projectIssues.filter((i) => i.status === "done").length;
  const totalCount = projectIssues.length;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  useGSAP(() => {
    const grid = gridRef.current;
    if (!grid || selectedProjectId) return;
    gsap.fromTo(grid.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "back.out(1.2)" });
  }, { dependencies: [projects.length, selectedProjectId] });

  useEffect(() => {
    if (!selectedProjectId) { setProjectIssues([]); return; }
    getIssuesByProject(selectedProjectId).then(setProjectIssues);
  }, [selectedProjectId, issues]);

  useGSAP(() => {
    if (!pctRef.current) return;
    const obj = { val: 0 };
    gsap.fromTo(obj, { val: 0 }, { val: progress, duration: 0.6, ease: "power2.out", onUpdate: () => { if (pctRef.current) pctRef.current.textContent = String(Math.round(obj.val)); } });
  }, { dependencies: [progress, selectedProjectId] });

  if (selectedProjectId && project) {
    return (
      <div className="h-full overflow-y-auto px-6 py-6">
        <button onClick={() => setSelectedProjectId(null)} className="flex items-center gap-1.5 text-xs text-hit-muted hover:text-hit-text mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <FolderKanban className="w-5 h-5 text-hit-accent" />
              <h1 className="text-xl font-semibold text-hit-text">{project.name}</h1>
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full", PROJECT_STATUS_COLORS[project.status])}>{PROJECT_STATUS_LABELS[project.status]}</span>
            </div>
            {project.description && <p className="mt-2 text-sm text-hit-muted max-w-xl">{project.description}</p>}
            <div className="mt-3 flex items-center gap-4 text-xs text-hit-muted">
              {project.targetDate && <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Target: {new Date(project.targetDate).toLocaleDateString()}</span>}
              <span>{totalCount} issues</span>
              <span>{doneCount} done (<span ref={pctRef}>0</span>%)</span>
            </div>
          </div>
          <button onClick={async () => { await deleteProject(project.id); removeProject(project.id); setSelectedProjectId(null); }} className="p-2 rounded-lg hover:bg-red-500/10 text-hit-muted hover:text-red-400 transition-colors" title="Delete project"><Trash2 className="w-4 h-4" /></button>
        </div>
        {totalCount > 0 && (
          <div className="mt-4 w-full h-2 bg-hit-bg rounded-full overflow-hidden border border-hit-border">
            <div className="h-full bg-hit-accent rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        )}
        <div className="mt-6 space-y-1">
          {projectIssues.length === 0 && <div className="text-sm text-hit-muted py-8 text-center">No issues in this project yet.</div>}
          {projectIssues.map((issue) => (
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
        <h2 className="text-sm font-semibold text-hit-text">Projects</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-hit-elevated border border-hit-border text-hit-muted">{projects.length}</span>
      </div>
      <div ref={gridRef} className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project) => {
          const pIssues = issues.filter((i) => i.projectId === project.id);
          const done = pIssues.filter((i) => i.status === "done").length;
          const total = pIssues.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <button key={project.id} onClick={() => setSelectedProjectId(project.id)} className="text-left p-4 rounded-xl bg-hit-surface border border-hit-border hover:border-hit-accent/30 transition-colors group">
              <div className="flex items-center gap-2"><FolderKanban className="w-4 h-4 text-hit-accent" /><span className="text-sm font-medium text-hit-text">{project.name}</span></div>
              {project.description && <p className="mt-1.5 text-xs text-hit-muted line-clamp-2">{project.description}</p>}
              <div className="mt-3 flex items-center justify-between"><span className={cn("text-[10px] px-2 py-0.5 rounded-full", PROJECT_STATUS_COLORS[project.status])}>{PROJECT_STATUS_LABELS[project.status]}</span><span className="text-[10px] text-hit-muted">{total} issues · {pct}% done</span></div>
              {total > 0 && <div className="mt-2 h-1 bg-hit-bg rounded-full overflow-hidden"><div className="h-full bg-hit-accent rounded-full transition-all duration-700" style={{ width: `${pct}%` }} /></div>}
            </button>
          );
        })}
        {projects.length === 0 && <div className="col-span-full text-center text-sm text-hit-muted py-12">No projects yet. Create one from the sidebar or Command Palette.</div>}
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}