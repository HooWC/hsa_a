// Color palette for the app
export const COLORS = {
  primary: '#1E88E5',   // Main blue color
  secondary: '#2196F3', // Lighter blue
  accent: '#0D47A1',    // Deep blue for accents
  gray: '#9E9E9E',      // Gray for secondary items
  darkGray: '#424242',  // Dark gray for text
  lightGray: '#E0E0E0', // Light gray for borders
  white: '#FFFFFF',     // White
  black: '#000000',     // Black
  lightBlue: '#E8F5FE', // Light blue background
  success: '#4CAF50',   // Green for success
  warning: '#FFC107',   // Yellow for warnings
  error: '#F44336',     // Red for errors
  text: {
    primary: '#424242',
    secondary: '#9E9E9E',
    white: '#FFFFFF',
  },
  background: {
    primary: '#1E88E5',
    secondary: '#E8F5FE',
  }
};

// Typography sizing
export const SIZES = {
  base: 8,
  small: 12,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
};

// Spacing
export const SPACING = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 25,
  xxl: 30,
  container: 20, // Standard container padding
};

// Border radius
export const RADIUS = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 25,
  round: 50, // For rounded buttons
};

// Shadow styles
export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
};

export default { COLORS, SIZES, SPACING, RADIUS, SHADOWS }; 