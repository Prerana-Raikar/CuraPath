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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        medical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Poppins', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'medical-fade-in': 'medicalFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'medical-slide-in': 'medicalSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'medical-scale-in': 'medicalScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'medical-slide-up': 'medicalSlideUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'medical-float': 'medicalFloat 3s ease-in-out infinite',
        'medical-pulse': 'medicalPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'medical-heartbeat': 'medicalHeartbeat 1.5s ease-in-out infinite',
        'medical-shimmer': 'medical-shimmer 2s ease-in-out infinite',
        'medical-glow': 'medicalGlow 2s ease-in-out infinite',
        'medical-spinner': 'medicalSpinner 1s linear infinite',
        'medical-dots': 'medicalDots 1.4s ease-in-out infinite',
        'medical-progress': 'medicalProgress 2s ease-out forwards',
        'medical-count-up': 'medicalCountUp 0.6s ease-out forwards',
      },
      keyframes: {
        medicalFadeIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(5px)'
          },
          '50%': { 
            opacity: '0.8',
            filter: 'blur(2px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0)'
          },
        },
        medicalSlideIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-40px) rotateY(-10deg)' 
          },
          '60%': { 
            opacity: '0.8', 
            transform: 'translateX(5px) rotateY(2deg)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0) rotateY(0)' 
          },
        },
        medicalScaleIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.8) rotate(-5deg)' 
          },
          '50%': { 
            opacity: '0.8', 
            transform: 'scale(1.05) rotate(1deg)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) rotate(0)' 
          },
        },
        medicalSlideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px) scale(0.95)' 
          },
          '60%': { 
            opacity: '0.9', 
            transform: 'translateY(-5px) scale(1.02)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        medicalFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        medicalPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        medicalHeartbeat: {
          '0%, 50%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '75%': { transform: 'scale(1.05)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        'medical': '0 20px 40px rgba(59, 130, 246, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'medical-lg': '0 25px 50px rgba(59, 130, 246, 0.2), 0 12px 24px rgba(0, 0, 0, 0.15)',
        'medical-xl': '0 35px 70px rgba(59, 130, 246, 0.25), 0 16px 32px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      transitionTimingFunction: {
        'medical': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'medical-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
}