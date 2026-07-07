import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LeadFlow — AI-Powered CSV Importer',
  description: 'Import any CSV format into GrowEasy CRM using AI field extraction. Powered by Google Gemini.',
  keywords: ['CRM', 'CSV importer', 'lead import', 'GrowEasy', 'AI', 'Gemini'],
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent dark mode flash */}
        <script dangerouslySetInnerHTML={{
          __html: `try{const t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(!t&&d))document.documentElement.classList.add('dark')}catch(e){}`
        }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
