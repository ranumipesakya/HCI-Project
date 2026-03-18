export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode
        primary: '#2C3E50',
        secondary: '#F5F5F5',
        accent: '#A3C4BC',
        accentDark: '#7BA39E',
        
        // Dark Mode specific
        dark: {
          primary: '#1A1E24',
          secondary: '#2D333A',
          text: '#E5E7EB',
          muted: '#9CA3AF',
          border: '#3F454D',
          hover: '#4B5563',
        },
        sage: {
          light: '#A3C4BC',
          DEFAULT: '#86A789',
          dark: '#6B8B6D',
        },
        teal: {
          muted: '#4A7C7C',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(163, 196, 188, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(163, 196, 188, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
