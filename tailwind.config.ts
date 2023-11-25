import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/tags/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
