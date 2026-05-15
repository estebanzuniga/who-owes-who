/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // — Surfaces —
        cream: '#FAF1E4', // page background
        paper: '#F5E9D2', // alt background / cards on cream

        // — Sage (primary) —
        sage: {
          50: '#EFE8D8',
          100: '#CEDEBD', // your original
          200: '#B8CCA3',
          300: '#9EB384', // your original
          400: '#7A9266',
          500: '#5E7A4D',
          600: '#4E6A40',
          700: '#435334', // your original — primary button / chrome
          800: '#33402A',
          900: '#2A3520',
          950: '#1A2114',
        },

        // — Clay (accent — reserved for "owed" amounts, alerts) —
        clay: {
          50: '#FBEDE5',
          100: '#F4D6C8',
          200: '#EFCDBE',
          300: '#E0A992',
          400: '#D08869',
          500: '#C26B4D', // primary accent
          600: '#A8583E',
          700: '#9A4F36',
          800: '#7A3E2A',
          900: '#5E2F20',
        },

        // — Ink (text) —
        ink: {
          DEFAULT: '#262019', // body
          soft: '#7A6E5D', // secondary / labels
          mute: 'rgba(46,42,36,0.4)', // placeholder
        },

        // — Semantic —
        success: '#5E7A4D', // = sage-500
        warning: '#D08869', // = clay-400
        danger: '#C26B4D', // = clay-500
        owe: '#C26B4D', // clay — they owe you / you owe
        owed: '#435334', // sage — settled / positive
      },

      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },

      borderRadius: {
        // Variation A uses soft 12–16px, Variation B uses 4px
        card: '14px',
        sharp: '4px',
      },
    },
  },
  plugins: [],
}
