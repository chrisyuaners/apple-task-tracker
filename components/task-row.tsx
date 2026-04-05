"use client";

import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { Task } from "@/lib/types";
import {
  GROUP_LABELS,
  groupKeyForDueDate,
  type DateGroupKey,
} from "@/lib/dates";

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
  /** Inset grouped list (iOS-style); omit outer card chrome */
  grouped?: boolean;
};

export function TaskRow({
  task,
  onToggle,
  onOpen,
  showDueSummary,
  grouped = false,
}: Props) {
  const group = groupKeyForDueDate(task.dueAt) as DateGroupKey;
  const secondaryLine = (() => {
    if (showDueSummary && task.dueAt) {
      const g = GROUP_LABELS[group];
      return task.notes ? `${g} · ${task.notes}` : g;
    }
    return task.notes ?? "";
  })();

  const shellClass = grouped
    ? "motion-safe-transition flex min-h-[52px] items-stretch gap-3 px-4 py-3 active:bg-[var(--fill-quaternary)] md:hover:bg-[var(--fill-quaternary)]"
    : "motion-safe-transition flex min-h-[52px] items-stretch gap-3 rounded-[var(--radius-row)] px-3 py-2.5";

  const shellStyle = grouped
    ? undefined
    : {
        background: "var(--bg-grouped)",
        boxShadow:
          "var(--shadow-sm), inset 0 0 0 1px color-mix(in srgb, var(--separator) 75%, transparent)",
      };

  return (
    <div className={shellClass} style={shellStyle}>
      <div className="flex w-11 shrink-0 items-center justify-center self-stretch">
        <Checkbox.Root
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="motion-safe-transition flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 outline-none data-[state=checked]:border-[var(--success)] data-[state=unchecked]:border-[var(--separator-opaque)] data-[state=checked]:bg-[var(--success)] data-[state=unchecked]:bg-transparent motion-safe-press active:scale-90"
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox.Indicator className="text-white">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
      <button
        type="button"
        className="min-w-0 flex-1 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-grouped)]"
        onClick={() => onOpen(task.id)}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="mt-[7px] h-2 w-2 shrink-0 rounded-full ring-1 ring-black/[0.06] dark:ring-white/[0.12]"
            style={{ background: PRIORITY_DOT[task.priority] }}
            aria-hidden
          />
          <div className="min-w-0 flex-1 pr-1">
            <p
              className="text-[17px] font-medium leading-[1.35] tracking-[-0.01em]"
              style={{
                color: "var(--label)",
                textDecoration: task.completed ? "line-through" : undefined,
                opacity: task.completed ? 0.42 : 1,
              }}
            >
              {task.title}
            </p>
            {secondaryLine ? (
              <p
                className="mt-1 line-clamp-2 text-[15px] leading-snug tracking-[-0.01em]"
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
