import { create } from 'zustand';
import { ALL_TASKS, USERS } from '../data/seedData';
import type {
  Task, FilterState, SortState, ViewMode,
  Status, CollabUser
} from '../types';

interface TaskStore {
  // Core data
  tasks: Task[];
  view: ViewMode;
  setView: (v: ViewMode) => void;

  // Filters
  filters: FilterState;
  setFilters: (f: Partial<FilterState>) => void;
  clearFilters: () => void;

  // Sort (list view)
  sort: SortState;
  setSort: (s: SortState) => void;

  // Drag and drop
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
  moveTask: (taskId: string, newStatus: Status) => void;

  // Inline status change (list view)
  updateTaskStatus: (taskId: string, status: Status) => void;

  // Collaboration simulation
  collabUsers: CollabUser[];
  setCollabUsers: (users: CollabUser[]) => void;

  // Derived helpers
  getFilteredTasks: () => Task[];
}

const DEFAULT_FILTERS: FilterState = {
  statuses: [],
  priorities: [],
  assignees: [],
  dueDateFrom: '',
  dueDateTo: '',
};

// Kick off with first 4 users as collab participants
const INITIAL_COLLAB: CollabUser[] = USERS.slice(0, 4).map((u) => ({
  user: u,
  currentTaskId: null,
  prevTaskId: null,
}));

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: ALL_TASKS,
  view: 'kanban',
  setView: (view) => set({ view }),

  filters: DEFAULT_FILTERS,
  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  sort: { field: 'dueDate', dir: 'asc' },
  setSort: (sort) => set({ sort }),

  draggingId: null,
  setDraggingId: (id) => set({ draggingId: id }),

  moveTask: (taskId, newStatus) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    })),

  updateTaskStatus: (taskId, status) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, status } : t
      ),
    })),

  collabUsers: INITIAL_COLLAB,
  setCollabUsers: (users) => set({ collabUsers: users }),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter((t) => {
      if (filters.statuses.length && !filters.statuses.includes(t.status))
        return false;
      if (filters.priorities.length && !filters.priorities.includes(t.priority))
        return false;
      if (filters.assignees.length && !filters.assignees.includes(t.assigneeId))
        return false;
      if (filters.dueDateFrom && t.dueDate < filters.dueDateFrom)
        return false;
      if (filters.dueDateTo && t.dueDate > filters.dueDateTo)
        return false;
      return true;
    });
  },
}));