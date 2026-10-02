/** @type {import('tailwindcss').Config} */
const color = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: color("background"),
        foreground: color("foreground"),
        card: { DEFAULT: color("card"), foreground: color("card-foreground") },
        popover: { DEFAULT: color("popover"), foreground: color("popover-foreground") },
        primary: {
          DEFAULT: color("primary"),
          foreground: color("primary-foreground"),
          text: color("primary-text"),
        },
        secondary: { DEFAULT: color("secondary"), foreground: color("secondary-foreground") },
        muted: { DEFAULT: color("muted"), foreground: color("muted-foreground") },
        accent: { DEFAULT: color("accent"), foreground: color("accent-foreground") },
        destructive: { DEFAULT: color("destructive"), foreground: color("destructive-foreground") },
        border: color("border"),
        input: color("input"),
        ring: color("ring"),
        chart: {
          1: color("chart-1"),
          2: color("chart-2"),
          3: color("chart-3"),
          4: color("chart-4"),
          5: color("chart-5"),
        },
        sidebar: {
          DEFAULT: color("sidebar"),
          foreground: color("sidebar-foreground"),
          primary: color("sidebar-primary"),
          "primary-foreground": color("sidebar-primary-foreground"),
          accent: color("sidebar-accent"),
          "accent-foreground": color("sidebar-accent-foreground"),
          border: color("sidebar-border"),
          ring: color("sidebar-ring"),
        },
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      fontFamily: {
        sans: ["Montserrat"],
        montserrat: ["Montserrat"],
        display: ["Caprasimo"],
      },
    },
  },
};
