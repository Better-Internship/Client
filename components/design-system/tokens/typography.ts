/**
 * Design System Typography Tokens
 * Unified typography scale and font weights
 */

export const typography = {
  // Font sizes with consistent scale
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  // Font weights
  fontWeights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line heights
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Font families
  fontFamilies: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif'
    ],
    serif: [
      'Georgia',
      'Cambria',
      'Times New Roman',
      'Times',
      'serif'
    ],
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Roboto Mono',
      'Consolas',
      'Liberation Mono',
      'Menlo',
      'Courier',
      'monospace'
    ],
  },
} as const;

// Type-safe typography scale utilities
export const typographyScale = {
  // Heading styles
  headings: {
    h1: {
      fontSize: typography.fontSizes['4xl'],
      fontWeight: typography.fontWeights.bold,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h2: {
      fontSize: typography.fontSizes['3xl'],
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.fontSizes['2xl'],
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.snug,
    },
    h4: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.semibold,
      lineHeight: typography.lineHeights.snug,
    },
    h5: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeights.normal,
    },
    h6: {
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.medium,
      lineHeight: typography.lineHeights.normal,
    },
  },

  // Body text styles
  body: {
    large: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.relaxed,
    },
    default: {
      fontSize: typography.fontSizes.base,
      fontWeight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.normal,
    },
    small: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.normal,
    },
    xs: {
      fontSize: typography.fontSizes.xs,
      fontWeight: typography.fontWeights.normal,
      lineHeight: typography.lineHeights.normal,
    },
  },

  // Special text styles
  caption: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    lineHeight: typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.wide,
  },
  overline: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    lineHeight: typography.lineHeights.none,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  code: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamilies.mono.join(', '),
  },
} as const;

export type Typography = typeof typography;
export type TypographyScale = typeof typographyScale;
export type FontSize = keyof typeof typography.fontSizes;
export type FontWeight = keyof typeof typography.fontWeights;
