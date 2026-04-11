import { createContext, useContext } from 'react';

import type { FieldFormContextValue } from './types';

export const FieldFlowContext = createContext<FieldFormContextValue | null>(null);

export function useFieldFlow(): FieldFormContextValue | null {
  return useContext(FieldFlowContext);
}
