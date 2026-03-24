import type { Priority } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
  compact?: boolean;
}

const CONFIG: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
  critical: { label: 'Critical', bg: 'rgba(255,77,109,0.12)', text: '#ff4d6d', dot: '#ff4d6d' },
  high:     { label: 'High',     bg: 'rgba(255,140,66,0.12)', text: '#ff8c42', dot: '#ff8c42' },
  medium:   { label: 'Medium',   bg: 'rgba(247,201,72,0.12)', text: '#f7c948', dot: '#f7c948' },
  low:      { label: 'Low',      bg: 'rgba(74,222,128,0.12)', text: '#4ade80', dot: '#4ade80' },
};

export function PriorityBadge({ priority, compact = false }: PriorityBadgeProps) {
  const { label, bg, text, dot } = CONFIG[priority];

  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      <span
        className="rounded-full shrink-0"
        style={{ width: 5, height: 5, backgroundColor: dot }}
      />
      {!compact && label}
    </span>
  );
}

export function priorityOrder(p: Priority): number {
  return { critical: 0, high: 1, medium: 2, low: 3 }[p];
}