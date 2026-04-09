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
        background: "var(--bg-grouped-secondary)",
        boxShadow:
          "inset 0 1px 2px rgba(0,0,0,0.05), inset 0 0 0 1px color-mix(in srgb, var(--separator) 80%, transparent)",
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
            className="motion-safe-transition relative min-h-[44px] flex-1 cursor-pointer rounded-[8px] text-[15px] font-semibold tracking-[-0.02em] active:scale-[0.98]"
            style={{
              color: selected ? "var(--label)" : "var(--secondary-label)",
              background: selected ? "var(--bg-elevated)" : "transparent",
              boxShadow: selected
                ? "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "none",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
