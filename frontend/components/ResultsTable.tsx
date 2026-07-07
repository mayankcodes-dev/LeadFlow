'use client';

import { CRMRecord, SkippedRecord } from '@/types/crm';
import { useState } from 'react';

const STATUS_STYLE: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  DID_NOT_CONNECT:     'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  BAD_LEAD:            'bg-red-500/10 text-red-400 border border-red-500/20',
  SALE_DONE:           'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

const CRM_COLUMNS: { key: keyof CRMRecord; label: string }[] = [
  { key: 'name',                        label: 'Name' },
  { key: 'email',                       label: 'Email' },
  { key: 'mobile_without_country_code', label: 'Mobile' },
  { key: 'country_code',                label: 'Code' },
  { key: 'company',                     label: 'Company' },
  { key: 'city',                        label: 'City' },
  { key: 'state',                       label: 'State' },
  { key: 'country',                     label: 'Country' },
  { key: 'crm_status',                  label: 'Status' },
  { key: 'data_source',                 label: 'Source' },
  { key: 'lead_owner',                  label: 'Owner' },
  { key: 'crm_note',                    label: 'Notes' },
  { key: 'created_at',                  label: 'Created' },
  { key: 'possession_time',             label: 'Possession' },
  { key: 'description',                 label: 'Description' },
];

interface ResultsTableProps {
  imported: CRMRecord[];
  skipped: SkippedRecord[];
}

export default function ResultsTable({ imported, skipped }: ResultsTableProps) {
  const [tab, setTab] = useState<'imported' | 'skipped'>('imported');

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Tab bar */}
      <div className="flex gap-1 bg-[--bg-elevated] rounded-xl p-1 w-fit border border-[--border]">
        {(['imported', 'skipped'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === t
                ? 'bg-[--bg-surface] text-[--text-primary] shadow-grok border border-[--border]'
                : 'text-[--text-muted] hover:text-[--text-secondary]'
            }`}
          >
            {t === 'imported' ? `✓ Imported (${imported.length})` : `⊘ Skipped (${skipped.length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[--border] overflow-hidden">
        <div className="overflow-auto max-h-96 scrollbar-thin">

          {/* Imported */}
          {tab === 'imported' && (
            imported.length === 0
              ? <Empty text="No records were imported." />
              : (
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[--bg-elevated]">
                      <th className="px-3 py-2.5 text-left text-[--text-muted] font-medium w-8 border-b border-[--border] border-r border-[--border]">#</th>
                      {CRM_COLUMNS.map(c => (
                        <th key={c.key} className="px-3 py-2.5 text-left text-[--text-secondary] font-semibold border-b border-[--border] border-r border-[--border] last:border-r-0 whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[--bg-surface] divide-y divide-[--border]">
                    {imported.map((record, idx) => (
                      <tr key={idx} className="hover:bg-[--bg-elevated] transition-colors">
                        <td className="px-3 py-2 text-[--text-muted] border-r border-[--border] text-center font-mono">{idx + 1}</td>
                        {CRM_COLUMNS.map(c => (
                          <td key={c.key}
                            className="px-3 py-2 text-[--text-primary] border-r border-[--border] last:border-r-0 whitespace-nowrap max-w-[160px] truncate"
                            title={record[c.key] || ''}
                          >
                            {c.key === 'crm_status' && record.crm_status
                              ? <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${STATUS_STYLE[record.crm_status] || 'bg-[--border] text-[--text-secondary]'}`}>
                                  {record.crm_status.replace(/_/g, ' ')}
                                </span>
                              : record[c.key] || <span className="text-[--text-muted] italic">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          )}

          {/* Skipped */}
          {tab === 'skipped' && (
            skipped.length === 0
              ? <Empty text="🎉 No records were skipped!" />
              : (
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[--bg-elevated]">
                      <th className="px-3 py-2.5 text-left text-[--text-muted] font-medium border-b border-[--border] border-r border-[--border] w-12">Row</th>
                      <th className="px-3 py-2.5 text-left text-[--text-secondary] font-semibold border-b border-[--border] border-r border-[--border]">Reason</th>
                      <th className="px-3 py-2.5 text-left text-[--text-secondary] font-semibold border-b border-[--border]">Raw Data</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[--bg-surface] divide-y divide-[--border]">
                    {skipped.map((record, idx) => (
                      <tr key={idx} className="hover:bg-red-500/5 transition-colors">
                        <td className="px-3 py-2 text-center text-[--text-muted] border-r border-[--border] font-mono">{record.row}</td>
                        <td className="px-3 py-2 text-red-400 border-r border-[--border] max-w-[200px] truncate" title={record.reason}>{record.reason}</td>
                        <td className="px-3 py-2 text-[--text-muted] font-mono max-w-[300px] truncate" title={JSON.stringify(record.data)}>
                          {JSON.stringify(record.data)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-sm text-[--text-muted]">{text}</div>
  );
}
