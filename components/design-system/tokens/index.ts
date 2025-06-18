/**
 * Design System Tokens Index
 * Central export for all design tokens
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export commonly used token combinations
export { colors } from './colors';
export { typography, typographyScale } from './typography';
export { spacing, semanticSpacing, borderRadius, shadows, zIndex } from './spacing';
