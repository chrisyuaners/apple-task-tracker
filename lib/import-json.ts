import { newId } from "./tasks";
import type { Priority, Task } from "./types";

const YMD = /^\d{4}-\d{2}-\d{2}$/;

function parsePriority(p: unknown): Priority {
  if (p === "low" || p === "medium" || p === "high") return p;
  return "medium";
}

function normalizeDueAt(v: unknown): string | undefined {
  if (typeof v !== "string" || !v.trim()) return undefined;
  const s = v.trim();
  if (!YMD.test(s)) return undefined;
  return s;
}

function normalizeTask(raw: unknown, seenIds: Set<string>): Task | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  if (!title) return null;

  let id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : newId();
  if (seenIds.has(id)) id = newId();
  seenIds.add(id);

  const priority = parsePriority(o.priority);
  const completed = Boolean(o.completed);
  const now = new Date().toISOString();
  const createdAt = typeof o.createdAt === "string" ? o.createdAt : now;
  const updatedAt = typeof o.updatedAt === "string" ? o.updatedAt : now;

  let completedAt: string | undefined;
  if (completed) {
    completedAt =
      typeof o.completedAt === "string" ? o.completedAt : now;
  }

  const notes =
    typeof o.notes === "string" && o.notes.trim() ? o.notes.trim() : undefined;
  const dueAt = normalizeDueAt(o.dueAt);

  return {
    id,
    title,
    notes,
    dueAt,
    priority,
    completed,
    completedAt,
    createdAt,
    updatedAt,
  };
}

export type ImportResult =
  | { ok: true; tasks: Task[] }
  | { ok: false; error: string };

/**
 * Parses exported task JSON: a top-level array, or `{ "tasks": [...] }`.
 * Each object must include a non-empty title; missing fields get sensible defaults.
 */
export function parseTasksImportJson(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file is not valid JSON." };
  }

  let arr: unknown[];
  if (Array.isArray(data)) {
    arr = data;
  } else if (
    data !== null &&
    typeof data === "object" &&
    Array.isArray((data as { tasks?: unknown }).tasks)
  ) {
    arr = (data as { tasks: unknown[] }).tasks;
  } else {
    return {
      ok: false,
      error:
        'Expected a JSON array of tasks, or an object with a "tasks" array.',
    };
  }

  const seen = new Set<string>();
  const tasks: Task[] = [];
  for (let i = 0; i < arr.length; i++) {
    const t = normalizeTask(arr[i], seen);
    if (!t) {
      return {
        ok: false,
        error: `Invalid task at index ${i}: each item must be an object with a non-empty "title".`,
      };
    }
    tasks.push(t);
  }

  return { ok: true, tasks };
}
