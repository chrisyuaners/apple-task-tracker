"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { useTasks } from "@/contexts/tasks-context";
import type { Priority, Task } from "@/lib/types";

const PRIORITIES: { id: Priority; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

function emptyForm(): {
  title: string;
  notes: string;
  dueAt: string;
  priority: Priority;
} {
  return { title: "", notes: "", dueAt: "", priority: "medium" };
}

function taskToForm(t: Task) {
  return {
    title: t.title,
    notes: t.notes ?? "",
    dueAt: t.dueAt ?? "",
    priority: t.priority,
  };
}

export function TaskSheet() {
  const {
    sheetOpen,
    sheetTaskId,
    closeSheet,
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const editing = useMemo(
    () => (sheetTaskId ? tasks.find((t) => t.id === sheetTaskId) : null),
    [sheetTaskId, tasks],
  );

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sheetOpen) return;
    /* eslint-disable react-hooks/set-state-in-effect -- reset form when sheet opens or task changes */
    setError(null);
    if (editing) setForm(taskToForm(editing));
    else setForm(emptyForm());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [sheetOpen, editing, sheetTaskId]);

  const title = editing ? "Edit task" : "New task";

  const handleSave = () => {
    const t = form.title.trim();
    if (!t) {
      setError("Title is required.");
      return;
    }
    if (editing) {
      updateTask(editing.id, {
        title: t,
        notes: form.notes,
        dueAt: form.dueAt || undefined,
        priority: form.priority,
      });
    } else {
      addTask({
        title: t,
        notes: form.notes,
        dueAt: form.dueAt || undefined,
        priority: form.priority,
      });
    }
    closeSheet();
  };

  const handleDelete = () => {
    if (!editing) return;
    deleteTask(editing.id);
    closeSheet();
  };

  const fieldClass =
    "input-surface mt-2 w-full rounded-[var(--radius-input)] border-none px-3.5 py-3 text-[17px] leading-snug tracking-[-0.01em] outline-none transition-shadow duration-200 placeholder:text-[var(--tertiary-label)]";

  const fieldStyle = {
    background: "var(--bg-grouped-secondary)",
    color: "var(--label)",
    boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--separator) 80%, transparent)",
  } as const;

  return (
    <Dialog.Root open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] backdrop-blur-[8px] transition-opacity duration-200 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
          style={{ background: "var(--overlay)" }}
        />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 z-[101] flex max-h-[min(92dvh,820px)] w-full flex-col rounded-t-[var(--radius-sheet)] shadow-[var(--shadow-sheet)] outline-none transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:opacity-0 data-[state=open]:opacity-100 max-md:data-[state=closed]:translate-y-full max-md:data-[state=open]:translate-y-0 md:bottom-auto md:left-1/2 md:top-1/2 md:max-w-[min(100%-2rem,440px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-row)] md:shadow-[var(--shadow-modal)]"
          style={{
            background: "var(--bg-elevated)",
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="flex shrink-0 flex-col border-b pt-2 md:rounded-t-[var(--radius-row)] md:pt-3"
            style={{
              borderColor:
                "color-mix(in srgb, var(--separator) 65%, transparent)",
            }}
          >
            <div
              className="mx-auto mb-2.5 h-[5px] w-9 rounded-full md:hidden"
              style={{ background: "var(--sheet-handle)" }}
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2 px-4 pb-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="motion-safe-transition min-h-[44px] min-w-[56px] rounded-lg px-2 text-left text-[17px] font-normal tracking-[-0.01em] active:opacity-60 md:hover:opacity-80"
                  style={{ color: "var(--accent)" }}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Title
                className="pointer-events-none flex-1 text-center text-[17px] font-semibold leading-tight tracking-[-0.02em]"
                style={{ color: "var(--label)" }}
              >
                {title}
              </Dialog.Title>
              <button
                type="button"
                onClick={handleSave}
                className="motion-safe-transition min-h-[44px] min-w-[56px] rounded-lg px-2 text-right text-[17px] font-semibold tracking-[-0.01em] active:opacity-60 md:hover:opacity-90"
                style={{ color: "var(--accent)" }}
              >
                Save
              </button>
            </div>
            <Dialog.Description className="sr-only">
              {editing
                ? "Edit title, notes, due date, or priority."
                : "Enter title, notes, optional due date, and priority."}
            </Dialog.Description>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-1">
            <label className="sr-only" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              autoFocus
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-2 w-full border-none bg-transparent text-[28px] font-bold leading-[1.15] tracking-[-0.035em] outline-none placeholder:text-[var(--tertiary-label)] focus-visible:ring-0"
              style={{ color: "var(--label)" }}
            />
            {error ? (
              <p
                className="mt-2 text-[15px] leading-snug tracking-[-0.01em]"
                style={{ color: "var(--danger)" }}
              >
                {error}
              </p>
            ) : null}

            <label
              className="mt-7 block text-[13px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--secondary-label)" }}
              htmlFor="task-notes"
            >
              Notes
            </label>
            <textarea
              id="task-notes"
              rows={4}
              placeholder="Add notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className={fieldClass}
              style={fieldStyle}
            />

            <label
              className="mt-6 block text-[13px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--secondary-label)" }}
              htmlFor="task-due"
            >
              Due date
            </label>
            <input
              id="task-due"
              type="date"
              value={form.dueAt}
              onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))}
              className={`${fieldClass} min-h-[48px] py-2.5 [color-scheme:light_dark]`}
              style={fieldStyle}
            />

            <p
              className="mt-6 text-[13px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--secondary-label)" }}
            >
              Priority
            </p>
            <div
              className="mt-2 inline-flex rounded-[10px] p-[3px]"
              style={{
                background: "var(--bg-grouped-secondary)",
                boxShadow:
                  "inset 0 1px 2px rgba(0,0,0,0.04), inset 0 0 0 1px color-mix(in srgb, var(--separator) 75%, transparent)",
              }}
              role="group"
              aria-label="Priority"
            >
              {PRIORITIES.map((p) => {
                const sel = form.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p.id }))}
                    className="motion-safe-transition min-h-[42px] rounded-[8px] px-4 text-[15px] font-medium tracking-[-0.01em] active:scale-[0.98]"
                    style={{
                      color: sel ? "var(--label)" : "var(--secondary-label)",
                      background: sel ? "var(--bg-elevated)" : "transparent",
                      boxShadow: sel
                        ? "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "none",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {editing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="motion-safe-transition mt-10 w-full rounded-[var(--radius-input)] py-3.5 text-[17px] font-semibold tracking-[-0.01em] active:opacity-75 md:hover:bg-[var(--fill-quaternary)]"
                style={{
                  color: "var(--danger)",
                  background: "var(--bg-grouped-secondary)",
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in srgb, var(--danger) 35%, var(--separator))",
                }}
              >
                Delete task
              </button>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
