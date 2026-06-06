"use client";

import { useState, useRef } from "react";
import { useStore } from "@/lib/store";
import { createIssueRelation } from "@/lib/db";
import { type RelationType, RELATION_LABELS } from "@/types";
import { X, Link } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function AddRelationModal() {
  const { addRelationOpen, setAddRelationOpen, issues, selectedIssueId, addIssueRelation } = useStore();
  const [targetId, setTargetId] = useState("");
  const [type, setType] = useState<RelationType>("related");
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!modalRef.current) return;
    if (addRelationOpen) gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.92, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.4)" });
  }, { dependencies: [addRelationOpen] });

  if (!addRelationOpen || !selectedIssueId) return null;

  const availableIssues = issues.filter((i) => i.id !== selectedIssueId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    const relation = await createIssueRelation({ sourceId: selectedIssueId, targetId, type });
    addIssueRelation(relation);
    setTargetId(""); setType("related");
    setAddRelationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div ref={modalRef} className="w-full max-w-md bg-hit-surface border border-hit-border rounded-xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border">
            <div className="flex items-center gap-2 text-hit-text font-medium"><Link className="w-4 h-4 text-hit-accent" /> Add Relation</div>
            <button type="button" onClick={() => setAddRelationOpen(false)} className="text-hit-muted hover:text-hit-text transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-hit-muted uppercase font-medium">Type</span>
              <select value={type} onChange={(e) => setType(e.target.value as RelationType)} className="bg-hit-bg border border-hit-border rounded-md px-2 py-1.5 text-sm text-hit-text outline-none">{Object.entries(RELATION_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-hit-muted uppercase font-medium">Issue</span>
              <div className="max-h-48 overflow-y-auto border border-hit-border rounded-lg">
                {availableIssues.length === 0 && <div className="p-3 text-sm text-hit-muted">No other issues.</div>}
                {availableIssues.map((issue) => (
                  <button key={issue.id} type="button" onClick={() => setTargetId(issue.id)} className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${targetId === issue.id ? "bg-hit-accent/10 text-hit-accent" : "text-hit-text hover:bg-hit-elevated"}`}>
                    <span className="text-xs font-mono text-hit-muted">{issue.identifier}</span>
                    <span className="truncate">{issue.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end px-5 py-4 border-t border-hit-border bg-hit-bg/30 gap-2">
            <button type="button" onClick={() => setAddRelationOpen(false)} className="px-4 py-2 rounded-lg text-sm text-hit-muted hover:text-hit-text hover:bg-hit-elevated transition-colors">Cancel</button>
            <button type="submit" disabled={!targetId} className="px-4 py-2 rounded-lg bg-hit-accent hover:bg-hit-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Add Relation</button>
          </div>
        </form>
      </div>
    </div>
  );
}