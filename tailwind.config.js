/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        terracotta: {
          50: '#fdf5f0',
          100: '#fbe8dc',
          200: '#f6cdb8',
          300: '#f0ab89',
          400: '#e88258',
          500: '#e26434',
          600: '#c9462a',
          700: '#a83524',
          800: '#8b2e22',
          900: '#6d2a20',
          950: '#3b120e',
        },
        cream: {
          50: '#fffefb',
          100: '#fefcf3',
          200: '#fdf8e6',
          300: '#faf0d4',
          400: '#f5e4b8',
          500: '#edd49a',
          600: '#d4b56d',
          700: '#b08f4a',
          800: '#8d7139',
          900: '#6d5730',
          950: '#3d2f17',
        },
        olive: {
          50: '#f6f7ed',
          100: '#eaedd7',
          200: '#d7ddb3',
          300: '#bdc885',
          400: '#a4b25e',
          500: '#869740',
          600: '#687830',
          700: '#505c28',
          800: '#414b24',
          900: '#384022',
          950: '#1c220f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
