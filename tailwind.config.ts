import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/tags/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage:{
        "main-body":"linear-gradient(0deg, #060C28, #060C28),radial-gradient(71.98% 42.02% at 50.62% 40.39%, rgba(0, 56, 255, 0.15) 0%, rgba(7, 13, 41, 0.15) 100%)",
        "main-header":"linear-gradient(90deg, rgba(26, 30, 47, 0.3) 0%, rgba(25, 32, 61, 0.3) 100%)",
        "main-radial-popup":"linear-gradient(0deg, #060C28, #060C28),radial-gradient(71.98% 42.02% at 50.62% 40.39%, rgba(0, 56, 255, 0.15) 0%, rgba(7, 13, 41, 0.15) 100%)",
      },

      colors: {
        "main-blue": "#426AFA",
        "main-gray": "#F4F4F4",
        "main-green": "#005E0F",
        "main-dark-gray": "#5B5B5B",
      },
      
    },
  },
  plugins: [],
}
export default config
