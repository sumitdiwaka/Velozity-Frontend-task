import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { useTaskStore } from '../../store/useTaskStore';
import { USERS } from '../../data/seedData';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { dueDateLabel } from '../../utils/dateUtils';
import type { Task, Status } from '../../types';

const ROW_HEIGHT = 48;
const CONTAINER_HEIGHT = window.innerHeight - 220;

const STATUS_OPTIONS: { id: Status; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'in-review', label: 'In Review' },
  { id: 'done', label: 'Done' },
];

export function VirtualList({ tasks }: { tasks: Task[] }) {
  const { updateTaskStatus } = useTaskStore();
  const { startIndex, endIndex, offsetY, totalHeight, containerRef } = useVirtualScroll({
    itemCount: tasks.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    buffer: 5,
  });

  const visibleTasks = tasks.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto"
      style={{ height: CONTAINER_HEIGHT, position: 'relative' }}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Rendered rows positioned absolutely */}
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visibleTasks.map((task, i) => {
            const assignee = USERS.find((u) => u.id === task.assigneeId);
            const { label: dateLabel, variant } = dueDateLabel(task.dueDate);
            const dateColor =
              variant === 'today' ? 'var(--color-medium)' :
              variant === 'overdue' ? 'var(--color-critical)' :
              'var(--color-text-secondary)';
            const isEven = (startIndex + i) % 2 === 0;

            return (
              <div
                key={task.id}
                className="grid items-center px-6 text-sm"
                style={{
                  gridTemplateColumns: '1fr 100px 110px 130px 100px',
                  height: ROW_HEIGHT,
                  backgroundColor: isEven ? 'var(--color-bg)' : 'var(--color-surface)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {/* Title */}
                <span
                  className="truncate pr-4"
                  style={{ color: 'var(--color-text-primary)' }}
                  title={task.title}
                >
                  {task.title}
                </span>

                {/* Priority */}
                <span><PriorityBadge priority={task.priority} /></span>

                {/* Status dropdown */}
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                  className="rounded px-2 py-1 text-xs outline-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                    maxWidth: 105,
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>

                {/* Due date */}
                <span
                  className="text-xs font-medium"
                  style={{ color: dateColor, fontFamily: 'var(--font-mono)' }}
                >
                  {dateLabel}
                </span>

                {/* Assignee */}
                {assignee && (
                  <div className="flex items-center gap-1.5">
                    <Avatar name={assignee.name} color={assignee.color} size="xs" />
                    <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {assignee.name.split(' ')[0]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}