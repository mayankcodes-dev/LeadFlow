'use client';

interface ProgressBarProps {
  progress: number;
  label?: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full animate-fade-in space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-[--text-secondary] font-medium">{label}</span>
          <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--accent)' }}>
            {Math.round(progress)}%
          </span>
        </div>
      )}
      {/* Track */}
      <div className="w-full h-1 rounded-full bg-[--border] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #ff6a00, #ff9a44)',
            boxShadow: '0 0 8px rgba(255,106,0,0.5)',
          }}
        />
      </div>
    </div>
  );
}
