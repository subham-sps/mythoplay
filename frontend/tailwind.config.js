/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        mythic: {
          gold: '#fbbf24',
          saffron: '#fb923c',
          peacock: '#06b6d4',
          lotus: '#ec4899',
          sky: '#38bdf8',
          ink: '#1f2937',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#fff7ed',
          sunken: '#fef3c7',
        },
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'fun': '0 10px 30px -5px rgba(249, 115, 22, 0.35)',
        'card': '0 4px 20px rgba(17, 24, 39, 0.06)',
        'card-hover': '0 10px 30px rgba(17, 24, 39, 0.1)',
        'pop': '0 18px 40px -12px rgba(217, 70, 239, 0.35)',
        'soft': '0 2px 8px rgba(17, 24, 39, 0.05)',
        'inner-soft': 'inset 0 1px 2px rgba(17, 24, 39, 0.04)',
      },
      backgroundImage: {
        'brand-sunset': 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fce7f3 100%)',
        'brand-hero': 'radial-gradient(1000px 600px at 0% 0%, rgba(253,186,116,0.35), transparent 60%), radial-gradient(800px 500px at 100% 0%, rgba(244,114,182,0.3), transparent 60%), radial-gradient(700px 500px at 50% 100%, rgba(56,189,248,0.25), transparent 60%)',
      },
    },
  },
  plugins: [],
}
