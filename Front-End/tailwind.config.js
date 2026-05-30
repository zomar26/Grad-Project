/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* Custom color palette for the project */
      colors: {
        'brand-teal': '#008080',     // Main theme color
        'brand-bg': '#e0f7f7',       // Section background color
        'dark-navy': '#0b1c24',      // Headings and text color
      },

      /* Global container configuration for consistent spacing */
      container: {
        center: true, 
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          md: '4rem',
          lg: '6rem',
          xl: '10rem',
          '2xl': '12rem',
        },
      },

      /* Custom animations */
      animation: {
        'spin-slow': 'spin 5s linear infinite',
        /* Adding the pulse animation here to use it as a Tailwind class */
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}