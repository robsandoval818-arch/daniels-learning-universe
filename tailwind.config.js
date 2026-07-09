/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        obsidian: {
          950: '#05060a',
          900: '#0a0c14',
          800: '#12141f',
          700: '#1a1d2e',
        },
        aurora: {
          gold: '#f5c453',
          rose: '#f0577a',
          violet: '#8b6df5',
          cyan: '#4fd8e8',
          emerald: '#3ee0a8',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(245, 196, 83, 0.45)',
        'glow-violet': '0 0 40px -8px rgba(139, 109, 245, 0.5)',
        'glow-cyan': '0 0 40px -8px rgba(79, 216, 232, 0.5)',
        'inner-glass': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.08), transparent 60%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.85, filter: 'brightness(1.25)' },
        },
      },
    },
  },
  plugins: [],
}
