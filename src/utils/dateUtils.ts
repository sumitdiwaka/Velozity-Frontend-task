export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseDate(str: string): Date {
  // Parse YYYY-MM-DD without timezone shift
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

export function formatDate(str: string): string {
  const d = parseDate(str);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(str: string): string {
  const d = parseDate(str);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Returns a human-readable due date label.
 * - "Due Today"         → due today
 * - "X days overdue"    → overdue by more than 7 days
 * - formatted date      → everything else
 */
export function dueDateLabel(dueStr: string): { label: string; variant: 'today' | 'overdue' | 'future' | 'normal' } {
  const t   = today();
  const due = parseDate(dueStr);
  const diff = diffDays(due, t); // positive = in future, negative = past

  if (diff === 0) return { label: 'Due Today', variant: 'today' };
  if (diff < -7)  return { label: `${Math.abs(diff)}d overdue`, variant: 'overdue' };
  if (diff < 0)   return { label: formatDateShort(dueStr), variant: 'overdue' };
  return { label: formatDateShort(dueStr), variant: 'normal' };
}

export function isOverdue(dueStr: string): boolean {
  return parseDate(dueStr) < today();
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}