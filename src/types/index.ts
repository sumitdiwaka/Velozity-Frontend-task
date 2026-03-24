export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'in-review' | 'done';
export type ViewMode = 'kanban' | 'list' | 'timeline';
export type SortField = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate: string | null; // ISO date string
  dueDate: string;          // ISO date string
  description?: string;
  tags?: string[];
}

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assignees: string[];
  dueDateFrom: string;
  dueDateTo: string;
}

export interface SortState {
  field: SortField;
  dir: SortDir;
}

export interface CollabUser {
  user: User;
  currentTaskId: string | null;
  prevTaskId: string | null;
}