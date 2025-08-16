import { createTheme } from '@shopify/restyle';

// Base theme tokens
const baseTheme = {
  spacing: {
    none: 0,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  borderRadii: {
    none: 0,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    pill: 999,
  },
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 16,
      lineHeight: 22,
    },
    heading: {
      color: 'textPrimary',
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
    },
    title: {
      color: 'textPrimary',
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600',
    },
    subtitle: {
      color: 'textSecondary',
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '500',
    },
    caption: {
      color: 'textMuted',
      fontSize: 13,
      lineHeight: 18,
    },
    mono: {
      color: 'textSecondary',
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'SpaceMono-Regular',
    },
  },
  breakpoints: {},
  shadowVariants: {
    soft: {
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    elevated: {
      shadowColor: '#000',
      shadowOpacity: 0.24,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
      elevation: 12,
    },
  },
};

// Dark theme with brushed metal aesthetics
const darkTheme = createTheme({
  ...baseTheme,
  colors: {
    // Base
    background: '#0B0C10',
    backgroundMuted: 'rgba(255,255,255,0.04)',
    // Accents
    primary: '#4CB3FF',
    primaryEmphasis: '#1A8CFF',
    secondary: '#78FFD6',
    // Content
    textPrimary: 'rgba(255,255,255,0.94)',
    textSecondary: 'rgba(255,255,255,0.68)',
    textMuted: 'rgba(255,255,255,0.45)',
    // Glass borders/highlights
    glassBorder: 'rgba(255,255,255,0.22)',
    glassBorderStrong: 'rgba(255,255,255,0.28)',
    // Utility
    black: '#000000',
    white: '#FFFFFF',
  },
});

// Light theme with brushed metal aesthetics
const lightTheme = createTheme({
  ...baseTheme,
  colors: {
    // Base
    background: '#F8F9FA',
    backgroundMuted: 'rgba(0,0,0,0.04)',
    // Accents
    primary: '#0066CC',
    primaryEmphasis: '#004499',
    secondary: '#00AA88',
    // Content
    textPrimary: 'rgba(0,0,0,0.94)',
    textSecondary: 'rgba(0,0,0,0.68)',
    textMuted: 'rgba(0,0,0,0.45)',
    // Glass borders/highlights
    glassBorder: 'rgba(0,0,0,0.12)',
    glassBorderStrong: 'rgba(0,0,0,0.18)',
    // Utility
    black: '#000000',
    white: '#FFFFFF',
  },
});

// Add gradients to both themes after creation
const darkThemeWithGradients = {
  ...darkTheme,
  gradients: {
    background: {
      colors: [
        '#0B0C10', '#1A1B1F', '#2A2B2F', '#1A1B1F', '#0B0C10',
        '#1A1B1F', '#2A2B2F', '#3A3B3F', '#2A2B2F', '#1A1B1F',
        '#0B0C10', '#1A1B1F', '#2A2B2F', '#1A1B1F', '#0B0C10'
      ],
      locations: [0, 0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.7, 0.77, 0.84, 0.91, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    accent: {
      colors: ['#4CB3FF', '#1A8CFF', '#4CB3FF'],
      locations: [0, 0.5, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

const lightThemeWithGradients = {
  ...lightTheme,
  gradients: {
    background: {
      colors: [
        '#F8F9FA', '#E9ECEF', '#D1D5DB', '#C5CBD3', '#B8BEC9',
        '#C5CBD3', '#D1D5DB', '#E9ECEF', '#F8F9FA', '#E9ECEF',
        '#D1D5DB', '#C5CBD3', '#B8BEC9', '#C5CBD3', '#D1D5DB'
      ],
      locations: [0, 0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.49, 0.56, 0.63, 0.7, 0.77, 0.84, 0.91, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    accent: {
      colors: ['#0066CC', '#004499', '#0066CC'],
      locations: [0, 0.5, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
};

export const theme = darkThemeWithGradients; // Default export for compatibility
export const darkThemeExport = darkThemeWithGradients;
export const lightThemeExport = lightThemeWithGradients;

export type Theme = typeof darkThemeWithGradients;
