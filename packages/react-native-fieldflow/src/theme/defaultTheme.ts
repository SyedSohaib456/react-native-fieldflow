/**
 * Default theme for FieldFlow components.
 * All field components read from this theme via context.
 */

import type { FormTheme, ResolvedFormTheme } from '../types';

export const defaultTheme: ResolvedFormTheme = {
  colors: {
    primary: '#6366F1',       // Indigo-500
    error: '#EF4444',         // Red-500
    success: '#22C55E',       // Green-500
    warning: '#F59E0B',       // Amber-500
    placeholder: '#9CA3AF',   // Gray-400
    label: '#374151',         // Gray-700
    text: '#111827',          // Gray-900
    border: '#D1D5DB',        // Gray-300
    borderFocused: '#6366F1', // Same as primary
    background: '#FFFFFF',
    backgroundFocused: '#F5F3FF', // Indigo-50
    toolbar: '#F9FAFB',       // Gray-50
    toolbarButton: '#6366F1', // Same as primary
    toolbarBorder: '#E5E7EB', // Gray-200
  },
  borderRadius: 12,
  inputHeight: 52,
  fontSize: 16,
  fontFamily: undefined,
  errorFontSize: 13,
  labelFontSize: 14,
  animationDuration: 200,
  hapticStyle: 'selection', // Subtle default
  spacing: {
    fieldGap: 16,
    errorTopMargin: 4,
    labelBottomMargin: 6,
  },
};

/**
 * Merges a partial user theme with defaults.
 * Deeply merges nested objects (colors, spacing).
 */
export function mergeTheme(userTheme?: FormTheme): ResolvedFormTheme {
  if (!userTheme) return defaultTheme;

  return {
    colors: { ...defaultTheme.colors, ...userTheme.colors },
    borderRadius: userTheme.borderRadius ?? defaultTheme.borderRadius,
    inputHeight: userTheme.inputHeight ?? defaultTheme.inputHeight,
    fontSize: userTheme.fontSize ?? defaultTheme.fontSize,
    fontFamily: userTheme.fontFamily ?? defaultTheme.fontFamily,
    errorFontSize: userTheme.errorFontSize ?? defaultTheme.errorFontSize,
    labelFontSize: userTheme.labelFontSize ?? defaultTheme.labelFontSize,
    animationDuration: userTheme.animationDuration ?? defaultTheme.animationDuration,
    hapticStyle: userTheme.hapticStyle !== undefined ? userTheme.hapticStyle : defaultTheme.hapticStyle,
    spacing: { ...defaultTheme.spacing, ...userTheme.spacing },
  };
}
