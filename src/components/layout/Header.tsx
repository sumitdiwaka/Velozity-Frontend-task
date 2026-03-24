import { useTaskStore } from '../../store/useTaskStore';
import type { ViewMode } from '../../types';

const VIEWS: { id: ViewMode; label: string; icon: string }[] = [
  { id: 'kanban',   label: 'Board',    icon: '⊞' },
  { id: 'list',     label: 'List',     icon: '≡' },
  { id: 'timeline', label: 'Timeline', icon: '▬' },
];

export function Header() {
  const { view, setView } = useTaskStore();

  return (
    <header
      className="flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-lg text-sm font-bold"
          style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #5b7cff 0%, #a78bfa 100%)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
          }}
        >
          VG
        </div>
        <div>
          <h1
            className="text-sm font-semibold leading-none"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Velozity
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Project Tracker
          </p>
        </div>
      </div>

      {/* View switcher */}
      <div
        className="flex items-center gap-1 p-1 rounded-lg"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all cursor-pointer"
            style={
              view === v.id
                ? {
                    backgroundColor: 'var(--color-surface-3)',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-border-light)',
                  }
                : {
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid transparent',
                  }
            }
          >
            <span>{v.icon}</span>
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}