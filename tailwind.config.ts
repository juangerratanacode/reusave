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
        // Resuelve brand colors
        brand: {
          coral: '#EF4D28',    // Primary CTA, isotipo checkmark
          'coral-dark': '#D43D1E',
          verde: '#22A45D',    // Prices, success, secondary
          'verde-dark': '#1A8249',
          tinta: '#0F1B13',    // Dark background variant
          papel: '#F0EDE6',    // Light background / cream
        },
        // Superficie oscura
        surface: {
          DEFAULT: '#0f0f0f',
          card: '#1a1a1a',
          border: '#2a2a2a',
          input: '#222222',
        },
        // Legacy (keep for backward compat)
        neon: {
          green: '#22A45D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand-coral': '0 0 20px rgba(239, 77, 40, 0.3)',
        'brand-verde': '0 0 20px rgba(34, 164, 93, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
