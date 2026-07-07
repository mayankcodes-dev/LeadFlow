'use client';

import { useCallback, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileSelected, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback((file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a valid CSV file (.csv)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }
    setSelectedFile(file);
    onFileSelected(file);
  }, [onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, [disabled, validateAndSet]);

  const clearFile = () => { setSelectedFile(null); setError(null); };

  return (
    <div className="w-full">
      <div
        onDragOver={e => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border rounded-xl p-8 text-center transition-all duration-200
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isDragging
            ? 'border-[--accent] bg-[--accent-glow] scale-[1.005]'
            : 'border-dashed border-[--border-strong] hover:border-[--accent]/50 bg-[--bg-elevated]'
          }
        `}
      >
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={e => { const f = e.target.files?.[0]; if (f) validateAndSet(f); e.target.value = ''; }}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        {selectedFile ? (
          <div className="flex items-center justify-center gap-4 animate-fade-in">
            <div className="p-2.5 bg-[--accent]/10 border border-[--accent]/20 rounded-lg">
              <FileText className="w-5 h-5 text-[--accent]" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[--text-primary]">{selectedFile.name}</p>
              <p className="text-xs text-[--text-muted] mt-0.5">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            {!disabled && (
              <button
                onClick={e => { e.stopPropagation(); clearFile(); }}
                className="p-1.5 rounded-lg hover:bg-[--border] text-[--text-muted] hover:text-[--text-primary] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className={`p-3.5 rounded-xl border transition-all ${isDragging ? 'border-[--accent]/40 bg-[--accent]/10' : 'border-[--border] bg-[--bg-surface]'}`}>
                <UploadCloud className={`w-7 h-7 transition-colors ${isDragging ? 'text-[--accent]' : 'text-[--text-muted]'}`} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[--text-primary]">Drop your CSV here</p>
              <p className="text-xs text-[--text-muted] mt-1">
                or <span className="text-[--accent] font-medium">browse files</span>
              </p>
            </div>
            <p className="text-[11px] text-[--text-muted]">
              Any CSV format · Max 10MB · Facebook, Google Ads, Excel &amp; more
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2.5 text-xs text-red-400 flex items-center gap-1.5 animate-fade-in">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
