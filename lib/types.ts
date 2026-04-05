export type Priority = "low" | "medium" | "high";

export type TaskFilter = "today" | "upcoming" | "all";

export type Task = {
  id: string;
  title: string;
  notes?: string;
  /** Local calendar date YYYY-MM-DD */
  dueAt?: string;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};
