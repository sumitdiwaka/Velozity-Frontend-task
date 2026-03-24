import { useTaskStore } from '../../store/useTaskStore';
import { VirtualList } from './VirtualList';
import { EmptyState } from '../shared/EmptyState';
import type { SortField } from '../../types';

export function ListView() {
  const { getFilteredTasks, sort, setSort, clearFilters } = useTaskStore();
  const tasks = getFilteredTasks();

  function handleSort(field: SortField) {
    if (sort.field === field) {
      setSort({ field, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, dir: 'asc' });
    }
  }

  const sorted = [...tasks].sort((a, b) => {
    const mul = sort.dir === 'asc' ? 1 : -1;
    if (sort.field === 'title') return mul * a.title.localeCompare(b.title);
    if (sort.field === 'priority') {
      const ord = { critical: 0, high: 1, medium: 2, low: 3 };
      return mul * (ord[a.priority] - ord[b.priority]);
    }
    if (sort.field === 'dueDate') return mul * a.dueDate.localeCompare(b.dueDate);
    return 0;
  });

  function SortIcon({ field }: { field: SortField }) {
    if (sort.field !== field) return <span style={{ color: 'var(--color-text-muted)', fontSize: 10 }}>↕</span>;
    return <span style={{ color: 'var(--color-accent)', fontSize: 10 }}>{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState
          title="No tasks match your filters"
          subtitle="Try adjusting or clearing your filters"
          action={{ label: 'Clear filters', onClick: clearFilters }}
          icon="🔍"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Table header */}
      <div
        className="grid text-xs font-semibold px-6 py-2 shrink-0"
        style={{
          gridTemplateColumns: '1fr 100px 110px 130px 100px',
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <button className="flex items-center gap-1 text-left cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>
          TITLE <SortIcon field="title" />
        </button>
        <button className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('priority')}>
          PRIORITY <SortIcon field="priority" />
        </button>
        <span>STATUS</span>
        <button className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('dueDate')}>
          DUE DATE <SortIcon field="dueDate" />
        </button>
        <span>ASSIGNEE</span>
      </div>

      <VirtualList tasks={sorted} />
    </div>
  );
}