/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'handwriting': ['Caveat', 'cursive'],
        'indie': ['Indie Flower', 'cursive'],
        'patrick': ['Patrick Hand', 'cursive'],
        'cookie': ['Cookie', 'cursive'],
        'dancing': ['Dancing Script', 'cursive'],
        'gloria': ['Gloria Hallelujah', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
        'quicksand': ['Quicksand', 'sans-serif'],
        'comfortaa': ['Comfortaa', 'sans-serif'],
      },
      colors: {
        lavender: {
          50: '#faf7ff',
          100: '#f4eeff',
          200: '#e9deff',
          300: '#d6c1ff',
          400: '#bb97ff',
          500: '#9d6bff',
          600: '#8b47ff',
          700: '#7c2dff',
          800: '#6b1fff',
          900: '#5a0fff',
        },
        blush: {
          50: '#fef7f7',
          100: '#fef0f0',
          200: '#fcdde6',
          300: '#f9b9ce',
          400: '#f587a8',
          500: '#ef4f81',
          600: '#e11d48',
          700: '#be1237',
          800: '#9f1239',
          900: '#881337',
        },
        mint: {
          50: '#f0fdf9',
          100: '#e0f8f1',
          200: '#c1f0e1',
          300: '#8ce2c6',
          400: '#4fd0a7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-up': 'floatUp 8s linear infinite',
        'sparkle': 'sparkle 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'aurora': 'aurora 15s ease infinite',
        'moon-rotate': 'moonRotate 20s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(5deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-3deg)' },
          '75%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        floatUp: {
          '0%': { 
            transform: 'translateY(100vh) scale(0) rotate(0deg)', 
            opacity: '0' 
          },
          '10%': { 
            opacity: '1', 
            transform: 'translateY(90vh) scale(0.5) rotate(45deg)' 
          },
          '90%': { 
            opacity: '1', 
            transform: 'translateY(-10vh) scale(1) rotate(315deg)' 
          },
          '100%': { 
            transform: 'translateY(-20vh) scale(0) rotate(360deg)', 
            opacity: '0' 
          },
        },
        sparkle: {
          '0%, 100%': { 
            transform: 'scale(0) rotate(0deg)', 
            opacity: '0' 
          },
          '50%': { 
            transform: 'scale(1) rotate(180deg)', 
            opacity: '1' 
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(5deg)' },
          '75%': { transform: 'rotate(-5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
            transform: 'scale(1.02)'
          },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        moonRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
};