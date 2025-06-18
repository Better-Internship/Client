/**
 * BetterInternship Design System
 * Unified component library for consistent UI/UX across all three portals
 * 
 * This design system consolidates duplicate components and provides:
 * - Design tokens for consistent styling
 * - Primitive components for atomic design
 * - Pattern components for common use cases
 * - Layout components for structural consistency
 * - Portal-specific theming support
 */

// Design Tokens
export * from './tokens';

// Primitive Components (Atomic)
export * from './primitives';

// Pattern Components (Molecular/Organism)
export * from './patterns';

// Layout Components
export * from './layouts';

// Commonly used re-exports for convenience
export { Button } from './primitives/Button';
export { Input } from './primitives/Input';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './primitives/Card';
export { SearchBar } from './patterns/SearchBar';
export { DataTable } from './patterns/DataTable';
export { PortalLayout } from './layouts/PortalLayout';
