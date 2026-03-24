import { useTaskStore } from '../../store/useTaskStore';
import { today, parseDate, getDaysInMonth, toIsoDate } from '../../utils/dateUtils';
import { PriorityBadge } from '../shared/PriorityBadge';
import { USERS } from '../../data/seedData';

const DAY_WIDTH = 36;
const ROW_HEIGHT = 44;

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#ff4d6d',
  high:     '#ff8c42',
  medium:   '#f7c948',
  low:      '#4ade80',
};

export function TimelineView() {
  const { getFilteredTasks } = useTaskStore();
  const tasks = getFilteredTasks();
  const now = today();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todayDay = now.getDate();

  // Month start as date
  const monthStart = new Date(year, month, 1);

  function dayOffset(dateStr: string): number {
    const d = parseDate(dateStr);
    return Math.floor((d.getTime() - monthStart.getTime()) / 86_400_000);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <div style={{ minWidth: DAY_WIDTH * daysInMonth + 200 }}>
          {/* Day header */}
          <div
            className="flex sticky top-0 z-10"
            style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="shrink-0" style={{ width: 200, borderRight: '1px solid var(--color-border)' }} />
            {days.map((d) => (
              <div
                key={d}
                className="flex items-center justify-center text-xs shrink-0"
                style={{
                  width: DAY_WIDTH,
                  height: 36,
                  color: d === todayDay ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: d === todayDay ? 700 : 400,
                  backgroundColor: d === todayDay ? 'rgba(91,124,255,0.08)' : 'transparent',
                  borderRight: '1px solid var(--color-border)',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Task rows */}
          {tasks.map((task, idx) => {
            const assignee = USERS.find((u) => u.id === task.assigneeId);
            const color = PRIORITY_COLORS[task.priority];
            const dueOffset = dayOffset(task.dueDate);
            const startOffset = task.startDate ? dayOffset(task.startDate) : dueOffset;
            // Clamp to month
            const clampedStart = Math.max(0, Math.min(startOffset, daysInMonth - 1));
            const clampedEnd   = Math.max(0, Math.min(dueOffset, daysInMonth - 1));
            const barLeft  = clampedStart * DAY_WIDTH;
            const barWidth = Math.max(DAY_WIDTH, (clampedEnd - clampedStart + 1) * DAY_WIDTH);
            const isVisible = clampedEnd >= 0 && clampedStart < daysInMonth;

            return (
              <div
                key={task.id}
                className="flex items-center relative"
                style={{
                  height: ROW_HEIGHT,
                  backgroundColor: idx % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                {/* Task name column */}
                <div
                  className="flex items-center gap-2 px-3 shrink-0"
                  style={{ width: 200, borderRight: '1px solid var(--color-border)', overflow: 'hidden' }}
                >
                  {assignee && (
                    <div
                      className="rounded-full shrink-0"
                      style={{ width: 6, height: 6, backgroundColor: assignee.color }}
                    />
                  )}
                  <span
                    className="text-xs truncate"
                    style={{ color: 'var(--color-text-secondary)' }}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                </div>

                {/* Timeline area */}
                <div className="relative flex" style={{ position: 'relative' }}>
                  {/* Day grid cells */}
                  {days.map((d) => (
                    <div
                      key={d}
                      style={{
                        width: DAY_WIDTH,
                        height: ROW_HEIGHT,
                        borderRight: '1px solid var(--color-border)',
                        flexShrink: 0,
                        backgroundColor: d === todayDay ? 'rgba(91,124,255,0.04)' : 'transparent',
                      }}
                    />
                  ))}

                  {/* Today line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: (todayDay - 0.5) * DAY_WIDTH,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      backgroundColor: 'var(--color-accent)',
                      opacity: 0.6,
                      zIndex: 2,
                    }}
                  />

                  {/* Task bar */}
                  {isVisible && (
                    <div
                      title={task.title}
                      style={{
                        position: 'absolute',
                        left: barLeft + 2,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: barWidth - 4,
                        height: 24,
                        backgroundColor: `${color}22`,
                        border: `1px solid ${color}66`,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 6,
                        paddingRight: 6,
                        overflow: 'hidden',
                        zIndex: 1,
                        cursor: 'default',
                      }}
                    >
                      <span
                        className="text-xs truncate"
                        style={{ color, fontWeight: 500, fontSize: 10, fontFamily: 'var(--font-mono)' }}
                      >
                        {task.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}