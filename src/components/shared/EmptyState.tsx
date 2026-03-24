interface EmptyStateProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}

export function EmptyState({ title, subtitle, action, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center animate-fade-in">
      <span className="text-4xl opacity-40 select-none">{icon}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: 'rgba(91,124,255,0.12)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(91,124,255,0.25)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(91,124,255,0.2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(91,124,255,0.12)';
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}