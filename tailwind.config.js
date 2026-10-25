/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#172B4D',
          950: '#0B172A',
        },
        brand: {
          navy: '#172B4D',
          blue: '#2563EB',
          bg: '#F3F5F8',
          card: '#FFFFFF',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
          textPrimary: '#172033',
          textSecondary: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(23, 43, 77, 0.05), 0 2px 4px -1px rgba(23, 43, 77, 0.03)',
        'elevated': '0 10px 15px -3px rgba(23, 43, 77, 0.08), 0 4px 6px -2px rgba(23, 43, 77, 0.04)',
      }
    },
  },
  plugins: [],
}
