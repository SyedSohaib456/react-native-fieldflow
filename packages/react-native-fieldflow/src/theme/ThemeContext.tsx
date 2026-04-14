/**
 * Theme Context — provides the resolved theme to all FieldFlow components.
 */

import React, { createContext, useContext, useMemo } from 'react';

import type { FormTheme, ResolvedFormTheme } from '../types';
import { defaultTheme, mergeTheme } from './defaultTheme';

const ThemeContext = createContext<ResolvedFormTheme>(defaultTheme);

export interface ThemeProviderProps {
  theme?: FormTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const resolved = useMemo(() => mergeTheme(theme), [theme]);

  return (
    <ThemeContext.Provider value={resolved}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.displayName = 'ThemeProvider';

/**
 * Returns the current resolved theme (all properties guaranteed to exist).
 */
export function useTheme(): ResolvedFormTheme {
  return useContext(ThemeContext);
}
