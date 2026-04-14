/**
 * FormProvider — Global theme + keyboard preload provider.
 * Wrap your app (or a subtree) in this to set theme globally.
 */

import React, { useEffect } from 'react';

import type { FormProviderProps } from '../types';
import { ThemeProvider } from '../theme/ThemeContext';
import { preloadKeyboard } from '../keyboard/preload';

export function FormProvider({
  theme,
  preload = false,
  preloadDelay = 100,
  children,
}: FormProviderProps) {
  useEffect(() => {
    if (preload && !__DEV__) {
      preloadKeyboard(preloadDelay);
    }
  }, [preload, preloadDelay]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

FormProvider.displayName = 'FormProvider';
