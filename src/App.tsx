import { useTaskStore } from './store/useTaskStore'
import { useUrlFilters } from './hooks/useUrlFilters'
import { Header } from './components/layout/Header'
import { CollaborationBar } from './components/layout/CollaborationBar'
import { FilterBar } from './components/filters/FilterBar'
import { KanbanBoard } from './components/kanban/KanbanBoard'
import { ListView } from './components/listview/ListView'
import { TimelineView } from './components/timeline/TimelineView'

export default function App() {
  const { view } = useTaskStore()
  useUrlFilters()

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <CollaborationBar />
      <Header />
      <FilterBar />
      <main className="flex-1 overflow-hidden">
        {view === 'kanban'   && <KanbanBoard />}
        {view === 'list'     && <ListView />}
        {view === 'timeline' && <TimelineView />}
      </main>
    </div>
  )
}