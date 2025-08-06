export const lightColors = {
  primary: {
    50: "#D9EFFF", // Light Blue Tint
    100: "#B3E0FF",
    200: "#8CCCFF",
    300: "#66B2FF",
    400: "#3399FF",
    500: "#007AFF", // Primary Blue
    600: "#0066CC",
    700: "#0051B5", // Dark Blue Shade
    800: "#003D99",
    900: "#002766",
  },

  // Added accent colors (orange)
  accent: {
    50: "#FFDAB3", // Light Orange Tint
    100: "#FFD19F",
    200: "#FFC07F",
    300: "#FFAF5F",
    400: "#FFA23F",
    500: "#FF9500", // Accent Orange
    600: "#E68600",
    700: "#CC7A00", // Dark Orange Shade
    800: "#B36B00",
    900: "#995C00",
  },

  // Updated grays
  gray: {
    50: "#F0F0F0", // Light Gray
    100: "#E0E0E0",
    200: "#CCCCCC",
    300: "#B3B3B3",
    400: "#999999",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333", // Text and Icon Dark Gray
    800: "#1A1A1A",
    900: "#0A0A0A",
    950: "#F0F2F7",
  },

  // Semantic colors
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  white: "#FFFFFF",
  black: "#000000",

  background: {
    hero: "#D9EFFF", // Light Blue Tint
    header: "#007AFF", // Primary Blue
    content: "#FFFFFF", // Background White
    white: "#FFFFFF",
    card: "#F0F0F0", // Light Gray
    gradientHero: "linear-gradient(to bottom, #D9EFFF 0%, #FFFFFF 100%)",
  },

  button: {
    primary: "#007AFF", // Primary Blue
    secondary: "#FF9500", // Accent Orange
    hover: {
      primary: "#0051B5", // Dark Blue Shade
      secondary: "#CC7A00", // Dark Orange Shade
    },
  },

  text: {
    primary: "#333333", // Text and Icon Dark Gray
    secondary: "#666666",
    light: "#FFFFFF",
  },
};

export const darkColors = {
  primary: {
    // Adjusted for dark mode - increased brightness
    50: "#0051B5",
    100: "#003D99",
    200: "#002766",
    300: "#1A56B3",
    400: "#3373D9",
    500: "#007AFF", // Primary Blue - keeping this the same
    600: "#3399FF",
    700: "#0051B5",
    800: "#8CCCFF",
    900: "#B3E0FF",
  },

  accent: {
    // Adjusted for dark mode - increased brightness
    50: "#995C00",
    100: "#B36B00",
    200: "#CC7A00",
    300: "#E68600",
    400: "#FF9500",
    500: "#FFA23F", // Brightened for dark mode visibility
    600: "#FFAF5F",
    700: "#FFC07F",
    800: "#FFD19F",
    900: "#FFDAB3",
  },

  gray: {
    // Inverted for dark mode
    50: "#0A0A0A",
    100: "#1A1A1A",
    200: "#333333",
    300: "#000000",
    400: "#666666",
    500: "#999999",
    600: "#B3B3B3",
    700: "#CCCCCC",
    800: "#E0E0E0",
    900: "#F0F0F0",
    950: "#252A35",
  },

  // Semantic colors
  success: "#4ade80", // Brighter for dark mode
  error: "#f87171", // Brighter for dark mode
  warning: "#fbbf24", // Brighter for dark mode
  white: "#FFFFFF",
  black: "#000000",

  background: {
    hero: "#001A33", // Darkened
    header: "#0051B5", // Darkened
    content: "#121212", // Dark background
    white: "#181818", // Not actually white in dark mode
    card: "#222222", // Dark card
    gradientHero: "linear-gradient(to bottom, #001A33 0%, #121212 100%)",
  },

  button: {
    primary: "#007AFF", // Keep consistent
    secondary: "#FFA23F", // Brightened for visibility
    hover: {
      primary: "#3399FF", // Lighter for hover in dark mode
      secondary: "#FFAF5F", // Lighter for hover in dark mode
    },
    preset: "#252A35",
  },

  text: {
    primary: "#FFFFFF", // Light text on dark background
    secondary: "#CCCCCC", // Light secondary text
    light: "#FFFFFF", // Keep light text white
  },
};

export type Colors = typeof lightColors;
