/**
 * Design System Color Tokens
 * Unified color palette for all three portals
 */

export const colors = {
  // Primary color palette
  primary: {
    50: 'hsl(210, 40%, 98%)',
    100: 'hsl(210, 40%, 96%)',
    200: 'hsl(214, 32%, 91%)',
    300: 'hsl(213, 27%, 84%)',
    400: 'hsl(215, 20%, 65%)',
    500: 'hsl(217, 19%, 45%)',
    600: 'hsl(221, 39%, 11%)',
    700: 'hsl(222, 84%, 5%)',
    800: 'hsl(224, 71%, 4%)',
    900: 'hsl(226, 83%, 3%)',
    950: 'hsl(224, 88%, 2%)',
  },

  // Semantic colors
  semantic: {
    success: {
      50: 'hsl(138, 76%, 97%)',
      100: 'hsl(141, 84%, 93%)',
      200: 'hsl(141, 79%, 85%)',
      300: 'hsl(142, 77%, 73%)',
      400: 'hsl(142, 69%, 58%)',
      500: 'hsl(142, 71%, 45%)',
      600: 'hsl(142, 76%, 36%)',
      700: 'hsl(142, 72%, 29%)',
      800: 'hsl(143, 64%, 24%)',
      900: 'hsl(144, 61%, 20%)',
      950: 'hsl(145, 80%, 10%)',
    },
    warning: {
      50: 'hsl(54, 92%, 95%)',
      100: 'hsl(54, 96%, 88%)',
      200: 'hsl(53, 98%, 77%)',
      300: 'hsl(50, 98%, 64%)',
      400: 'hsl(48, 96%, 53%)',
      500: 'hsl(45, 93%, 47%)',
      600: 'hsl(41, 96%, 40%)',
      700: 'hsl(35, 91%, 33%)',
      800: 'hsl(32, 81%, 29%)',
      900: 'hsl(28, 73%, 26%)',
      950: 'hsl(23, 83%, 14%)',
    },
    error: {
      50: 'hsl(0, 86%, 97%)',
      100: 'hsl(0, 93%, 94%)',
      200: 'hsl(0, 96%, 89%)',
      300: 'hsl(0, 94%, 82%)',
      400: 'hsl(0, 90%, 71%)',
      500: 'hsl(0, 84%, 60%)',
      600: 'hsl(0, 72%, 51%)',
      700: 'hsl(0, 74%, 42%)',
      800: 'hsl(0, 70%, 35%)',
      900: 'hsl(0, 63%, 31%)',
      950: 'hsl(0, 75%, 15%)',
    },
    info: {
      50: 'hsl(204, 100%, 97%)',
      100: 'hsl(204, 94%, 94%)',
      200: 'hsl(201, 94%, 86%)',
      300: 'hsl(199, 95%, 74%)',
      400: 'hsl(198, 93%, 60%)',
      500: 'hsl(198, 89%, 48%)',
      600: 'hsl(200, 98%, 39%)',
      700: 'hsl(201, 96%, 32%)',
      800: 'hsl(201, 90%, 27%)',
      900: 'hsl(202, 80%, 24%)',
      950: 'hsl(202, 80%, 16%)',
    },
  },

  // Neutral colors
  neutral: {
    50: 'hsl(0, 0%, 98%)',
    100: 'hsl(0, 0%, 96%)',
    200: 'hsl(0, 0%, 90%)',
    300: 'hsl(0, 0%, 83%)',
    400: 'hsl(0, 0%, 64%)',
    500: 'hsl(0, 0%, 45%)',
    600: 'hsl(0, 0%, 32%)',
    700: 'hsl(0, 0%, 25%)',
    800: 'hsl(0, 0%, 15%)',
    900: 'hsl(0, 0%, 9%)',
    950: 'hsl(0, 0%, 4%)',
  },

  // Portal-specific accent colors
  portal: {
    student: {
      primary: 'hsl(217, 19%, 45%)',
      accent: 'hsl(142, 71%, 45%)',
    },
    hire: {
      primary: 'hsl(262, 83%, 58%)',
      accent: 'hsl(45, 93%, 47%)',
    },
    school: {
      primary: 'hsl(0, 72%, 51%)',
      accent: 'hsl(198, 89%, 48%)',
    },
  },
} as const;

export type ColorToken = typeof colors;
export type ColorScale = keyof typeof colors.primary;
export type SemanticColor = keyof typeof colors.semantic;
export type PortalColor = keyof typeof colors.portal;
