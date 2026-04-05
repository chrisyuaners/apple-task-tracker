"use client";

import type { TaskFilter } from "@/lib/types";

const ITEMS: { id: TaskFilter; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "all", label: "All" },
];

type Props = {
  value: TaskFilter;
  onChange: (v: TaskFilter) => void;
};

export function SegmentedControl({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex w-full max-w-md rounded-[10px] p-[3px] motion-safe-transition"
      style={{
        background: "var(--bg-elevated)",
        boxShadow: "inset 0 0 0 1px var(--separator)",
      }}
      role="tablist"
      aria-label="Task list filter"
    >
      {ITEMS.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className="motion-safe-transition relative min-h-[44px] flex-1 rounded-[8px] text-[15px] font-medium"
            style={{
              color: selected ? "var(--label)" : "var(--secondary-label)",
              background: selected ? "var(--bg-grouped)" : "transparent",
              boxShadow: selected ? "var(--shadow-sm)" : "none",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
