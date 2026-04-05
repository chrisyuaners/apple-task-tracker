"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, Ellipsis, Moon, Smartphone, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const [pref, setPref] = useState<ThemePreference>("system");

  useEffect(() => {
    setPref(readPreference());
    applyTheme(readPreference());
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

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="motion-safe-transition flex h-11 w-11 items-center justify-center rounded-full"
          style={{ color: "var(--accent)" }}
          aria-label="More options"
        >
          <Ellipsis className="h-6 w-6" strokeWidth={1.75} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="motion-safe-transition z-[200] min-w-[220px] rounded-[14px] p-1 shadow-lg"
          style={{
            background: "var(--bg-elevated)",
            boxShadow:
              "0 12px 40px rgba(0,0,0,0.18), 0 0 0 1px var(--separator)",
          }}
          sideOffset={8}
          align="end"
        >
          <div
            className="px-3 py-2 text-[13px] font-semibold uppercase tracking-wide"
            style={{ color: "var(--tertiary-label)" }}
          >
            Appearance
          </div>
          <DropdownMenu.Item
            className="flex cursor-pointer select-none items-center gap-2 rounded-[10px] px-3 py-2.5 text-[17px] outline-none focus:bg-[var(--separator-opaque)] data-[highlighted]:bg-[var(--separator-opaque)]"
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("system")}
          >
            <Smartphone className="h-5 w-5 shrink-0 opacity-70" />
            <span className="flex-1">System</span>
            {pref === "system" ? (
              <Check className="h-5 w-5 shrink-0" style={{ color: "var(--accent)" }} />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer select-none items-center gap-2 rounded-[10px] px-3 py-2.5 text-[17px] outline-none focus:bg-[var(--separator-opaque)] data-[highlighted]:bg-[var(--separator-opaque)]"
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("light")}
          >
            <Sun className="h-5 w-5 shrink-0 opacity-70" />
            <span className="flex-1">Light</span>
            {pref === "light" ? (
              <Check className="h-5 w-5 shrink-0" style={{ color: "var(--accent)" }} />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer select-none items-center gap-2 rounded-[10px] px-3 py-2.5 text-[17px] outline-none focus:bg-[var(--separator-opaque)] data-[highlighted]:bg-[var(--separator-opaque)]"
            style={{ color: "var(--label)" }}
            onSelect={() => setPreference("dark")}
          >
            <Moon className="h-5 w-5 shrink-0 opacity-70" />
            <span className="flex-1">Dark</span>
            {pref === "dark" ? (
              <Check className="h-5 w-5 shrink-0" style={{ color: "var(--accent)" }} />
            ) : null}
          </DropdownMenu.Item>
          <DropdownMenu.Separator
            className="my-1 h-px"
            style={{ background: "var(--separator)" }}
          />
          <DropdownMenu.Item
            className="flex cursor-pointer select-none items-center rounded-[10px] px-3 py-2.5 text-[17px] outline-none focus:bg-[var(--separator-opaque)] data-[highlighted]:bg-[var(--separator-opaque)]"
            style={{ color: "var(--accent)" }}
            onSelect={onExportJson}
          >
            Export tasks as JSON
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
