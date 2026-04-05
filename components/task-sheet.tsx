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
    setError(null);
    if (editing) setForm(taskToForm(editing));
    else setForm(emptyForm());
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

  return (
    <Dialog.Root open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] transition-opacity duration-200 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
          style={{ background: "var(--overlay)" }}
        />
        <Dialog.Content
          className="fixed bottom-0 left-0 right-0 z-[101] flex max-h-[min(92vh,840px)] w-full flex-col rounded-t-[var(--radius-sheet)] outline-none transition-[opacity,transform] duration-300 ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100 max-md:data-[state=closed]:translate-y-full max-md:data-[state=open]:translate-y-0 md:bottom-auto md:left-1/2 md:top-1/2 md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[var(--radius-row)]"
          style={{
            background: "var(--bg-elevated)",
            boxShadow:
              "0 -8px 40px rgba(0,0,0,0.15), 0 0 0 1px var(--separator)",
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex shrink-0 flex-col pt-2 md:pt-3">
            <div
              className="mx-auto mb-3 h-1 w-10 rounded-full md:hidden"
              style={{ background: "var(--sheet-handle)" }}
              aria-hidden
            />
            <div className="flex items-center justify-between gap-2 px-4 pb-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="min-h-[44px] min-w-[44px] px-2 text-[17px] font-normal"
                  style={{ color: "var(--accent)" }}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Title
                className="flex-1 text-center text-[17px] font-semibold"
                style={{ color: "var(--label)" }}
              >
                {title}
              </Dialog.Title>
              <button
                type="button"
                onClick={handleSave}
                className="min-h-[44px] min-w-[44px] px-2 text-[17px] font-semibold"
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

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
            <label className="sr-only" htmlFor="task-title">
              Title
            </label>
            <input
              id="task-title"
              autoFocus
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full border-none bg-transparent text-[28px] font-semibold leading-tight outline-none placeholder:text-[var(--tertiary-label)]"
              style={{ color: "var(--label)" }}
            />
            {error ? (
              <p className="mt-1 text-[15px]" style={{ color: "var(--danger)" }}>
                {error}
              </p>
            ) : null}

            <label
              className="mt-6 block text-[13px] font-semibold uppercase tracking-wide"
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
              className="mt-2 w-full resize-none rounded-[10px] border-none px-3 py-2.5 text-[17px] outline-none"
              style={{
                background: "var(--bg)",
                color: "var(--label)",
                boxShadow: "inset 0 0 0 1px var(--separator)",
              }}
            />

            <label
              className="mt-6 block text-[13px] font-semibold uppercase tracking-wide"
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
              className="mt-2 min-h-[44px] w-full rounded-[10px] border-none px-3 text-[17px] outline-none"
              style={{
                background: "var(--bg)",
                color: "var(--label)",
                boxShadow: "inset 0 0 0 1px var(--separator)",
              }}
            />

            <p
              className="mt-6 text-[13px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--secondary-label)" }}
            >
              Priority
            </p>
            <div
              className="mt-2 inline-flex rounded-[10px] p-[3px]"
              style={{
                background: "var(--bg)",
                boxShadow: "inset 0 0 0 1px var(--separator)",
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
                    onClick={() =>
                      setForm((f) => ({ ...f, priority: p.id }))
                    }
                    className="motion-safe-transition min-h-[40px] rounded-[8px] px-4 text-[15px] font-medium"
                    style={{
                      color: sel ? "var(--label)" : "var(--secondary-label)",
                      background: sel ? "var(--bg-elevated)" : "transparent",
                      boxShadow: sel ? "var(--shadow-sm)" : "none",
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
                className="motion-safe-transition mt-10 w-full rounded-[12px] py-3.5 text-[17px] font-semibold"
                style={{
                  color: "var(--danger)",
                  background: "var(--bg)",
                  boxShadow: "inset 0 0 0 1px var(--separator)",
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
