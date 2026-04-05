import {
  GROUP_ORDER,
  groupKeyForDueDate,
  isDueToday,
  isUpcomingDue,
  type DateGroupKey,
} from "./dates";
import type { Task, TaskFilter } from "./types";

export function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createTask(partial: {
  title: string;
  notes?: string;
  dueAt?: string;
  priority: Task["priority"];
}): Task {
  const now = new Date().toISOString();
  return {
    id: newId(),
    title: partial.title.trim(),
    notes: partial.notes?.trim() || undefined,
    dueAt: partial.dueAt || undefined,
    priority: partial.priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function matchesFilter(task: Task, filter: TaskFilter): boolean {
  if (filter === "all") return true;
  if (task.completed) return false;
  if (filter === "today") return isDueToday(task.dueAt);
  if (filter === "upcoming") return isUpcomingDue(task.dueAt);
  return true;
}

export function sortTasksForDisplay(a: Task, b: Task): number {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  const ad = a.dueAt ?? "\uffff";
  const bd = b.dueAt ?? "\uffff";
  if (ad !== bd) return ad.localeCompare(bd);
  const pr: Record<Task["priority"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  if (pr[a.priority] !== pr[b.priority]) {
    return pr[a.priority] - pr[b.priority];
  }
  return b.updatedAt.localeCompare(a.updatedAt);
}

export function groupTasksByDue(
  tasks: Task[],
): Map<DateGroupKey, Task[]> {
  const map = new Map<DateGroupKey, Task[]>();
  for (const key of GROUP_ORDER) map.set(key, []);
  for (const t of tasks) {
    const key = groupKeyForDueDate(t.dueAt);
    map.get(key)!.push(t);
  }
  for (const list of map.values()) {
    list.sort(sortTasksForDisplay);
  }
  return map;
}
