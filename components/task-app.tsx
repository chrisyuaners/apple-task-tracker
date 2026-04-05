"use client";

import { Plus } from "lucide-react";
import { useCallback } from "react";
import { useTasks } from "@/contexts/tasks-context";
import { exportTasksJson } from "@/lib/storage";
import { SegmentedControl } from "./segmented-control";
import { TaskList } from "./task-list";
import { TaskSheet } from "./task-sheet";
import { ThemeMenu } from "./theme-menu";
import { UndoToast } from "./undo-toast";

export function TaskApp() {
  const { filter, setFilter, openNewTask, tasks } = useTasks();

  const handleExport = useCallback(() => {
    const json = exportTasksJson(tasks);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  return (
    <div className="flex min-h-full flex-col">
      <header
        className="sticky top-0 z-20 shrink-0 backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
          borderBottom: "1px solid var(--separator)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="min-w-0 flex-1">
            <h1
              className="text-[34px] font-bold leading-tight tracking-tight"
              style={{ color: "var(--label)" }}
            >
              Tasks
            </h1>
          </div>
          <ThemeMenu onExportJson={handleExport} />
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <SegmentedControl value={filter} onChange={setFilter} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-2">
        <TaskList />
      </main>

      <button
        type="button"
        onClick={openNewTask}
        className="motion-safe-transition fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{
          background: "var(--accent)",
          boxShadow: "0 8px 24px color-mix(in srgb, var(--accent) 45%, transparent)",
        }}
        aria-label="New task"
      >
        <Plus className="h-7 w-7" strokeWidth={2} />
      </button>

      <TaskSheet />
      <UndoToast />
    </div>
  );
}
