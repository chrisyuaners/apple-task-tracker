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
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p
          className="text-[28px] font-semibold leading-tight tracking-tight"
          style={{ color: "var(--label)" }}
        >
          No tasks
        </p>
        <p
          className="mt-2 max-w-sm text-[17px] leading-relaxed"
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
          className="motion-safe-transition mt-8 min-h-[44px] rounded-full px-8 text-[17px] font-semibold text-white"
          style={{ background: "var(--accent)" }}
        >
          New Task
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-28">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {a11yStatus}
      </p>
      {nonEmptyGroups.map((key) => (
        <section key={key} aria-labelledby={`heading-${key}`}>
          <h2
            id={`heading-${key}`}
            className="sticky top-0 z-10 -mx-1 mb-2 px-1 py-2 text-[13px] font-semibold uppercase tracking-wide backdrop-blur-md"
            style={{
              color: "var(--secondary-label)",
              background: "color-mix(in srgb, var(--bg) 85%, transparent)",
            }}
          >
            {GROUP_LABELS[key as DateGroupKey]}
          </h2>
          <ul className="flex flex-col gap-2">
            {groupedFiltered.get(key)!.map((task) => (
              <li key={task.id}>
                <TaskRow
                  task={task}
                  onToggle={handleToggle}
                  onOpen={openEditTask}
                  showDueSummary={showDueSummary}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
