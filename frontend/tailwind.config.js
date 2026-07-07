/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Grok-inspired palette */
        grok: {
          black:   '#000000',
          surface: '#0d0d0d',
          elevated:'#161616',
          border:  'rgba(255,255,255,0.06)',
        },
        accent: {
          DEFAULT: '#ff6a00',
          hover:   '#ff8533',
          glow:    'rgba(255,106,0,0.12)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease forwards',
        'slide-up':   'fadeUp 0.4s ease forwards',
        'pulse-soft': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
        'shimmer':    'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:    { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(255,106,0,0.12)' }, '50%': { boxShadow: '0 0 20px 4px rgba(255,106,0,0.12)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      },
      boxShadow: {
        'grok':       '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'grok-hover': '0 4px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.10)',
        'accent':     '0 0 20px rgba(255,106,0,0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
