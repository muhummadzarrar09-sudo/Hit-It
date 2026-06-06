import { create } from "zustand";
import type { Issue, Project, Cycle, Comment, IssueRelation, SavedView, MainView, IssueViewMode } from "@/types";

interface AppState {
  issues: Issue[];
  projects: Project[];
  cycles: Cycle[];
  comments: Comment[];
  issueRelations: IssueRelation[];
  savedViews: SavedView[];

  mainView: MainView;
  issueViewMode: IssueViewMode;
  selectedIssueId: string | null;
  selectedProjectId: string | null;
  selectedCycleId: string | null;

  searchQuery: string;
  statusFilter: string | null;
  projectFilter: string | null;
  cycleFilter: string | null;
  priorityFilter: number | null;

  commandOpen: boolean;
  createIssueOpen: boolean;
  createProjectOpen: boolean;
  createCycleOpen: boolean;
  createSubIssueOpen: boolean;
  addRelationOpen: boolean;
  saveViewOpen: boolean;
  triageOpen: boolean;

  isLoaded: boolean;

  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, changes: Partial<Issue>) => void;
  removeIssue: (id: string) => void;

  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, changes: Partial<Project>) => void;
  removeProject: (id: string) => void;

  setCycles: (cycles: Cycle[]) => void;
  addCycle: (cycle: Cycle) => void;
  updateCycle: (id: string, changes: Partial<Cycle>) => void;
  removeCycle: (id: string) => void;

  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  removeComment: (id: string) => void;

  setIssueRelations: (relations: IssueRelation[]) => void;
  addIssueRelation: (relation: IssueRelation) => void;
  removeIssueRelation: (id: string) => void;

  setSavedViews: (views: SavedView[]) => void;
  addSavedView: (view: SavedView) => void;
  removeSavedView: (id: string) => void;
  deleteSavedView: (id: string) => Promise<void>;

  setMainView: (view: MainView) => void;
  setIssueViewMode: (mode: IssueViewMode) => void;
  setSelectedIssueId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedCycleId: (id: string | null) => void;

  setSearchQuery: (q: string) => void;
  setStatusFilter: (status: string | null) => void;
  setProjectFilter: (id: string | null) => void;
  setCycleFilter: (id: string | null) => void;
  setPriorityFilter: (p: number | null) => void;
  clearAllFilters: () => void;

  setCommandOpen: (open: boolean) => void;
  setCreateIssueOpen: (open: boolean) => void;
  setCreateProjectOpen: (open: boolean) => void;
  setCreateCycleOpen: (open: boolean) => void;
  setCreateSubIssueOpen: (open: boolean) => void;
  setAddRelationOpen: (open: boolean) => void;
  setSaveViewOpen: (open: boolean) => void;
  setTriageOpen: (open: boolean) => void;
  setIsLoaded: (loaded: boolean) => void;

  filteredIssues: () => Issue[];
  activeFiltersCount: () => number;
}

