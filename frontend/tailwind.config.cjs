module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: '#0b84ff',
        accent: '#ff6b6b',
        success: '#16a34a',
        brand: '#0ea5a4',
        'brand-dark': '#0f766e'
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px'
      },
      container: {
        center: true,
        padding: '1rem',
      }
    }
  },
  plugins: [],
}
