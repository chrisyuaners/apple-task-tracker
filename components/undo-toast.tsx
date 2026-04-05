"use client";

import { useTasks } from "@/contexts/tasks-context";

export function UndoToast() {
  const { undoTask, undoDelete } = useTasks();

  if (!undoTask) return null;

  return (
    <div
      className="motion-safe-transition fixed left-1/2 z-[45] flex w-[min(100%-2rem,380px)] -translate-x-1/2 items-center gap-3 rounded-[14px] px-4 py-3.5 backdrop-blur-xl"
      style={{
        bottom:
          "max(5.75rem, calc(env(safe-area-inset-bottom, 0px) + 4.75rem))",
        background: "color-mix(in srgb, var(--bg-elevated) 94%, transparent)",
        boxShadow:
          "var(--shadow-md), inset 0 0 0 1px color-mix(in srgb, var(--separator) 75%, transparent)",
      }}
      role="status"
      aria-live="polite"
    >
      <p
        className="min-w-0 flex-1 text-[15px] leading-snug tracking-[-0.01em]"
        style={{ color: "var(--label)" }}
      >
        Task deleted
      </p>
      <button
        type="button"
        onClick={undoDelete}
        className="shrink-0 rounded-lg px-1 py-1 text-[17px] font-semibold tracking-[-0.02em] active:opacity-60"
        style={{ color: "var(--accent)" }}
      >
        Undo
      </button>
    </div>
  );
}
