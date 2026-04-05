"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { Task } from "@/lib/types";
import { GROUP_LABELS, groupKeyForDueDate, type DateGroupKey } from "@/lib/dates";

const PRIORITY_DOT: Record<Task["priority"], string> = {
  low: "var(--priority-low)",
  medium: "var(--priority-medium)",
  high: "var(--priority-high)",
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
  showDueSummary?: boolean;
};

export function TaskRow({ task, onToggle, onOpen, showDueSummary }: Props) {
  const group = groupKeyForDueDate(task.dueAt) as DateGroupKey;
  const secondaryLine = (() => {
    if (showDueSummary && task.dueAt) {
      const g = GROUP_LABELS[group];
      return task.notes ? `${g} · ${task.notes}` : g;
    }
    return task.notes ?? "";
  })();

  return (
    <div
      className="motion-safe-transition flex min-h-[52px] items-stretch gap-3 rounded-[var(--radius-row)] px-3 py-2"
      style={{
        background: "var(--bg-grouped)",
        boxShadow: "inset 0 0 0 1px var(--separator)",
      }}
    >
      <div className="flex shrink-0 items-center pt-0.5">
        <Checkbox.Root
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="motion-safe-transition flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 outline-none"
          style={{
            borderColor: task.completed ? "var(--success)" : "var(--separator-opaque)",
            background: task.completed ? "var(--success)" : "transparent",
          }}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox.Indicator>
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
      <button
        type="button"
        className="min-w-0 flex-1 text-left"
        onClick={() => onOpen(task.id)}
      >
        <div className="flex items-start gap-2">
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full"
            style={{ background: PRIORITY_DOT[task.priority] }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p
              className="text-[17px] leading-snug"
              style={{
                color: "var(--label)",
                textDecoration: task.completed ? "line-through" : undefined,
                opacity: task.completed ? 0.45 : 1,
              }}
            >
              {task.title}
            </p>
            {secondaryLine ? (
              <p
                className="mt-0.5 line-clamp-2 text-[15px] leading-snug"
                style={{ color: "var(--secondary-label)" }}
              >
                {secondaryLine}
              </p>
            ) : null}
          </div>
        </div>
      </button>
    </div>
  );
}
