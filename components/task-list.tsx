"use client";

import { useState } from "react";
import { GROUP_LABELS, GROUP_ORDER, type DateGroupKey } from "@/lib/dates";
import { useTasks } from "@/contexts/tasks-context";
import { TaskRow } from "./task-row";

export function TaskList() {
  const {
    groupedFiltered,
    filteredTasks,
    filter,
    toggleComplete,
    openEditTask,
    openNewTask,
    tasks,
  } = useTasks();
  const [a11yStatus, setA11yStatus] = useState("");

  const handleToggle = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    toggleComplete(id);
    if (t) {
      setA11yStatus(
        t.completed ? "Task marked as not done" : "Task completed",
      );
    }
  };

  const showDueSummary = filter === "all";

  const nonEmptyGroups = GROUP_ORDER.filter(
    (key) => (groupedFiltered.get(key)?.length ?? 0) > 0,
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[20px]"
          style={{
            background: "var(--fill-tertiary)",
            boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--separator) 50%, transparent)",
          }}
          aria-hidden
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--tertiary-label)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <p
          className="text-[28px] font-bold leading-tight tracking-[-0.03em]"
          style={{ color: "var(--label)" }}
        >
          No tasks
        </p>
        <p
          className="mt-2 max-w-[300px] text-[17px] leading-[1.45] tracking-[-0.01em]"
          style={{ color: "var(--secondary-label)" }}
        >
          {filter === "today"
            ? "Nothing due today. Add a task or switch to Upcoming or All."
            : filter === "upcoming"
              ? "No upcoming tasks. You are all caught up."
              : "Create your first task to get started."}
        </p>
        <button
          type="button"
          onClick={openNewTask}
          className="motion-safe-transition mt-9 min-h-[48px] rounded-full px-10 text-[17px] font-semibold tracking-[-0.01em] text-white active:opacity-[0.88] motion-safe-press active:scale-[0.98]"
          style={{
            background: "var(--accent)",
            boxShadow: "var(--shadow-fab)",
          }}
        >
          New Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-32 pt-1">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {a11yStatus}
      </p>
      {nonEmptyGroups.map((key) => {
        const groupTasks = groupedFiltered.get(key)!;
        return (
          <section key={key} aria-labelledby={`heading-${key}`}>
            <h2
              id={`heading-${key}`}
              className="sticky top-0 z-10 -mx-1 mb-2.5 px-1 pb-1 pt-0.5 text-[13px] font-semibold uppercase tracking-[0.06em] backdrop-blur-xl"
              style={{
                color: "var(--secondary-label)",
                background: "var(--sticky-header-bg)",
              }}
            >
              {GROUP_LABELS[key as DateGroupKey]}
            </h2>
            <ul
              className="overflow-hidden rounded-[var(--radius-row)] motion-safe-transition"
              style={{
                background: "var(--bg-grouped)",
                boxShadow:
                  "var(--shadow-sm), inset 0 0 0 1px color-mix(in srgb, var(--separator) 75%, transparent)",
              }}
            >
              {groupTasks.map((task, index) => (
                <li
                  key={task.id}
                  className="motion-safe-transition"
                  style={
                    index > 0
                      ? { borderTop: "1px solid var(--separator)" }
                      : undefined
                  }
                >
                  <TaskRow
                    task={task}
                    onToggle={handleToggle}
                    onOpen={openEditTask}
                    showDueSummary={showDueSummary}
                    grouped
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
