/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          200: '#C7CAFE',
          300: '#A4A8FD',
          400: '#7E81FB',
          500: '#5B4FE5', // Primary indigo-violet
          600: '#4C3ED4',
          700: '#3D2EB9',
          800: '#332795',
          900: '#2C2376',
        },
        navy: {
          900: '#0E1030', // Deep navy sidebar
          800: '#151842',
          700: '#1E2358',
          600: '#2A3075',
        },
        surface: '#FFFFFF',
        page: '#F6F7FB',
        ink: {
          DEFAULT: '#1B1D3A',
          muted: '#6B7090',
          subtle: '#9499B3',
          border: '#E3E6EE',
        },
        success: {
          DEFAULT: '#16A34A',
          soft: '#E7F7EC',
          border: '#BBF7D0',
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FEF3E2',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#EF4444',
          soft: '#FDECEC',
          border: '#FECACA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
        card: '0 4px 20px -2px rgba(16, 24, 40, 0.05)',
        hero: '0 20px 40px -15px rgba(91, 79, 229, 0.15)',
        glass: '0 8px 32px 0 rgba(14, 16, 48, 0.08)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
