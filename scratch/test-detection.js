const { detectContentType } = require('/home/mohamed-elgedawy/Projects/Blue Whale/whale-tanks/whale-tanks/src/features/main/ai/utils/code-detection');

const bashCode = `# Create a new React project with TypeScript
npx create-react-app login-app --template typescript
cd login-app

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui (follow setup instructions)
npx shadcn-ui@latest init

# Install shadcn components we'll need
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add label
npx shadcn-ui@latest add toast`;

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  }
}`;

console.log("Bash Code Detection:", detectContentType(bashCode));
console.log("Tailwind Config Detection:", detectContentType(tailwindConfig));
