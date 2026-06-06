"use client";

import { useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, type Project } from "@/types";
import { Map, CalendarDays } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function RoadmapView() {
  const { projects } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const now = Date.now();
  const monthMs = 1000 * 60 * 60 * 24 * 30;
  const startWindow = now - monthMs;
  const endWindow = now + monthMs * 3;
  const totalWidth = endWindow - startWindow;

  const visibleProjects = projects.filter((p) => {
    if (!p.startDate && !p.targetDate) return true;
    const s = p.startDate ?? startWindow;
    const e = p.targetDate ?? endWindow;
    return e >= startWindow && s <= endWindow;
  });

  const months: { label: string; start: number; end: number }[] = [];
  for (let i = -1; i <= 3; i++) {
    const d = new Date();
    d.setDate(1); d.setMonth(d.getMonth() + i); d.setHours(0, 0, 0, 0);
    const s = d.getTime();
    d.setMonth(d.getMonth() + 1);
    const e = d.getTime();
    months.push({ label: new Date(s).toLocaleString("default", { month: "short", year: "2-digit" }), start: s, end: e });
  }

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const rows = container.querySelectorAll("[data-roadmap-row]");
    const bars = container.querySelectorAll("[data-roadmap-bar]");
    gsap.fromTo(rows, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" });
    gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.06, ease: "power2.out", delay: 0.2, transformOrigin: "left center" });
  }, { scope: containerRef, dependencies: [projects.length] });

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-4 border-b border-hit-border flex items-center gap-2">
        <Map className="w-4 h-4 text-hit-accent" />
        <h2 className="text-sm font-semibold text-hit-text">Roadmap</h2>
        <span className="text-xs text-hit-muted ml-2">{visibleProjects.length} projects</span>
      </div>

      <div ref={containerRef} className="px-6 py-6">
        <div className="flex border-b border-hit-border pb-2 mb-4">
          {months.map((m) => <div key={m.label} className="flex-1 text-center"><div className="text-[10px] font-semibold text-hit-muted uppercase tracking-wider">{m.label}</div></div>)}
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 w-px bg-hit-accent/70 z-10" style={{ left: `${((now - startWindow) / totalWidth) * 100}%` }}>
            <div className="absolute -top-1 -translate-x-1/2 w-2 h-2 rounded-full bg-hit-accent" />
            <div className="absolute -top-5 -translate-x-1/2 text-[9px] text-hit-accent font-medium whitespace-nowrap">TODAY</div>
          </div>

          <div className="space-y-3">
            {visibleProjects.map((project) => {
              const s = (project.startDate ?? now) - startWindow;
              const e = (project.targetDate ?? now + monthMs) - startWindow;
              const left = (s / totalWidth) * 100;
              const width = Math.max(2, ((e - s) / totalWidth) * 100);
              return (
                <div key={project.id} data-roadmap-row className="relative h-10 flex items-center">
                  <div className="w-40 shrink-0 pr-4 text-left">
                    <div className="text-xs font-medium text-hit-text truncate">{project.name}</div>
                    <div className="text-[10px] text-hit-muted truncate">{PROJECT_STATUS_LABELS[project.status]}</div>
                  </div>
                  <div className="flex-1 relative h-6 bg-hit-bg/50 rounded-md border border-hit-border/30 overflow-hidden">
                    {project.startDate && project.targetDate && (
                      <div
                        data-roadmap-bar
                        className={cn("absolute top-0.5 bottom-0.5 rounded-sm border", project.status === "completed" ? "bg-emerald-500/20 border-emerald-500/30" : project.status === "in_progress" ? "bg-hit-accent/20 border-hit-accent/30" : "bg-hit-muted/20 border-hit-muted/30")}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                    )}
                    {!project.startDate && !project.targetDate && <div className="flex items-center justify-center h-full"><span className="text-[10px] text-hit-muted">No dates set</span></div>}
                  </div>
                </div>
              );
            })}
            {visibleProjects.length === 0 && <div className="text-center text-sm text-hit-muted py-12">No projects with dates to display.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}