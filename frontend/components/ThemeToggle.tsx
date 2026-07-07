'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[--border] bg-[--bg-surface] hover:border-[--border-strong] hover:bg-[--bg-elevated] transition-all"
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark
        ? <Sun className="w-4 h-4 text-amber-400" />
        : <Moon className="w-4 h-4 text-[--text-secondary]" />
      }
    </button>
  );
}
