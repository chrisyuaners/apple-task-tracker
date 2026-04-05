"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DateGroupKey } from "@/lib/dates";
import { GROUP_ORDER } from "@/lib/dates";
import { groupTasksByDue, matchesFilter, newId, sortTasksForDisplay } from "@/lib/tasks";
import { loadTasks, saveTasks } from "@/lib/storage";
import type { Task, TaskFilter } from "@/lib/types";

const UNDO_MS = 8000;

export { GROUP_ORDER };
export type { DateGroupKey };

type TasksContextValue = {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;
  filteredTasks: Task[];
  groupedFiltered: Map<DateGroupKey, Task[]>;
  addTask: (input: {
    title: string;
    notes?: string;
    dueAt?: string;
    priority: Task["priority"];
  }) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  undoDelete: () => void;
  undoTask: Task | null;
  dismissUndo: () => void;
  openNewTask: () => void;
  openEditTask: (id: string) => void;
  sheetOpen: boolean;
  sheetTaskId: string | null;
  closeSheet: () => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>("today");
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTaskId, setSheetTaskId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(loadTasks());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTasks(tasks);
  }, [tasks, hydrated]);

  const clearUndoTimer = useCallback(() => {
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  }, []);

  const dismissUndo = useCallback(() => {
    clearUndoTimer();
    setUndoTask(null);
  }, [clearUndoTimer]);

  const filteredTasks = useMemo(() => {
    const f = tasks.filter((t) => matchesFilter(t, filter));
    return [...f].sort(sortTasksForDisplay);
  }, [tasks, filter]);

  const groupedFiltered = useMemo(
    () => groupTasksByDue(filteredTasks),
    [filteredTasks],
  );

  const addTask = useCallback(
    (input: {
      title: string;
      notes?: string;
      dueAt?: string;
      priority: Task["priority"];
    }) => {
      const now = new Date().toISOString();
      const task: Task = {
        id: newId(),
        title: input.title.trim(),
        notes: input.notes?.trim() || undefined,
        dueAt: input.dueAt || undefined,
        priority: input.priority,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [...prev, task]);
    },
    [],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            ...patch,
            title:
              typeof patch.title === "string"
                ? patch.title.trim()
                : t.title,
            notes:
              patch.notes !== undefined
                ? patch.notes.trim() || undefined
                : t.notes,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const deleteTask = useCallback(
    (id: string) => {
      let removed: Task | null = null;
      setTasks((prev) => {
        const found = prev.find((t) => t.id === id);
        if (!found) return prev;
        removed = found;
        return prev.filter((t) => t.id !== id);
      });
      if (removed) {
        clearUndoTimer();
        setUndoTask(removed);
        undoTimerRef.current = setTimeout(() => {
          setUndoTask(null);
          undoTimerRef.current = null;
        }, UNDO_MS);
      }
    },
    [clearUndoTimer],
  );

  const undoDelete = useCallback(() => {
    if (!undoTask) return;
    clearUndoTimer();
    const t = undoTask;
    setUndoTask(null);
    setTasks((prev) => {
      if (prev.some((x) => x.id === t.id)) return prev;
      return [...prev, t].sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      );
    });
  }, [undoTask, clearUndoTimer]);

  const openNewTask = useCallback(() => {
    setSheetTaskId(null);
    setSheetOpen(true);
  }, []);

  const openEditTask = useCallback((id: string) => {
    setSheetTaskId(id);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setSheetTaskId(null);
  }, []);

  useEffect(() => () => clearUndoTimer(), [clearUndoTimer]);

  const value = useMemo<TasksContextValue>(
    () => ({
      tasks,
      filter,
      setFilter,
      filteredTasks,
      groupedFiltered,
      addTask,
      updateTask,
      toggleComplete,
      deleteTask,
      undoDelete,
      undoTask,
      dismissUndo,
      openNewTask,
      openEditTask,
      sheetOpen,
      sheetTaskId,
      closeSheet,
    }),
    [
      tasks,
      filter,
      filteredTasks,
      groupedFiltered,
      addTask,
      updateTask,
      toggleComplete,
      deleteTask,
      undoDelete,
      undoTask,
      dismissUndo,
      openNewTask,
      openEditTask,
      sheetOpen,
      sheetTaskId,
      closeSheet,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}
