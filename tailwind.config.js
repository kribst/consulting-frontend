/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#2e6061',
        'deep-blue': '#123A5A',
        gold: '#D6A84F',
        'soft-gold': '#F5E7C8',
        surface: '#F8FAFC',
        ink: '#172033',
        muted: '#64748B',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 39, 66, 0.10)',
        card: '0 14px 40px rgba(15, 39, 66, 0.08)',
      },
      fontFamily: {
        sans: ['Roboto', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
