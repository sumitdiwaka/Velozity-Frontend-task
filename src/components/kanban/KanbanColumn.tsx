import { useState, useRef } from 'react';
import type { Task, Status } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../shared/EmptyState';
import { useTaskStore } from '../../store/useTaskStore';

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  'todo':        { label: 'To Do',       color: 'var(--color-todo)' },
  'in-progress': { label: 'In Progress', color: 'var(--color-in-progress)' },
  'in-review':   { label: 'In Review',   color: 'var(--color-in-review)' },
  'done':        { label: 'Done',        color: 'var(--color-done)' },
};

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { moveTask, draggingId, setDraggingId } = useTaskStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [placeholderHeight, setPlaceholderHeight] = useState<number | null>(null);
  const dragSourceRef = useRef<string | null>(null);

  const { label, color } = STATUS_CONFIG[status];

  function handleDragStart(e: React.DragEvent, taskId: string) {
    dragSourceRef.current = taskId;
    setDraggingId(taskId);
    const card = e.currentTarget as HTMLElement;
    setPlaceholderHeight(card.offsetHeight);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column entirely (not a child element)
    const related = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(related)) return;
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) moveTask(taskId, status);
    setIsDragOver(false);
    setDraggingId(null);
    setPlaceholderHeight(null);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setPlaceholderHeight(null);
    setIsDragOver(false);
    dragSourceRef.current = null;
  }

  const isDraggingForeignCard =
    draggingId !== null && !tasks.find((t) => t.id === draggingId);

  return (
    <div
      className="flex flex-col rounded-xl flex-shrink-0"
      style={{
        width: 280,
        border: `1px solid ${isDragOver ? 'rgba(91,124,255,0.4)' : 'var(--color-border)'}`,
        backgroundColor: isDragOver
          ? 'rgba(91,124,255,0.04)'
          : 'var(--color-surface)',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="rounded-full"
            style={{ width: 8, height: 8, backgroundColor: color }}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {label}
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'var(--color-surface-3)',
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards scrollable area */}
      <div
        className="flex flex-col gap-2 p-3 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 260px)', minHeight: 100 }}
      >
        {/* Empty state when no tasks and not dragging into column */}
        {tasks.length === 0 && !isDragOver && (
          <EmptyState
            title="No tasks here"
            subtitle="Drag a card in or adjust filters"
            icon="✦"
          />
        )}

        {tasks.map((task) => (
          <div key={task.id} onDragEnd={handleDragEnd}>
            {/* Placeholder shown in place of the card being dragged */}
            {draggingId === task.id && placeholderHeight !== null && (
              <div
                className="drag-placeholder mb-2"
                style={{ height: placeholderHeight }}
              />
            )}
            <TaskCard
              task={task}
              onDragStart={handleDragStart}
              isDragging={draggingId === task.id}
            />
          </div>
        ))}

        {/* Drop target indicator when dragging a card from another column */}
        {isDragOver && isDraggingForeignCard && (
          <div
            className="drag-placeholder"
            style={{ height: placeholderHeight ?? 80 }}
          />
        )}
      </div>
    </div>
  );
}