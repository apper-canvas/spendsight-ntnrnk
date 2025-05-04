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
          DEFAULT: '#0070D2',  // SLDS Brand Primary Blue
          light: '#4BC076',    // SLDS Success Green
          dark: '#005FB2'      // SLDS Dark Blue
        },
        secondary: {
          DEFAULT: '#1589EE',  // SLDS Secondary Blue
          light: '#61C3F2',    // SLDS Light Blue
          dark: '#0F69B3'      // SLDS Darker Blue
        },
        accent: '#706E6B',     // SLDS Neutral Gray
        // SLDS Background Colors
        surface: {
          50: '#F3F2F2',       // SLDS Light Gray (lightest)
          100: '#EFEEED',      // SLDS Light Gray
          200: '#E4E2E0',      // SLDS Gray Medium
          300: '#D8D8D8',      // SLDS Gray Medium
          400: '#B0ADAB',      // SLDS Gray Medium
          500: '#969492',      // SLDS Gray Medium
          600: '#706E6B',      // SLDS Neutral Gray
          700: '#514F4D',      // SLDS Gray Dark
          800: '#292929',      // SLDS Gray Darker
          900: '#181818'       // SLDS Darkest (almost black)
        },
        // SLDS Specific Colors
        brand: {
          primary: '#0070D2',   // SLDS Brand Primary
          success: '#4BC076',   // SLDS Success
          warning: '#FFB75D',   // SLDS Warning
          error: '#D0021B',     // SLDS Error
          info: '#16325C',      // SLDS Info
        }      
      },
      fontFamily: {
        sans: ['Salesforce Sans', 'Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Salesforce Sans', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 2px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 2px 2px 0 rgba(0, 0, 0, 0.1)',
        'dropdown': '0 2px 3px 0 rgba(0, 0, 0, 0.16)',
        'focus': '0 0 3px #0070D2',
        'neu-light': '0 2px 2px 0 rgba(0, 0, 0, 0.1)',
        'neu-dark': '0 2px 2px 0 rgba(0, 0, 0, 0.2)'
      },
      borderRadius: {
        'xl': '0.25rem',
        '2xl': '0.5rem'
      }
    }  
  },
  plugins: [],
  darkMode: 'class',
}