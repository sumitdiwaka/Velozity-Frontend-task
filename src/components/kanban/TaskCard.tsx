import type { Task } from '../../types';
import { USERS } from '../../data/seedData';
import { Avatar } from '../shared/Avatar';
import { PriorityBadge } from '../shared/PriorityBadge';
import { dueDateLabel } from '../../utils/dateUtils';
import { useTaskStore } from '../../store/useTaskStore';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  isDragging: boolean;
}

export function TaskCard({ task, onDragStart, isDragging }: TaskCardProps) {
  const collabUsers = useTaskStore((s) => s.collabUsers);

  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const { label: dateLabel, variant: dateVariant } = dueDateLabel(task.dueDate);

  const activeOnCard = collabUsers.filter((cu) => cu.currentTaskId === task.id);

  const dateColor =
    dateVariant === 'today'
      ? 'var(--color-medium)'
      : dateVariant === 'overdue'
      ? 'var(--color-critical)'
      : 'var(--color-text-muted)';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="rounded-lg p-3 cursor-grab active:cursor-grabbing select-none"
      style={{
        backgroundColor: isDragging ? 'transparent' : 'var(--color-surface-3)',
        border: `1px solid ${isDragging ? 'transparent' : 'var(--color-border)'}`,
        opacity: isDragging ? 0 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      {/* Priority row + collab avatars */}
      <div className="flex items-center justify-between mb-2">
        <PriorityBadge priority={task.priority} />

        {activeOnCard.length > 0 && (
          <div className="flex items-center">
            {activeOnCard.slice(0, 2).map((cu, idx) => (
              <div
                key={cu.user.id}
                style={{ marginLeft: idx > 0 ? -5 : 0, zIndex: 2 - idx, position: 'relative' }}
              >
                <Avatar name={cu.user.name} color={cu.user.color} size="xs" />
              </div>
            ))}
            {activeOnCard.length > 2 && (
              <span
                style={{
                  width: 18,
                  height: 18,
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                  fontSize: 9,
                  marginLeft: -5,
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +{activeOnCard.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <p
        className="text-sm font-medium leading-snug mb-2"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {task.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {assignee && (
          <div className="flex items-center gap-1.5">
            <Avatar name={assignee.name} color={assignee.color} size="xs" />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {assignee.name.split(' ')[0]}
            </span>
          </div>
        )}
        <span
          className="text-xs font-medium"
          style={{ color: dateColor, fontFamily: 'var(--font-mono)' }}
        >
          {dateLabel}
        </span>
      </div>
    </div>
  );
}