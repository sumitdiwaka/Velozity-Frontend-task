import { useEffect, useRef } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Avatar } from '../shared/Avatar';
import { USERS } from '../../data/seedData';
import type { CollabUser } from '../../types';

// Simulate user presence moving between tasks
function useCollabSimulation() {
  const { tasks, setCollabUsers, collabUsers } = useTaskStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (tasks.length === 0) return;

    // Initial random assignment
    const taskIds = tasks.map((t) => t.id);
    const initial: CollabUser[] = USERS.slice(0, 4).map((u) => ({
      user: u,
      currentTaskId: taskIds[Math.floor(Math.random() * taskIds.length)],
      prevTaskId: null,
    }));
    setCollabUsers(initial);

    intervalRef.current = setInterval(() => {
      setCollabUsers(
        collabUsers.map((cu) => {
          // ~40% chance to move to a different task
          if (Math.random() < 0.4) {
            const next = taskIds[Math.floor(Math.random() * taskIds.length)];
            return { ...cu, prevTaskId: cu.currentTaskId, currentTaskId: next };
          }
          return { ...cu, prevTaskId: null };
        })
      );
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length]);
}

export function CollaborationBar() {
  useCollabSimulation();
  const { collabUsers } = useTaskStore();
  const activeCount = collabUsers.filter((cu) => cu.currentTaskId !== null).length;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 text-xs"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Live dot */}
      <span
        className="animate-pulse-dot rounded-full shrink-0"
        style={{ width: 6, height: 6, backgroundColor: '#4ade80' }}
      />

      {/* Avatar stack */}
      <div className="flex items-center">
        {collabUsers.map((cu, idx) => (
          <div
            key={cu.user.id}
            className="animate-avatar-move"
            style={{
              marginLeft: idx > 0 ? -6 : 0,
              zIndex: collabUsers.length - idx,
              position: 'relative',
            }}
          >
            <Avatar name={cu.user.name} color={cu.user.color} size="xs" />
          </div>
        ))}
      </div>

      <span style={{ color: 'var(--color-text-secondary)' }}>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          {activeCount} {activeCount === 1 ? 'person' : 'people'}
        </span>{' '}
        {activeCount === 1 ? 'is' : 'are'} viewing this board
      </span>
    </div>
  );
}