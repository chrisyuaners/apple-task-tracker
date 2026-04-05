import type { Task } from "./types";

const STORAGE_KEY = "apple-task-tracker-tasks-v1";

export function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTaskShape) as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* quota or private mode */
  }
}

function isTaskShape(x: unknown): x is Task {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.priority === "string" &&
    typeof o.completed === "boolean" &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string"
  );
}

export function exportTasksJson(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}
