import { useEffect, useRef } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type {  Status, Priority, ViewMode } from '../types';

/**
 * Keeps URL query params in sync with filter + view state.
 * On mount: reads URL and restores state.
 * On change: writes state back to URL without triggering re-mount.
 */
export function useUrlFilters() {
  const { filters, setFilters, view, setView } = useTaskStore();
  const isMounting = useRef(true);

  // On mount: parse URL → restore state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const statuses = params.getAll('status') as Status[];
    const priorities = params.getAll('priority') as Priority[];
    const assignees = params.getAll('assignee');
    const dueDateFrom = params.get('from') ?? '';
    const dueDateTo = params.get('to') ?? '';
    const viewParam = params.get('view') as ViewMode | null;

    if (
      statuses.length ||
      priorities.length ||
      assignees.length ||
      dueDateFrom ||
      dueDateTo
    ) {
      setFilters({ statuses, priorities, assignees, dueDateFrom, dueDateTo });
    }

    if (viewParam && ['kanban', 'list', 'timeline'].includes(viewParam)) {
      setView(viewParam);
    }

    isMounting.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On filter / view change: write to URL
  useEffect(() => {
    if (isMounting.current) return;

    const params = new URLSearchParams();

    filters.statuses.forEach((s) => params.append('status', s));
    filters.priorities.forEach((p) => params.append('priority', p));
    filters.assignees.forEach((a) => params.append('assignee', a));
    if (filters.dueDateFrom) params.set('from', filters.dueDateFrom);
    if (filters.dueDateTo)   params.set('to',   filters.dueDateTo);
    params.set('view', view);

    const newUrl =
      params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

    window.history.replaceState(null, '', newUrl);
  }, [filters, view]);
}