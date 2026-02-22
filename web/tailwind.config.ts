import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neo Glow Theme Colors
        neon: {
          blue: '#00D9FF',
          purple: '#B026FF',
          pink: '#FF006E',
          green: '#00FF88',
          yellow: '#FFD60A',
        },
        dark: {
          bg: '#0A0E1A',
          surface: '#141824',
          border: '#1E2435',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F8F9FA',
          border: '#E5E7EB',
        },
      },
      boxShadow: {
        'neo-blue': '0 0 20px rgba(0, 217, 255, 0.5)',
        'neo-purple': '0 0 20px rgba(176, 38, 255, 0.5)',
        'neo-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'neo-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'glow-sm': '0 0 10px currentColor',
        'glow-md': '0 0 20px currentColor',
        'glow-lg': '0 0 30px currentColor',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 40px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
