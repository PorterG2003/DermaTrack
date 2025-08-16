import { createTheme } from '@shopify/restyle';

// Design tokens tuned for an iOS glass (liquid) look
export const theme = createTheme({
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
  // Restyle supports shadows via style props; we define a couple presets
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
});

export type Theme = typeof theme;

