import { useTaskStore } from '../../store/useTaskStore';
import { USERS } from '../../data/seedData';
import type { Status, Priority } from '../../types';

const STATUSES: { id: Status; label: string; color: string }[] = [
  { id: 'todo',        label: 'To Do',      color: 'var(--color-todo)' },
  { id: 'in-progress', label: 'In Progress', color: 'var(--color-in-progress)' },
  { id: 'in-review',   label: 'In Review',  color: 'var(--color-in-review)' },
  { id: 'done',        label: 'Done',       color: 'var(--color-done)' },
];

const PRIORITIES: { id: Priority; label: string; color: string }[] = [
  { id: 'critical', label: 'Critical', color: 'var(--color-critical)' },
  { id: 'high',     label: 'High',     color: 'var(--color-high)' },
  { id: 'medium',   label: 'Medium',   color: 'var(--color-medium)' },
  { id: 'low',      label: 'Low',      color: 'var(--color-low)' },
];

function ChipToggle({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all cursor-pointer select-none"
      style={
        active
          ? { backgroundColor: `${color}22`, color, border: `1px solid ${color}55` }
          : {
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }
      }
    >
      {active && (
        <span className="rounded-full" style={{ width: 5, height: 5, backgroundColor: color }} />
      )}
      {label}
    </button>
  );
}

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useTaskStore();

  const hasFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    filters.dueDateFrom !== '' ||
    filters.dueDateTo !== '';

  function toggleStatus(s: Status) {
    setFilters({
      statuses: filters.statuses.includes(s)
        ? filters.statuses.filter((x) => x !== s)
        : [...filters.statuses, s],
    });
  }

  function togglePriority(p: Priority) {
    setFilters({
      priorities: filters.priorities.includes(p)
        ? filters.priorities.filter((x) => x !== p)
        : [...filters.priorities, p],
    });
  }

  function toggleAssignee(id: string) {
    setFilters({
      assignees: filters.assignees.includes(id)
        ? filters.assignees.filter((x) => x !== id)
        : [...filters.assignees, id],
    });
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-6 py-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Status chips */}
      <div className="flex items-center gap-1">
        <span
          className="text-xs mr-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Status
        </span>
        {STATUSES.map((s) => (
          <ChipToggle
            key={s.id}
            label={s.label}
            color={s.color}
            active={filters.statuses.includes(s.id)}
            onClick={() => toggleStatus(s.id)}
          />
        ))}
      </div>

      <div className="w-px h-5" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Priority chips */}
      <div className="flex items-center gap-1">
        <span
          className="text-xs mr-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Priority
        </span>
        {PRIORITIES.map((p) => (
          <ChipToggle
            key={p.id}
            label={p.label}
            color={p.color}
            active={filters.priorities.includes(p.id)}
            onClick={() => togglePriority(p.id)}
          />
        ))}
      </div>

      <div className="w-px h-5" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Assignee chips */}
      <div className="flex items-center gap-1">
        <span
          className="text-xs mr-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Assignee
        </span>
        {USERS.map((u) => (
          <ChipToggle
            key={u.id}
            label={u.name.split(' ')[0]}
            color={u.color}
            active={filters.assignees.includes(u.id)}
            onClick={() => toggleAssignee(u.id)}
          />
        ))}
      </div>

      <div className="w-px h-5" style={{ backgroundColor: 'var(--color-border)' }} />

      {/* Date range */}
      <div className="flex items-center gap-1.5">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Due
        </span>
        <input
          type="date"
          value={filters.dueDateFrom}
          onChange={(e) => setFilters({ dueDateFrom: e.target.value })}
          className="rounded px-2 py-1 text-xs outline-none cursor-pointer"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
            colorScheme: 'dark',
          }}
        />
        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>→</span>
        <input
          type="date"
          value={filters.dueDateTo}
          onChange={(e) => setFilters({ dueDateTo: e.target.value })}
          className="rounded px-2 py-1 text-xs outline-none cursor-pointer"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
            colorScheme: 'dark',
          }}
        />
      </div>

      {/* Clear button */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all animate-fade-in"
          style={{
            backgroundColor: 'rgba(255,77,109,0.1)',
            color: '#ff4d6d',
            border: '1px solid rgba(255,77,109,0.25)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,77,109,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,77,109,0.1)';
          }}
        >
          ✕ Clear filters
        </button>
      )}
    </div>
  );
}