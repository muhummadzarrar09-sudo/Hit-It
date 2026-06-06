"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  getAllIssues,
  getAllProjects,
  getAllCycles,
  getAllSavedViews,
  getCommentsByIssue,
  getRelationsForIssue,
} from "@/lib/db";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "./command-palette";
import { CreateIssueModal } from "./create-issue-modal";
import { CreateProjectModal } from "./create-project-modal";
import { CreateCycleModal } from "./create-cycle-modal";
import { CreateSubIssueModal } from "./create-sub-issue-modal";
import { AddRelationModal } from "./add-relation-modal";
import { SaveViewModal } from "./save-view-modal";
import { ListView } from "./list-view";
import { BoardView } from "./board-view";
import { TriageView } from "./triage-view";
import { ProjectView } from "./project-view";
import { CycleView } from "./cycle-view";
import { RoadmapView } from "./roadmap-view";
import { IssueDetail } from "./issue-detail";
import { OfflineIndicator } from "./offline-indicator";

export function AppShell() {
  const {
    mainView,
    issueViewMode,
    selectedIssueId,
    setIssues,
    setProjects,
    setCycles,
    setSavedViews,
    setComments,
    setIssueRelations,
    setIsLoaded,
  } = useStore();

  useKeyboardShortcuts();

  useEffect(() => {
    Promise.all([
      getAllIssues(),
      getAllProjects(),
      getAllCycles(),
      getAllSavedViews(),
    ]).then(([issues, projects, cycles, views]) => {
      setIssues(issues.sort((a, b) => b.updatedAt - a.updatedAt));
      setProjects(projects.sort((a, b) => b.updatedAt - a.updatedAt));
      const cycleOrder = (s: typeof cycles[number]["status"]) =>
        s === "active" ? 0 : s === "upcoming" ? 1 : 2;
      setCycles(cycles.sort((a, b) => cycleOrder(a.status) - cycleOrder(b.status)));
      setSavedViews(views.sort((a, b) => b.createdAt - a.createdAt));
      setIsLoaded(true);
    });
  }, [setIssues, setProjects, setCycles, setSavedViews, setIsLoaded]);

  // Load comments and relations when opening issue detail
  useEffect(() => {
    if (!selectedIssueId) {
      setComments([]);
      setIssueRelations([]);
      return;
    }
    Promise.all([
      getCommentsByIssue(selectedIssueId),
      getRelationsForIssue(selectedIssueId),
    ]).then(([comments, relations]) => {
      setComments(comments);
      setIssueRelations(relations);
    });
  }, [selectedIssueId, setComments, setIssueRelations]);

  return (
    <div className="flex h-full w-full min-w-0 overflow-hidden bg-hit-bg">
      <OfflineIndicator />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-hit-border flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-3 text-sm text-hit-muted">
            <span className="font-medium text-hit-text capitalize">
              {mainView === "triage" ? "Triage Inbox" : mainView}
            </span>
          </div>
          <div className="flex items-center gap-2 text-hit-muted text-xs">
            <kbd className="px-1.5 py-0.5 bg-hit-elevated border border-hit-border rounded text-[10px]">⌘K</kbd>
            <span>Command</span>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 bg-hit-elevated border border-hit-border rounded text-[10px]">C</kbd>
            <span>Issue</span>
          </div>
        </header>
        <div className="flex-1 flex min-h-0">
          {mainView === "issues" && (
            <>{issueViewMode === "list" ? <ListView /> : <BoardView />}</>
          )}
          {mainView === "triage" && <TriageView />}
          {mainView === "projects" && <ProjectView />}
          {mainView === "cycles" && <CycleView />}
          {mainView === "roadmap" && <RoadmapView />}
          {selectedIssueId && <IssueDetail />}
        </div>
      </main>
    </div>
  );
}