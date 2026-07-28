/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D9412A', // Terracotta Red
          hover: '#C2351E',
          dark: '#B02C17',
        },
        cream: {
          DEFAULT: '#F9E9C7', // Warm Cream
          light: '#FFF6E3',
          dark: '#EBD6AC',
        },
        dark: {
          DEFAULT: '#2B1810', // Deep Dark Brown
          muted: '#4A3226',
        },
        accent: {
          DEFAULT: '#F2B705', // Mustard Yellow
          hover: '#DDA604',
        }
      },
      fontFamily: {
        heading: ['"Baloo 2"', 'Poppins', 'sans-serif'],
        body: ['"Work Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'bounce-subtle': 'bounceSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(242, 183, 5, 0.4)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 20px 8px rgba(242, 183, 5, 0.6)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