export const useStore = create<AppState>((set, get) => ({
  issues: [],
  projects: [],
  cycles: [],
  comments: [],
  issueRelations: [],
  savedViews: [],

  mainView: "issues",
  issueViewMode: "list",
  selectedIssueId: null,
  selectedProjectId: null,
  selectedCycleId: null,

  searchQuery: "",
  statusFilter: null,
  projectFilter: null,
  cycleFilter: null,
  priorityFilter: null,

  commandOpen: false,
  createIssueOpen: false,
  createProjectOpen: false,
  createCycleOpen: false,
  createSubIssueOpen: false,
  addRelationOpen: false,
  saveViewOpen: false,
  triageOpen: false,

  isLoaded: false,

  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((s) => ({ issues: [issue, ...s.issues] })),
  updateIssue: (id, changes) =>
    set((s) => ({
      issues: s.issues.map((i) => (i.id === id ? { ...i, ...changes } : i)),
    })),
  removeIssue: (id) =>
    set((s) => ({
      issues: s.issues.filter((i) => i.id !== id),
      comments: s.comments.filter((c) => c.issueId !== id),
      issueRelations: s.issueRelations.filter(
        (r) => r.sourceId !== id && r.targetId !== id
      ),
    })),

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
  updateProject: (id, changes) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  setCycles: (cycles) => set({ cycles }),
  addCycle: (cycle) => set((s) => ({ cycles: [cycle, ...s.cycles] })),
  updateCycle: (id, changes) =>
    set((s) => ({
      cycles: s.cycles.map((c) => (c.id === id ? { ...c, ...changes } : c)),
    })),
  removeCycle: (id) =>
    set((s) => ({ cycles: s.cycles.filter((c) => c.id !== id) })),

  setComments: (comments) => set({ comments }),
  addComment: (comment) => set((s) => ({ comments: [...s.comments, comment] })),
  removeComment: (id) =>
    set((s) => ({ comments: s.comments.filter((c) => c.id !== id) })),

  setIssueRelations: (relations) => set({ issueRelations: relations }),
  addIssueRelation: (relation) =>
    set((s) => ({ issueRelations: [...s.issueRelations, relation] })),
  removeIssueRelation: (id) =>
    set((s) => ({ issueRelations: s.issueRelations.filter((r) => r.id !== id) })),

  setSavedViews: (views) => set({ savedViews: views }),
  addSavedView: (view) => set((s) => ({ savedViews: [...s.savedViews, view] })),
  removeSavedView: (id) =>
    set((s) => ({ savedViews: s.savedViews.filter((v) => v.id !== id) })),
  deleteSavedView: async (id) => {
    await import("@/lib/db").then((m) => m.deleteSavedView(id));
    set((s) => ({ savedViews: s.savedViews.filter((v) => v.id !== id) }));
  },

  setMainView: (view) => set({ mainView: view }),
  setIssueViewMode: (mode) => set({ issueViewMode: mode }),
  setSelectedIssueId: (id) => set({ selectedIssueId: id }),
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedCycleId: (id) => set({ selectedCycleId: id }),

  setSearchQuery: (q) => set({ searchQuery: q }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setProjectFilter: (id) => set({ projectFilter: id }),
  setCycleFilter: (id) => set({ cycleFilter: id }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),
  clearAllFilters: () =>
    set({
      searchQuery: "",
      statusFilter: null,
      projectFilter: null,
      cycleFilter: null,
      priorityFilter: null,
    }),

  setCommandOpen: (open) => set({ commandOpen: open }),
  setCreateIssueOpen: (open) => set({ createIssueOpen: open }),
  setCreateProjectOpen: (open) => set({ createProjectOpen: open }),
  setCreateCycleOpen: (open) => set({ createCycleOpen: open }),
  setCreateSubIssueOpen: (open) => set({ createSubIssueOpen: open }),
  setAddRelationOpen: (open) => set({ addRelationOpen: open }),
  setSaveViewOpen: (open) => set({ saveViewOpen: open }),
  setTriageOpen: (open) => set({ triageOpen: open }),
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),

  filteredIssues: () => {
    const {
      issues,
      searchQuery,
      statusFilter,
      projectFilter,
      cycleFilter,
      priorityFilter,
      selectedProjectId,
      selectedCycleId,
      mainView,
    } = get();

    let filtered = issues;

    if (mainView === "triage") {
      filtered = filtered.filter((i) => i.status === "backlog" && !i.cycleId);
    }

    if (selectedProjectId) {
      filtered = filtered.filter((i) => i.projectId === selectedProjectId);
    }
    if (selectedCycleId) {
      filtered = filtered.filter((i) => i.cycleId === selectedCycleId);
    }

    return filtered.filter((issue) => {
      const matchesSearch = searchQuery
        ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.identifier.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesStatus = statusFilter ? issue.status === statusFilter : true;
      const matchesProject = projectFilter ? issue.projectId === projectFilter : true;
      const matchesCycle = cycleFilter ? issue.cycleId === cycleFilter : true;
      const matchesPriority = priorityFilter !== null ? issue.priority === priorityFilter : true;
      return matchesSearch && matchesStatus && matchesProject && matchesCycle && matchesPriority;
    });
  },

  activeFiltersCount: () => {
    const { statusFilter, projectFilter, cycleFilter, priorityFilter } = get();
    return [statusFilter, projectFilter, cycleFilter, priorityFilter].filter(Boolean).length;
  },
}));