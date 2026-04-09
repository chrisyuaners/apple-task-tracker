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
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-20 shrink-0 backdrop-blur-xl backdrop-saturate-[180]"
        style={{
          background: "var(--header-blur-bg)",
          borderBottom:
            "0.5px solid color-mix(in srgb, var(--separator) 85%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
          <div className="min-w-0 flex-1 pb-0.5">
            <h1
              className="text-[34px] font-bold leading-[1.05] tracking-[-0.04em]"
              style={{ color: "var(--label)" }}
            >
              Tasks
            </h1>
          </div>
          <ThemeMenu onExportJson={handleExport} />
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3 pt-1">
          <SegmentedControl value={filter} onChange={setFilter} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-3">
        <TaskList />
      </main>

      <button
        type="button"
        onClick={openNewTask}
        className="motion-safe-transition fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-full text-white motion-safe-press active:scale-[0.92] active:opacity-90 md:hover:opacity-95"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 92%, white) 0%, var(--accent) 100%)",
          boxShadow: "var(--shadow-fab)",
        }}
        aria-label="New task"
      >
        <Plus className="h-7 w-7" strokeWidth={2.25} />
      </button>

      <TaskSheet />
      <UndoToast />
    </div>
  );
}
