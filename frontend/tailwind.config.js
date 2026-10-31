/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        zeyada: ['"Zeyada"', 'cursive'],
      },
      colors: {
        ward: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        civic: {
          orange: '#ea580c',
          amber: '#d97706',
          dark: '#0f172a',
          card: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
