"use client";

import { TasksProvider } from "@/contexts/tasks-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TasksProvider>{children}</TasksProvider>;
}
