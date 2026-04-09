"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Ellipsis, Moon, Smartphone, Sun, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTasks } from "@/contexts/tasks-context";
import { parseTasksImportJson } from "@/lib/import-json";

const STORAGE_KEY = "apple-task-tracker-theme";

export type ThemePreference = "system" | "light" | "dark";

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  if (pref === "light") {
    root.setAttribute("data-theme", "light");
    return;
  }
  if (pref === "dark") {
    root.setAttribute("data-theme", "dark");
    return;
  }
  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", dark ? "dark" : "light");
}

export function ThemeMenu({
  onExportJson,
}: {
  onExportJson: () => void;
}) {
  const { replaceTasks, tasks } = useTasks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pref, setPref] = useState<ThemePreference>("system");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync menu state with localStorage after mount */
    setPref(readPreference());
    applyTheme(readPreference());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPref(next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [pref]);

  const openImportPicker = useCallback(() => {
    window.setTimeout(() => fileInputRef.current?.click(), 0);
  }, []);

  const handleImportFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const file = input.files?.[0];
      input.value = "";
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        const result = parseTasksImportJson(text);
        if (!result.ok) {
          window.alert(result.error);
          return;
        }

        const n = result.tasks.length;
        const cur = tasks.length;

        if (n === 0 && cur === 0) {
          window.alert("This file contains no tasks.");
          return;
        }

        const msg =
          n === 0
            ? "Replace all current tasks with an empty list?"
            : cur === 0
              ? `Import ${n} task${n === 1 ? "" : "s"}?`
              : `Replace ${cur} current task${cur === 1 ? "" : "s"} with ${n} imported task${n === 1 ? "" : "s"}?`;

        if (!window.confirm(`${msg}\n\nThis cannot be undone.`)) return;

        replaceTasks(result.tasks);
        window.alert(
          n === 0
            ? "All tasks were cleared."
            : `Imported ${n} task${n === 1 ? "" : "s"}.`,
        );
      };
      reader.onerror = () => {
        window.alert("Could not read the file.");
      };
      reader.readAsText(file);
    },
    [replaceTasks, tasks.length],
  );

  const itemClass =
    "flex cursor-pointer select-none items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[17px] outline-none transition-colors duration-150 data-[highlighted]:bg-[var(--fill-tertiary)]";

  return (
    <DropdownMenu.Root>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={handleImportFile}
      />
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="motion-safe-transition flex h-10 w-10 cursor-pointer items-center justify-center rounded-full active:bg-[var(--fill-tertiary)] md:hover:bg-[var(--fill-tertiary)]"
          style={{ color: "var(--accent)" }}
          aria-label="More options"
        >
          <Ellipsis className="h-6 w-6" strokeWidth={1.85} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="motion-safe-transition z-[200] min-w-[232px] rounded-[14px] p-1.5 backdrop-blur-xl"
          style={{
            background: "color-mix(in srgb, var(--bg-elevated) 92%, transparent)",
            boxShadow: "var(--shadow-lg), inset 0 0 0 1px color-mix(in srgb, var(--separator) 70%, transparent)",
          }}
          sideOffset={10}
          align="end"
        >
          <div
            className="px-3 pb-1 pt-1.5 text-[12px] font-semibold uppercase tracking-[0.07em]"
            style={{ color: "var(--tertiary-label)" }}
          >
            Appearance
          </div>
          <DropdownMenu.Item
            className={itemClass}
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("system")}
          >
            <Smartphone className="h-[18px] w-[18px] shrink-0 opacity-65" />
            <span className="flex-1 tracking-[-0.01em]">System</span>
            {pref === "system" ? (
              <Check
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.5}
                style={{ color: "var(--accent)" }}
              />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("light")}
          >
            <Sun className="h-[18px] w-[18px] shrink-0 opacity-65" />
            <span className="flex-1 tracking-[-0.01em]">Light</span>
            {pref === "light" ? (
              <Check
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.5}
                style={{ color: "var(--accent)" }}
              />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={itemClass}
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("dark")}
          >
            <Moon className="h-[18px] w-[18px] shrink-0 opacity-65" />
            <span className="flex-1 tracking-[-0.01em]">Dark</span>
            {pref === "dark" ? (
              <Check
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={2.5}
                style={{ color: "var(--accent)" }}
              />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Separator
            className="my-1.5 h-px mx-1"
            style={{ background: "var(--separator)" }}
          />
          <div
            className="px-3 pb-1 pt-1 text-[12px] font-semibold uppercase tracking-[0.07em]"
            style={{ color: "var(--tertiary-label)" }}
          >
            Tasks
          </div>
          <DropdownMenu.Item
            className={`${itemClass} font-medium`}
            style={{ color: "var(--accent)" }}
            onSelect={onExportJson}
          >
            <span className="flex-1 tracking-[-0.01em]">Export as JSON</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={`${itemClass} font-medium`}
            style={{ color: "var(--accent)" }}
            onSelect={() => openImportPicker()}
          >
            <Upload className="h-[18px] w-[18px] shrink-0 opacity-90" />
            <span className="flex-1 tracking-[-0.01em]">Import from JSON</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
