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
        // Neón verde para donaciones
        neon: {
          green: '#22c55e',
          'green-glow': '#16a34a',
        },
        // Naranja para ventas solidarias
        solidarity: {
          orange: '#f97316',
          'orange-dark': '#ea580c',
        },
        // Rojo urgente
        urgent: {
          red: '#ef4444',
        },
        // Superficie oscura
        surface: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          border: '#2a2a2a',
          input: '#222222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'neon-orange': '0 0 20px rgba(249, 115, 22, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
