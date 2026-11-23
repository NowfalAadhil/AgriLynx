/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#173B2A',
        brand: { DEFAULT: '#2D6A4F', 600: '#265a43' },
        accent: '#65A879',
        tint: '#E8F3EA',
        page: '#F6F8F5',
        ink: '#1B2921',
        muted: '#718078',
        line: '#E1E7E0',
        warn: { DEFAULT: '#E7A543', soft: '#FBF1DD', ink: '#7A4E08' },
        danger: { DEFAULT: '#D85D5D', soft: '#FAE8E8', ink: '#9B2F2F' },
        info: { DEFAULT: '#5687C5', soft: '#E6EEF8', ink: '#2F5A8F' },
      },
      fontFamily: { sans: ['Inter Variable', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      borderRadius: { card: '10px' },
      boxShadow: { card: '0 1px 2px rgba(23,59,42,0.05)' },
    },
  },
  plugins: [],
}
