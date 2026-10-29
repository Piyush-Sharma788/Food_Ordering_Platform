import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          dark: '#111111',
          surface: '#1a1a1a',
          muted: '#666666',
          border: '#e5e5e5',
          light: '#f5f5f5',
          white: '#ffffff',
          accent: '#0d9488', // refined cyan/teal accent echoing #17a
          accentLight: '#ccfbf1',
        },
      },
    },
  },
  plugins: [],
};

export default config;

