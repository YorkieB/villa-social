/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['src/pages/**/*.tsx', 'src/components/**/*.tsx'],
  theme: {
    screens: {
      xs: '500px',
      ...defaultTheme.screens
    },
    extend: {
      /* ── Typography ── */
      fontFamily: {
        satoshi: ['Satoshi', 'Inter', 'sans-serif'],
        // Keep legacy aliases so existing className usage still resolves
        inter: ['Satoshi', 'Inter', 'sans-serif'],
        'twitter-chirp': ['Satoshi', 'sans-serif'],
        'twitter-chirp-extended': ['Satoshi', 'sans-serif']
      },

      fontSize: {
        'display': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
        'subheading': ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.015em', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.55', letterSpacing: '-0.01em' }],
        'caption': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0' }]
      },

      /* ── Colour tokens ── */
      // prettier-ignore
      colors: {
        /* CSS-var-backed dynamic tokens */
        'main-background':        'rgb(var(--main-background) / <alpha-value>)',
        'dim-background':         'rgb(var(--dim-background) / <alpha-value>)',
        'main-search-background': 'rgb(var(--main-search-background) / <alpha-value>)',
        'main-sidebar-background':'rgb(var(--main-sidebar-background) / <alpha-value>)',
        'main-accent':            'rgb(var(--main-accent) / <alpha-value>)',
        'main-accent-hover':      'rgb(var(--accent-teal-hover) / <alpha-value>)',

        /* Accent palette */
        'accent-teal':   'rgb(var(--accent-teal) / <alpha-value>)',
        'accent-yellow': 'rgb(var(--accent-yellow) / <alpha-value>)',
        'accent-blue':   'rgb(var(--accent-blue) / <alpha-value>)',
        'accent-pink':   'rgb(var(--accent-pink) / <alpha-value>)',
        'accent-purple': 'rgb(var(--accent-purple) / <alpha-value>)',
        'accent-orange': 'rgb(var(--accent-orange) / <alpha-value>)',
        'accent-green':  'rgb(var(--accent-green) / <alpha-value>)',
        'accent-red':    '#F4212E',

        /* Semantic */
        'color-error':   'rgb(var(--color-error) / <alpha-value>)',
        'color-success': 'rgb(var(--color-success) / <alpha-value>)',
        'color-warning': 'rgb(var(--color-warning) / <alpha-value>)',

        /* Static text */
        'dark-primary':   '#CDCCCA',
        'dark-secondary': '#797876',
        'light-primary':  '#28251D',
        'light-secondary':'#646058',

        /* Borders */
        'dark-border':       '#393836',
        'light-border':      '#D4D1CA',
        'dark-line-reply':   '#393836',
        'light-line-reply':  '#D4D1CA',

        /* Misc */
        'twitter-icon':       '#D6D9DB',
        'image-preview-hover':'#272C30',
      },

      /* ── Spacing — 8px grid ── */
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
      },

      /* ── Border radius ── */
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      /* ── Box shadows ── */
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        'menu':   '0 8px 32px rgba(1,105,111,0.12), 0 2px 8px rgba(0,0,0,0.2)',
        'glow':   '0 0 20px rgba(1,105,111,0.25)',
      },

      /* ── Transitions ── */
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
    }
  },
  plugins: [
    ({ addVariant }) => {
      addVariant('inner', '& > *');
    }
  ]
};
