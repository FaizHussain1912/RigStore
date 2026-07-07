import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rig: {
          background: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          border: 'var(--color-border)',
          primary: 'var(--color-primary)',
          muted: 'var(--color-muted)',
          text: 'var(--color-text)'
        }
      }
    },
  },
  plugins: [],
};
export default config;
