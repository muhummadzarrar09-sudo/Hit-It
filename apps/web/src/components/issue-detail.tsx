"use client";

import { useRef, useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { getIssueById, updateIssue, deleteIssue, getSubIssues, createComment, getCommentsByIssue, getRelationsForIssue, createIssueRelation, deleteIssueRelation, deleteComment } from "@/lib/db";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_ICONS,
  PRIORITY_COLORS,
  RELATION_LABELS,
  RELATION_COLORS,
  type Issue,
} from "@/types";
import { X, Trash2, Save, GitBranch, MessageSquare, Link, User, Clock } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function IssueDetail() {
  const {
    selectedIssueId,
    setSelectedIssueId,
    updateIssue: updateStore,
    removeIssue,
    projects,
    cycles,
    issues,
    setCreateSubIssueOpen,
    setAddRelationOpen,
  } = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [issue, setIssue] = useState<Issue | undefined>();
  const [subIssues, setSubIssues] = useState<Issue[]>([]);
  const [commentBody, setCommentBody] = useState("");
  const [comments, setLocalComments] = useState<Awaited<ReturnType<typeof getCommentsByIssue>>>([]);
  const [relations, setLocalRelations] = useState<Awaited<ReturnType<typeof getRelationsForIssue>>>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: "power2.out", delay: 0.15 });
    }
  }, { dependencies: [selectedIssueId] });

  useEffect(() => {
    if (!selectedIssueId) return;
    getIssueById(selectedIssueId).then((i) => {
      if (i) { setIssue(i); setTitle(i.title); setDescription(i.description); }
    });
    getSubIssues(selectedIssueId).then(setSubIssues);
    getCommentsByIssue(selectedIssueId).then(setLocalComments);
    getRelationsForIssue(selectedIssueId).then(setLocalRelations);
  }, [selectedIssueId]);

  if (!selectedIssueId || !issue) return null;

  const handleSave = async () => {
    await updateIssue(selectedIssueId, { title, description });
    updateStore(selectedIssueId, { title, description });
    setIssue({ ...issue, title, description });
  };

  const handleDelete = async () => {
    await deleteIssue(selectedIssueId);
    removeIssue(selectedIssueId);
    setSelectedIssueId(null);
  };

  const cycleStatus = async () => {
    const order = ["backlog", "todo", "in_progress", "in_review", "done"] as const;
    const idx = order.indexOf(issue.status);
    const next = order[(idx + 1) % order.length];
    await updateIssue(selectedIssueId, { status: next });
    updateStore(selectedIssueId, { status: next });
    setIssue({ ...issue, status: next });
  };

  const cyclePriority = async () => {
    const next = ((issue.priority + 1) % 5) as typeof issue.priority;
    await updateIssue(selectedIssueId, { priority: next });
    updateStore(selectedIssueId, { priority: next });
    setIssue({ ...issue, priority: next });
  };

  const setProject = async (pid: string | null) => {
    await updateIssue(selectedIssueId, { projectId: pid });
    updateStore(selectedIssueId, { projectId: pid });
    setIssue({ ...issue, projectId: pid });
  };

  const setCycle = async (cid: string | null) => {
    await updateIssue(selectedIssueId, { cycleId: cid });
    updateStore(selectedIssueId, { cycleId: cid });
    setIssue({ ...issue, cycleId: cid });
  };

  const addComment = async () => {
    if (!commentBody.trim()) return;
    const comment = await createComment({ issueId: selectedIssueId, userName: "You", body: commentBody.trim() });
    setLocalComments((prev) => [...prev, comment]);
    setCommentBody("");
  };

  const removeComment = async (id: string) => {
    await deleteComment(id);
    setLocalComments((prev) => prev.filter((c) => c.id !== id));
  };

  const removeRelation = async (id: string) => {
    await deleteIssueRelation(id);
    setLocalRelations((prev) => prev.filter((r) => r.id !== id));
  };

  const project = projects.find((p) => p.id === issue.projectId);
  const cycle = cycles.find((c) => c.id === issue.cycleId);
  const parentIssue = issue.parentId ? issues.find((i) => i.id === issue.parentId) : undefined;

  return (
    <div ref={panelRef} className="w-[28rem] bg-hit-surface border-l border-hit-border flex flex-col animate-fadeIn shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-hit-border shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-hit-muted"><span>{issue.identifier}</span>{parentIssue && <span className="text-hit-accent">of {parentIssue.identifier}</span>}</div>
        <div className="flex items-center gap-1">
          <button onClick={handleSave} className="p-1.5 rounded-md hover:bg-hit-elevated text-hit-muted hover:text-hit-text transition-colors" title="Save changes"><Save className="w-4 h-4" /></button>
          <button onClick={handleDelete} className="p-1.5 rounded-md hover:bg-red-500/10 text-hit-muted hover:text-red-400 transition-colors" title="Delete issue"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => setSelectedIssueId(null)} className="p-1.5 rounded-md hover:bg-hit-elevated text-hit-muted hover:text-hit-text transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>

      <div ref={contentRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        <div><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-lg font-semibold text-hit-text outline-none placeholder-hit-muted" /></div>

        <div className="flex flex-wrap gap-2">
          <button onClick={cycleStatus} className="px-2.5 py-1 rounded-md bg-hit-elevated border border-hit-border text-xs text-hit-text hover:border-hit-accent/30 transition-colors">{STATUS_LABELS[issue.status]}</button>
          <button onClick={cyclePriority} className="px-2.5 py-1 rounded-md bg-hit-elevated border border-hit-border text-xs text-hit-text hover:border-hit-accent/30 transition-colors flex items-center gap-1"><span className={PRIORITY_COLORS[issue.priority]}>{PRIORITY_ICONS[issue.priority]}</span>{PRIORITY_LABELS[issue.priority]}</button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider flex items-center justify-between">Project <button onClick={() => setProject(null)} className="text-[10px] text-hit-accent hover:underline">Clear</button></div>
          <select value={issue.projectId ?? ""} onChange={(e) => setProject(e.target.value || null)} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2 text-sm text-hit-text outline-none focus:border-hit-accent/50"><option value="">No project</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider flex items-center justify-between">Cycle <button onClick={() => setCycle(null)} className="text-[10px] text-hit-accent hover:underline">Clear</button></div>
          <select value={issue.cycleId ?? ""} onChange={(e) => setCycle(e.target.value || null)} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2 text-sm text-hit-text outline-none focus:border-hit-accent/50"><option value="">No cycle</option>{cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </div>

        <div>
          <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider mb-2">Description</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description..." rows={8} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2.5 text-sm text-hit-text placeholder-hit-muted outline-none focus:border-hit-accent/50 resize-none" />
        </div>

        {/* Sub-issues */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" /> Sub-issues ({subIssues.length})</div>
            <button onClick={() => setCreateSubIssueOpen(true)} className="text-[11px] text-hit-accent hover:underline">+ Add</button>
          </div>
          {subIssues.length === 0 ? <div className="text-xs text-hit-muted py-2">No sub-issues yet.</div> : (
            <div className="space-y-1">
              {subIssues.map((si) => (
                <button key={si.id} onClick={() => setSelectedIssueId(si.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-hit-bg border border-hit-border hover:border-hit-accent/30 text-left transition-colors">
                  <span className="text-[10px] font-mono text-hit-muted">{si.identifier}</span>
                  <span className="text-xs text-hit-text flex-1 truncate">{si.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-hit-elevated text-hit-muted">{STATUS_LABELS[si.status]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Relations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /> Relations ({relations.length})</div>
            <button onClick={() => setAddRelationOpen(true)} className="text-[11px] text-hit-accent hover:underline">+ Add</button>
          </div>
          {relations.length === 0 ? <div className="text-xs text-hit-muted py-2">No relations yet.</div> : (
            <div className="space-y-1">
              {relations.map((rel) => {
                const otherId = rel.sourceId === selectedIssueId ? rel.targetId : rel.sourceId;
                const other = issues.find((i) => i.id === otherId);
                const label = RELATION_LABELS[rel.type];
                return (
                  <div key={rel.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hit-bg border border-hit-border">
                    <span className={cn("text-[10px] font-medium", RELATION_COLORS[rel.type])}>{label}</span>
                    {other ? (
                      <button onClick={() => setSelectedIssueId(other.id)} className="text-xs text-hit-text hover:text-hit-accent transition-colors flex-1 text-left truncate">
                        {other.identifier} {other.title}
                      </button>
                    ) : <span className="text-xs text-hit-muted">Deleted issue</span>}
                    <button onClick={() => removeRelation(rel.id)} className="text-hit-muted hover:text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-hit-muted uppercase tracking-wider flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Comments ({comments.length})</div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-hit-accent flex items-center justify-center text-[10px] text-white font-bold shrink-0 mt-1"><User className="w-3 h-3" /></div>
            <div className="flex-1">
              <textarea value={commentBody} onChange={(e) => setCommentBody(e.target.value)} placeholder="Write a comment..." rows={2} className="w-full bg-hit-bg border border-hit-border rounded-lg px-3 py-2 text-xs text-hit-text placeholder-hit-muted outline-none focus:border-hit-accent/50 resize-none" />
              <div className="flex justify-end mt-1">
                <button onClick={addComment} disabled={!commentBody.trim()} className="px-3 py-1.5 rounded-md bg-hit-accent hover:bg-hit-accent-hover text-white text-[11px] font-medium transition-colors disabled:opacity-40">Comment</button>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-1">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 group">
                <div className="w-6 h-6 rounded-full bg-hit-elevated border border-hit-border flex items-center justify-center text-[10px] text-hit-muted font-bold shrink-0"><User className="w-3 h-3" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-hit-text">{comment.userName}</span>
                    <span className="text-[10px] text-hit-muted">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-hit-muted mt-0.5">{comment.body}</p>
                </div>
                <button onClick={() => removeComment(comment.id)} className="opacity-0 group-hover:opacity-100 p-1 text-hit-muted hover:text-red-400 transition-all"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-hit-muted space-y-1">
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Created: {new Date(issue.createdAt).toLocaleString()}</div>
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated: {new Date(issue.updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}