"use client";

import { useTasks } from "@/contexts/tasks-context";

export function UndoToast() {
  const { undoTask, undoDelete } = useTasks();

  if (!undoTask) return null;

  return (
    <div
      className="motion-safe-transition fixed bottom-6 left-1/2 z-[150] flex w-[min(100%-2rem,400px)] -translate-x-1/2 items-center gap-3 rounded-[14px] px-4 py-3 shadow-lg"
      style={{
        background: "var(--bg-elevated)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.2), 0 0 0 1px var(--separator)",
      }}
      role="status"
      aria-live="polite"
    >
      <p
        className="min-w-0 flex-1 text-[15px] leading-snug"
        style={{ color: "var(--label)" }}
      >
        Task deleted
      </p>
      <button
        type="button"
        onClick={undoDelete}
        className="shrink-0 text-[17px] font-semibold"
        style={{ color: "var(--accent)" }}
      >
        Undo
      </button>
    </div>
  );
}
