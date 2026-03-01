import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B4F6C',
          50: '#E8F4F8',
          100: '#C5E4ED',
          200: '#9FD3E2',
          300: '#79C2D7',
          400: '#53B1CC',
          500: '#0B4F6C',
          600: '#094560',
          700: '#073B54',
          800: '#053148',
          900: '#03273C',
        },
        secondary: {
          DEFAULT: '#1FA2A6',
          50: '#E6F7F7',
          100: '#CCEFEF',
          200: '#99DFDF',
          300: '#66CFCF',
          400: '#33BFBF',
          500: '#1FA2A6',
          600: '#1A8A8D',
          700: '#157274',
          800: '#105A5B',
          900: '#0B4242',
        },
        accent: {
          DEFAULT: '#4CAF50',
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        background: '#FFFFFF',
        muted: '#F5F7FA',
        text: {
          primary: '#1F2933',
          secondary: '#52606D',
          muted: '#9AA5B1',
        },
        error: {
          DEFAULT: '#E53935',
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
          800: '#B71C1C',
          900: '#8B0000',
        },
        success: {
          DEFAULT: '#4CAF50',
          50: '#E8F5E9',
        },
        warning: {
          DEFAULT: '#FF9800',
          50: '#FFF3E0',
        },
      },
      fontFamily: {
        heading: ['Inter', 'Poppins', 'sans-serif'],
        body: ['Inter', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
