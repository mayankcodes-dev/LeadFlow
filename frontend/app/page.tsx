'use client';

import { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import UploadZone from '@/components/UploadZone';
import CSVPreviewTable from '@/components/CSVPreviewTable';
import ResultsTable from '@/components/ResultsTable';
import ProgressBar from '@/components/ProgressBar';
import StatsBar from '@/components/StatsBar';
import ThemeToggle from '@/components/ThemeToggle';
import { parseCSVFile } from '@/lib/csvParser';
import { importCSV } from '@/lib/api';
import { ParsedCSV, ImportResult } from '@/types/crm';

type Step = 'upload' | 'preview' | 'processing' | 'results';

const STEP_CONFIG = [
  { id: 'upload',     label: 'Upload',     num: 1 },
  { id: 'preview',    label: 'Preview',    num: 2 },
  { id: 'processing', label: 'Processing', num: 3 },
  { id: 'results',    label: 'Results',    num: 4 },
] as const;

export default function HomePage() {
  const [step, setStep]             = useState<Step>('upload');
  const [file, setFile]             = useState<File | null>(null);
  const [parsedCSV, setParsedCSV]   = useState<ParsedCSV | null>(null);
  const [results, setResults]       = useState<ImportResult | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [progress, setProgress]     = useState(0);
  const [progressLabel, setProgressLabel] = useState('');

  const handleFileSelected = useCallback(async (selectedFile: File) => {
    setError(null);
    setFile(selectedFile);
    try {
      const parsed = await parseCSVFile(selectedFile);
      if (parsed.rows.length === 0) { setError('The CSV file has no data rows.'); return; }
      setParsedCSV(parsed);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse CSV file.');
    }
  }, []);

  const handleConfirmImport = async () => {
    if (!file) return;
    setStep('processing');
    setError(null);
    setProgress(10);
    setProgressLabel('Uploading CSV...');

    const interval = setInterval(() => {
      setProgress(p => p >= 85 ? p : p + Math.random() * 7);
    }, 900);

    try {
      setProgressLabel('AI is mapping CRM fields...');
      const result = await importCSV(file);
      clearInterval(interval);
      setProgress(100);
      setProgressLabel('Extraction complete');
      setTimeout(() => { setResults(result); setStep('results'); }, 600);
    } catch (e) {
      clearInterval(interval);
      setError(e instanceof Error ? e.message : 'Import failed. Please try again.');
      setStep('preview');
    }
  };

  const handleReset = () => {
    setStep('upload'); setFile(null); setParsedCSV(null);
    setResults(null); setError(null); setProgress(0); setProgressLabel('');
  };

  const currentStepIndex = STEP_CONFIG.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-[--bg-base] text-[--text-primary]">

      {/* ── Subtle radial glow backdrop (Grok-style) ── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,106,0,0.06)_0%,transparent_70%)]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[--border] bg-[--bg-base]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/logo.png" alt="LeadFlow logo" fill className="object-contain" />
            </div>
            <span className="text-base font-semibold tracking-tight text-[--text-primary]">
              Lead<span className="text-[--accent]">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mayankcodes-dev/LeadFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-[--text-secondary] hover:text-[--text-primary] transition-colors border border-[--border] rounded-lg px-3 py-1.5 hover:border-[--border-strong]"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-12 space-y-12">

        {/* ── Hero ── */}
        <section className="text-center space-y-5 animate-fade-in">
          <div className="inline-flex items-center gap-2 border border-[--border] bg-[--bg-surface] rounded-full px-3.5 py-1.5 text-xs font-medium text-[--text-secondary]">
            <span className="w-1.5 h-1.5 rounded-full bg-[--accent] animate-pulse" />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[--text-primary] leading-[1.1]">
            Import any CSV into<br />
            <span className="text-[--accent]">GrowEasy CRM</span>
          </h1>

          <p className="text-base text-[--text-secondary] max-w-lg mx-auto leading-relaxed">
            Upload CSV files from Facebook, Google Ads, Excel, or any custom format.
            AI automatically extracts and maps fields — no manual column matching needed.
          </p>
        </section>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {STEP_CONFIG.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${idx < currentStepIndex
                    ? 'bg-[--accent] text-white'
                    : idx === currentStepIndex
                    ? 'bg-[--accent] text-white ring-4 ring-[--accent-glow]'
                    : 'bg-[--bg-elevated] text-[--text-muted] border border-[--border]'
                  }
                `}>
                  {idx < currentStepIndex
                    ? <CheckCircle2 className="w-3.5 h-3.5" />
                    : s.num
                  }
                </div>
                <span className={`text-xs font-medium hidden sm:block transition-colors ${
                  idx === currentStepIndex ? 'text-[--text-primary]' : 'text-[--text-muted]'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < STEP_CONFIG.length - 1 && (
                <div className={`w-8 sm:w-14 h-px transition-colors duration-300 ${
                  idx < currentStepIndex ? 'bg-[--accent]' : 'bg-[--border]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Main Card ── */}
        <div className="bg-[--bg-surface] border border-[--border] rounded-2xl overflow-hidden shadow-grok">
          <div className="p-6 sm:p-8 space-y-7">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Step 1 — Upload */}
            {(step === 'upload' || step === 'preview') && (
              <div className="space-y-2">
                <SectionLabel num={1} label="Upload CSV File" />
                <UploadZone onFileSelected={handleFileSelected} disabled={step === 'preview'} />
              </div>
            )}

            {/* Step 2 — Preview */}
            {step === 'preview' && parsedCSV && (
              <>
                <Divider />
                <div className="space-y-2">
                  <SectionLabel num={2} label="Preview Data" />
                  <CSVPreviewTable headers={parsedCSV.headers} rows={parsedCSV.rows} />
                </div>

                <Divider />
                <div className="space-y-4">
                  <SectionLabel num={3} label="Confirm Import" />
                  <p className="text-sm text-[--text-secondary]">
                    Ready to process <span className="font-semibold text-[--text-primary]">{parsedCSV.rows.length} rows</span> with AI field extraction.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleConfirmImport}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[--accent] hover:bg-[--accent-hover] text-white font-semibold rounded-xl transition-all text-sm shadow-accent hover:shadow-lg active:scale-[0.98]"
                    >
                      <Sparkles className="w-4 h-4" />
                      Confirm & Import with AI
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 border border-[--border] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--border-strong] rounded-xl transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3 — Processing */}
            {step === 'processing' && (
              <div className="py-12 space-y-8 animate-fade-in">
                <div className="flex flex-col items-center gap-5 text-center">
                  {/* Animated Grok-style icon */}
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-2xl border border-[--accent]/30 animate-spin-slow" />
                    <div className="absolute inset-2 rounded-xl border border-[--accent]/50 animate-spin-slow [animation-direction:reverse]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[--accent]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[--text-primary]">Processing your CSV</h3>
                    <p className="text-sm text-[--text-secondary] mt-1">Gemini AI is extracting CRM fields from your data</p>
                  </div>
                </div>
                <ProgressBar progress={progress} label={progressLabel} />
              </div>
            )}

            {/* Step 4 — Results */}
            {step === 'results' && results && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[--text-primary]">Import Complete</p>
                      <p className="text-xs text-[--text-muted]">AI extraction finished</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 border border-[--border] text-[--text-secondary] hover:text-[--text-primary] hover:border-[--border-strong] rounded-xl transition-all text-xs font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Import Another
                  </button>
                </div>

                <StatsBar totalImported={results.totalImported} totalSkipped={results.totalSkipped} />

                <Divider />
                <div className="space-y-3">
                  <SectionLabel num={4} label="Extracted CRM Records" />
                  <ResultsTable imported={results.imported} skipped={results.skipped} />
                </div>
              </>
            )}

          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-xs text-[--text-muted] pb-8 space-y-1">
          <p>Built for <span className="text-[--text-secondary]">GrowEasy</span> · Powered by <span className="text-[--accent]">Google Gemini</span></p>
          <p>
            <a href="https://github.com/mayankcodes-dev/LeadFlow" target="_blank" rel="noopener noreferrer"
               className="link-hover hover:text-[--accent] transition-colors">
              github.com/mayankcodes-dev/LeadFlow
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

/* ── Tiny helpers ── */
function SectionLabel({ num, label }: { num: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-5 h-5 rounded-full bg-[--accent]/10 border border-[--accent]/30 text-[--accent] text-[10px] font-bold flex items-center justify-center">
        {num}
      </span>
      <span className="text-sm font-semibold text-[--text-secondary] tracking-wide uppercase text-[11px]">{label}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-[--border]" />;
}
