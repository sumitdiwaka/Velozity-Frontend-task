import type { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Arjun Sharma',   color: '#5b7cff' },
  { id: 'u2', name: 'Priya Mehta',    color: '#f7c948' },
  { id: 'u3', name: 'Rohan Verma',    color: '#4ade80' },
  { id: 'u4', name: 'Sneha Kapoor',   color: '#ff4d6d' },
  { id: 'u5', name: 'Dev Anand',      color: '#c084fc' },
  { id: 'u6', name: 'Kavya Nair',     color: '#ff8c42' },
];

const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

const TASK_PREFIXES = [
  'Implement', 'Fix', 'Refactor', 'Design', 'Review', 'Update',
  'Migrate', 'Optimize', 'Document', 'Test', 'Deploy', 'Integrate',
  'Audit', 'Create', 'Build', 'Configure', 'Analyse', 'Debug',
  'Improve', 'Validate',
];

const TASK_SUBJECTS = [
  'authentication flow', 'dashboard layout', 'API endpoints', 'database schema',
  'payment gateway', 'user onboarding', 'email templates', 'search functionality',
  'notification system', 'file upload module', 'caching layer', 'CI/CD pipeline',
  'error boundaries', 'form validation', 'accessibility audit', 'dark mode support',
  'unit test coverage', 'performance metrics', 'rate limiter', 'webhook handlers',
  'OAuth integration', 'billing module', 'analytics pipeline', 'export feature',
  'drag-and-drop UI', 'infinite scroll', 'multi-language support', 'audit logs',
  'session management', 'CSV import tool', 'PDF report generator', 'role permissions',
  'mobile responsiveness', 'A/B testing framework', 'data migration script',
  'SSO integration', 'chart components', 'modal system', 'keyboard shortcuts',
  'bulk operations', 'custom hooks', 'context providers', 'service workers',
  'image compression', 'lazy loading', 'code splitting', 'bundle optimisation',
  'TypeScript migration', 'GraphQL schema', 'REST client', 'websocket events',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function offsetDate(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function generateTasks(count: number = 520): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const prefix  = randomItem(TASK_PREFIXES);
    const subject = randomItem(TASK_SUBJECTS);
    const title   = `${prefix} ${subject}`;

    const priority: Priority = randomItem(PRIORITIES);
    const status: Status     = randomItem(STATUSES);
    const assigneeId         = randomItem(USERS).id;

    // Due date: spread across -30 to +60 days from today
    // Include a healthy chunk of overdue tasks
    const dueDaysOffset = randomInt(-30, 60);
    const dueDate = offsetDate(today, dueDaysOffset);

    // Start date: 5-20 days before due date, but sometimes missing
    const hasStartDate = Math.random() > 0.15; // ~85% have start dates
    let startDate: string | null = null;
    if (hasStartDate) {
      const startOffset = randomInt(5, 20);
      startDate = offsetDate(new Date(dueDate), -startOffset);
    }

    tasks.push({
      id: `task-${i + 1}`,
      title,
      status,
      priority,
      assigneeId,
      startDate,
      dueDate,
    });
  }

  // Make sure we have a decent spread of edge cases
  // Force some tasks with today as due date
  for (let i = 0; i < 8; i++) {
    tasks[i].dueDate = offsetDate(today, 0);
  }

  // Force some tasks that are >7 days overdue
  for (let i = 8; i < 20; i++) {
    tasks[i].dueDate = offsetDate(today, -randomInt(8, 25));
    tasks[i].status  = randomItem(['todo', 'in-progress'] as Status[]);
  }

  // Force some tasks with no start date
  for (let i = 20; i < 30; i++) {
    tasks[i].startDate = null;
  }

  return tasks;
}

export const ALL_TASKS = generateTasks(520);