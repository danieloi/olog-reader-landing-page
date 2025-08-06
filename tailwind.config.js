/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        1: "0.5rem", // 8px
        2: "1rem", // 16px
        3: "1.5rem", // 24px
        4: "2rem", // 32px
        5: "2.5rem", // 40px
        6: "3rem", // 48px
        7: "3.5rem", // 56px
        8: "4rem", // 64px
        9: "4.5rem", // 72px
        10: "5rem", // 80px
        12: "6rem", // 96px
        14: "7rem", // 112px
        16: "8rem", // 128px
        18: "9rem", // 144px
        20: "10rem", // 160px
      },
      colors: {
        // Primary Blue Scale
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        // Accent Orange Scale
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        // Gray Scale
        gray: {
          50: "var(--gray-50)",
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        },
        // Semantic Colors
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
        white: "var(--white)",
        black: "var(--black)",
        // Background Colors
        background: {
          DEFAULT: "var(--background)",
          hero: "var(--background-hero)",
          header: "var(--background-header)",
          content: "var(--background-content)",
          white: "var(--background-white)",
          card: "var(--background-card)",
          "gradient-hero": "var(--background-gradient-hero)",
        },
        // Button Colors
        button: {
          primary: "var(--button-primary)",
          secondary: "var(--button-secondary)",
          "hover-primary": "var(--button-hover-primary)",
          "hover-secondary": "var(--button-hover-secondary)",
        },
        // Text Colors
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          light: "var(--text-light)",
        },
        // Legacy Compatibility
        foreground: "var(--foreground)",
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "General Sans", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "Times", "serif"],
      },
      fontSize: {
        h1: [
          "var(--text-h1)",
          { lineHeight: "1.2", fontWeight: "var(--font-weight-semibold)" },
        ],
        h2: [
          "var(--text-h2)",
          { lineHeight: "1.3", fontWeight: "var(--font-weight-medium)" },
        ],
        body: [
          "var(--text-body)",
          { lineHeight: "1.6", fontWeight: "var(--font-weight-normal)" },
        ],
        caption: [
          "var(--text-caption)",
          { lineHeight: "1.4", fontWeight: "var(--font-weight-normal)" },
        ],
      },
      fontWeight: {
        light: "var(--font-weight-light)",
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-up": "slideUp 0.8s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
