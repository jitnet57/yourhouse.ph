import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#001F3F',
        secondary: '#0074D9',
        accent: '#FFD700',
        success: '#2ECC40',
        warning: '#FF4136',
      },
    },
  },
  plugins: [],
}
export default config
