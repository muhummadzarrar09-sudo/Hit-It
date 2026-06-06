import Dexie, { type Table } from "dexie";
import type { Issue, Project, Cycle, Comment, IssueRelation, SavedView } from "@/types";

export class HitItDB extends Dexie {
  issues!: Table<Issue>;
  projects!: Table<Project>;
  cycles!: Table<Cycle>;
  comments!: Table<Comment>;
  issueRelations!: Table<IssueRelation>;
  savedViews!: Table<SavedView>;

  constructor() {
    super("HitItDB");
    this.version(3).stores({
      issues: "++id, identifier, status, priority, projectId, cycleId, parentId, createdAt, updatedAt",
      projects: "++id, status, createdAt, updatedAt",
      cycles: "++id, status, startDate, endDate, createdAt",
      comments: "++id, issueId, createdAt",
      issueRelations: "++id, sourceId, targetId, type, createdAt",
      savedViews: "++id, name, createdAt",
    });
  }
}

export const db = new HitItDB();

let _issueCounter = 0;
async function getNextIssueIdentifier(): Promise<string> {
  const count = await db.issues.count();
  _issueCounter = Math.max(_issueCounter, count + 1);
  return `HIT-${_issueCounter}`;
}

export async function createIssue(
  data: Omit<Issue, "id" | "identifier" | "createdAt" | "updatedAt">
): Promise<Issue> {
  const now = Date.now();
  const identifier = await getNextIssueIdentifier();
  const issue: Issue = {
    ...data,
    id: crypto.randomUUID(),
    identifier,
    createdAt: now,
    updatedAt: now,
  };
  await db.issues.add(issue);
  return issue;
}

export async function updateIssue(
  id: string,
  changes: Partial<Omit<Issue, "id" | "identifier" | "createdAt">>
): Promise<void> {
  await db.issues.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteIssue(id: string): Promise<void> {
  await db.issues.delete(id);
  await db.issues.where("parentId").equals(id).modify({ parentId: null });
  await db.issueRelations.where("sourceId").equals(id).delete();
  await db.issueRelations.where("targetId").equals(id).delete();
  await db.comments.where("issueId").equals(id).delete();
}

export async function getAllIssues(): Promise<Issue[]> {
  return db.issues.toArray();
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  return db.issues.get(id);
}

export async function getSubIssues(parentId: string): Promise<Issue[]> {
  return db.issues.where("parentId").equals(parentId).toArray();
}

export async function getIssuesByProject(projectId: string): Promise<Issue[]> {
  return db.issues.where("projectId").equals(projectId).toArray();
}

export async function getIssuesByCycle(cycleId: string): Promise<Issue[]> {
  return db.issues.where("cycleId").equals(cycleId).toArray();
}

export async function getIncompleteIssuesByCycle(cycleId: string): Promise<Issue[]> {
  return db.issues.where({ cycleId }).and((i) => i.status !== "done").toArray();
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const now = Date.now();
  const project: Project = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
  await db.projects.add(project);
  return project;
}

export async function updateProject(
  id: string,
  changes: Partial<Omit<Project, "id" | "createdAt">>
): Promise<void> {
  await db.projects.update(id, { ...changes, updatedAt: Date.now() });
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
  await db.issues.where("projectId").equals(id).modify({ projectId: null });
}

export async function getAllProjects(): Promise<Project[]> {
  return db.projects.toArray();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function createCycle(
  data: Omit<Cycle, "id" | "createdAt">
): Promise<Cycle> {
  const cycle: Cycle = { ...data, id: crypto.randomUUID(), createdAt: Date.now() };
  await db.cycles.add(cycle);
  return cycle;
}

export async function updateCycle(
  id: string,
  changes: Partial<Omit<Cycle, "id" | "createdAt">>
): Promise<void> {
  await db.cycles.update(id, changes);
}

export async function deleteCycle(id: string): Promise<void> {
  await db.cycles.delete(id);
  await db.issues.where("cycleId").equals(id).modify({ cycleId: null });
}

export async function getAllCycles(): Promise<Cycle[]> {
  return db.cycles.toArray();
}

export async function getCycleById(id: string): Promise<Cycle | undefined> {
  return db.cycles.get(id);
}

export async function rolloverIncompleteIssues(fromCycleId: string, toCycleId: string): Promise<number> {
  const incomplete = await getIncompleteIssuesByCycle(fromCycleId);
  for (const issue of incomplete) {
    await db.issues.update(issue.id, { cycleId: toCycleId, updatedAt: Date.now() });
  }
  return incomplete.length;
}

export async function createComment(
  data: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  const comment: Comment = { ...data, id: crypto.randomUUID(), createdAt: Date.now() };
  await db.comments.add(comment);
  return comment;
}

export async function getCommentsByIssue(issueId: string): Promise<Comment[]> {
  return db.comments.where("issueId").equals(issueId).sortBy("createdAt");
}

export async function deleteComment(id: string): Promise<void> {
  await db.comments.delete(id);
}

export async function createIssueRelation(
  data: Omit<IssueRelation, "id" | "createdAt">
): Promise<IssueRelation> {
  const relation: IssueRelation = { ...data, id: crypto.randomUUID(), createdAt: Date.now() };
  await db.issueRelations.add(relation);
  return relation;
}

export async function deleteIssueRelation(id: string): Promise<void> {
  await db.issueRelations.delete(id);
}

export async function getRelationsForIssue(issueId: string): Promise<IssueRelation[]> {
  const source = await db.issueRelations.where("sourceId").equals(issueId).toArray();
  const target = await db.issueRelations.where("targetId").equals(issueId).toArray();
  return [...source, ...target];
}

export async function createSavedView(
  data: Omit<SavedView, "id" | "createdAt">
): Promise<SavedView> {
  const view: SavedView = { ...data, id: crypto.randomUUID(), createdAt: Date.now() };
  await db.savedViews.add(view);
  return view;
}

export async function deleteSavedView(id: string): Promise<void> {
  await db.savedViews.delete(id);
}

export async function getAllSavedViews(): Promise<SavedView[]> {
  return db.savedViews.toArray();
}