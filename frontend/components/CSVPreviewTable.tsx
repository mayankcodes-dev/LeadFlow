'use client';

interface CSVPreviewTableProps {
  headers: string[];
  rows: Record<string, string>[];
}

export default function CSVPreviewTable({ headers, rows }: CSVPreviewTableProps) {
  return (
    <div className="w-full animate-slide-up">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs text-[--text-muted]">
          {rows.length} rows · {headers.length} columns
          {rows.length > 100 && <span className="ml-1">(showing first 100)</span>}
        </span>
      </div>

      <div className="rounded-xl border border-[--border] overflow-hidden">
        <div className="overflow-auto max-h-72 scrollbar-thin">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[--bg-elevated]">
                <th className="px-3 py-2.5 text-left font-medium text-[--text-muted] w-8 border-b border-[--border] border-r border-[--border]">
                  #
                </th>
                {headers.map(h => (
                  <th key={h}
                    className="px-3 py-2.5 text-left font-semibold text-[--text-secondary] border-b border-[--border] border-r border-[--border] last:border-r-0 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-[--bg-surface] divide-y divide-[--border]">
              {rows.slice(0, 100).map((row, idx) => (
                <tr key={idx} className="hover:bg-[--bg-elevated] transition-colors">
                  <td className="px-3 py-2 text-[--text-muted] border-r border-[--border] text-center font-mono">
                    {idx + 1}
                  </td>
                  {headers.map(h => (
                    <td key={h}
                      className="px-3 py-2 text-[--text-primary] border-r border-[--border] last:border-r-0 whitespace-nowrap max-w-[180px] truncate"
                      title={row[h] || ''}>
                      {row[h] || <span className="text-[--text-muted] italic">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
