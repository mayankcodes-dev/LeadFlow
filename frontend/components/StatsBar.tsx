'use client';

interface StatsBarProps {
  totalImported: number;
  totalSkipped: number;
}

export default function StatsBar({ totalImported, totalSkipped }: StatsBarProps) {
  const total = totalImported + totalSkipped;
  const successRate = total > 0 ? Math.round((totalImported / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3 animate-slide-up">
      {/* Imported */}
      <div className="bg-[--bg-elevated] border border-emerald-500/20 rounded-xl px-4 py-3.5 space-y-1">
        <p className="text-2xl font-bold tabular-nums text-emerald-400">{totalImported}</p>
        <p className="text-[11px] text-[--text-muted] font-medium uppercase tracking-wide">Imported</p>
      </div>

      {/* Skipped */}
      <div className="bg-[--bg-elevated] border border-red-500/15 rounded-xl px-4 py-3.5 space-y-1">
        <p className="text-2xl font-bold tabular-nums text-red-400">{totalSkipped}</p>
        <p className="text-[11px] text-[--text-muted] font-medium uppercase tracking-wide">Skipped</p>
      </div>

      {/* Success rate */}
      <div className="bg-[--bg-elevated] border border-[--accent]/15 rounded-xl px-4 py-3.5 space-y-1">
        <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--accent)' }}>{successRate}%</p>
        <p className="text-[11px] text-[--text-muted] font-medium uppercase tracking-wide">Success</p>
      </div>
    </div>
  );
}
