import { useTaskStore } from '../../store/useTaskStore';
import { KanbanColumn } from './KanbanColumn';
import type { Status } from '../../types';

const COLUMNS: Status[] = ['todo', 'in-progress', 'in-review', 'done'];

export function KanbanBoard() {
  const { getFilteredTasks } = useTaskStore();
  const tasks = getFilteredTasks();

  return (
    <div className="flex gap-4 p-6 overflow-x-auto h-full">
      {COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
        />
      ))}
    </div>
  );
}