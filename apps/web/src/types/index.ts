export type IssueStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type IssuePriority = 0 | 1 | 2 | 3 | 4;

export type ProjectStatus = "planned" | "in_progress" | "paused" | "completed" | "canceled";
export type CycleStatus = "active" | "upcoming" | "completed";

export type RelationType = "blocks" | "blocked_by" | "related" | "duplicates" | "duplicate_of";

export type MainView = "issues" | "projects" | "cycles" | "roadmap" | "triage";
export type IssueViewMode = "list" | "board";

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  projectId: string | null;
  cycleId: string | null;
  parentId?: string | null;
  labels: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: number | null;
  targetDate: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Cycle {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  status: CycleStatus;
  createdAt: number;
}

export interface Comment {
  id: string;
  issueId: string;
  userName: string;
  body: string;
  createdAt: number;
}

export interface IssueRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  createdAt: number;
}

export interface SavedView {
  id: string;
  name: string;
  filters: {
    status: IssueStatus | null;
    projectId: string | null;
    cycleId: string | null;
    priority: IssuePriority | null;
  };
  sortBy: "created" | "updated" | "priority";
  sortOrder: "asc" | "desc";
  viewMode: IssueViewMode;
  createdAt: number;
}

export const STATUS_LABELS: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  paused: "Paused",
  completed: "Completed",
  canceled: "Canceled",
};

export const CYCLE_STATUS_LABELS: Record<CycleStatus, string> = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Completed",
};

export const RELATION_LABELS: Record<RelationType, string> = {
  blocks: "Blocks",
  blocked_by: "Blocked by",
  related: "Related to",
  duplicates: "Duplicates",
  duplicate_of: "Duplicate of",
};

export const STATUS_COLORS: Record<IssueStatus, string> = {
  backlog: "bg-hit-muted/30 text-hit-muted border-hit-border",
  todo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  in_progress: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  in_review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  planned: "bg-hit-muted/30 text-hit-muted",
  in_progress: "bg-amber-500/10 text-amber-400",
  paused: "bg-orange-500/10 text-orange-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  canceled: "bg-red-500/10 text-red-400",
};

export const RELATION_COLORS: Record<RelationType, string> = {
  blocks: "text-red-400",
  blocked_by: "text-orange-400",
  related: "text-blue-400",
  duplicates: "text-hit-muted",
  duplicate_of: "text-hit-muted",
};

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  0: "No priority",
  1: "Urgent",
  2: "High",
  3: "Medium",
  4: "Low",
};

export const PRIORITY_ICONS: Record<IssuePriority, string> = {
  0: "−",
  1: "↟",
  2: "↑",
  3: "→",
  4: "↓",
};

export const PRIORITY_COLORS: Record<IssuePriority, string> = {
  0: "text-hit-muted",
  1: "text-red-400",
  2: "text-orange-400",
  3: "text-yellow-400",
  4: "text-blue-400",
};