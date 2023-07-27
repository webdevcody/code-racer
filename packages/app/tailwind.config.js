/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "560px",
      },
      fontFamily: {
        special: ["var(--font-bruno-ace-sc)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        monochrome: {
          DEFAULT: "hsl(var(--monochrome-color))",
          "with-bg-opacity":
            "hsla(var(--monochrome-color) / var(--tw-bg-opacity))",
          "with-text-opacity":
            "hsla(var(--monochrome-color) / var(--tw-text-opacity))",
          "with-border-opacity":
            "hsla(var(--monochrome-color) / var(--tw-border-opacity))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning-dark))",
          200: "hsl(var(--warning-light))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "gear-rotate-left": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gear-rotate-right": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        dash: {
          "0%": { transform: "translate(2539.6383913420013px, 0)" },
          "100%": { transform: "translate(-2539.6383913420013px, 0)" },
        },
        blink: {
          "0%": { background: "hsl(var(--warning-light))", color: "#878c8e" },
          "50%": { background: "transparent" },
          "100%": { background: "hsl(var(--warning-light))", color: "#878c8e" },
        },
        fade: {
          "0%": { opacity: 0.5 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gear-rotate-left": "gear-rotate-left 5s linear infinite",
        "gear-rotate-right": "gear-rotate-right 5s linear infinite",
        dash: "dash linear infinite",
        blink: "blink 1.5s ease infinite",
        fade: "fade 1s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
