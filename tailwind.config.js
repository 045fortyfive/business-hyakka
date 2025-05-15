/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            a: {
              color: '#0284c7',
              '&:hover': {
                color: '#0369a1',
              },
              textDecoration: 'none',
            },
            h1: {
              color: 'inherit',
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              color: 'inherit',
              fontWeight: '700',
              fontSize: '1.75rem',
              marginTop: '1.75rem',
              marginBottom: '0.75rem',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.25rem',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.5rem',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h5: {
              color: 'inherit',
              fontWeight: '600',
              fontSize: '1.125rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h6: {
              color: 'inherit',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1.5rem',
              lineHeight: '1.8',
            },
            ul: {
              marginTop: '1rem',
              marginBottom: '1.5rem',
              paddingLeft: '1.5rem',
            },
            ol: {
              marginTop: '1rem',
              marginBottom: '1.5rem',
              paddingLeft: '1.5rem',
            },
            li: {
              marginBottom: '0.5rem',
            },
            'li > ul, li > ol': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            code: {
              color: '#111827',
              backgroundColor: '#f3f4f6',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              color: '#4b5563',
              borderLeftColor: '#e5e7eb',
              borderLeftWidth: '4px',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            hr: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderColor: '#e5e7eb',
            },
            img: {
              borderRadius: '0.5rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            table: {
              width: '100%',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              borderCollapse: 'collapse',
            },
            'thead th': {
              borderBottom: '2px solid #e5e7eb',
              padding: '0.75rem',
              textAlign: 'left',
            },
            'tbody td': {
              borderBottom: '1px solid #e5e7eb',
              padding: '0.75rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
