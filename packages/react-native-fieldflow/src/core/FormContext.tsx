/**
 * Form Context — unified context for FieldFlow.
 * Provides form state, field registration, focus chain, validation, and keyboard management.
 */

import React, { createContext, useContext, useMemo, useRef } from 'react';
import { Keyboard } from 'react-native';

import type { FormStore } from './FormStateManager';
import type {
  FieldRegistration,
  FormController,
  FormStoreState,
  ValidationRules,
} from '../types';

// ─── Context Shape ───────────────────────────────────────────────────────────

export interface FieldFlowContextValue {
  store: FormStore;

  // Field registration (name-based)
  registerField: (field: FieldRegistration) => void;
  unregisterField: (name: string) => void;

  // Focus chain
  focusField: (name: string) => void;
  focusNext: (currentName: string) => void;
  focusPrev: (currentName: string) => void;
  getFieldIndex: (name: string) => number;
  getFieldCount: () => number;
  isLastField: (name: string) => boolean;
  isFirstField: (name: string) => boolean;

  // Scrolling
  scrollFieldIntoView: (name: string, padding?: number) => void;
  scrollRef: React.MutableRefObject<any>;

  // Validation
  validateField: (name: string) => Promise<string | null>;
  validateAll: () => Promise<Record<string, string>>;
  fieldRules: React.MutableRefObject<Record<string, ValidationRules>>;

  // Form actions
  submitForm: () => void;

  // Config
  validateOn: 'submit' | 'blur' | 'change';
  revalidateOn: 'blur' | 'change';
  autoScroll: boolean;
  chainEnabled: boolean;
  autoReturnKeyType: boolean;
  errorShake: boolean;
}

export const FieldFlowContext = createContext<FieldFlowContextValue | null>(null);

// ─── useFieldFlow — Full Form Controller ─────────────────────────────────────

/**
 * Access the full form controller from within a FieldForm.
 * Returns the FormController interface for programmatic form manipulation.
 */
export function useFieldFlow(): FormController {
  const ctx = useContext(FieldFlowContext);
  if (!ctx) {
    throw new Error(
      'useFieldFlow() must be called inside a <FieldForm>. ' +
      'Wrap your fields in a <FieldForm> component.',
    );
  }

  const { store } = ctx;

  return useMemo((): FormController => ({
    getValues: () => store.getState().getValues(),
    getValue: (name) => store.getState().getValue(name),
    setValue: (name, value) => store.getState().setValue(name, value),

    getErrors: () => store.getState().getErrors(),
    getError: (name) => store.getState().getError(name),
    setError: (name, msg) => store.getState().setError(name, msg),
    clearError: (name) => store.getState().clearError(name),
    clearErrors: () => store.getState().clearErrors(),

    focus: (name) => ctx.focusField(name),
    blur: () => Keyboard.dismiss(),

    submit: () => ctx.submitForm(),
    reset: (values) => store.getState().reset(values),
    isDirty: () => store.getState().isDirty,
    isValid: () => Object.keys(store.getState().errors).length === 0,
    isSubmitting: () => store.getState().isSubmitting,

    watch: (name) => store.getState().values[name],
    watchAll: () => store.getState().getValues(),
  }), [ctx, store]);
}

// ─── Subscription hook (avoids useSyncExternalStore object-identity issues) ──

/**
 * Subscribe to a slice of the store with a selector.
 * Uses useState + subscribe to avoid useSyncExternalStore pitfalls
 * with non-primitive return values.
 */
function useStoreSelector<T>(
  store: FormStore | undefined,
  selector: (state: FormStoreState) => T,
  isEqual?: (a: T, b: T) => boolean,
): T {
  const [value, setValue] = React.useState<T>(() =>
    store ? selector(store.getState()) : selector({} as FormStoreState),
  );

  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  const isEqualRef = useRef(isEqual);
  isEqualRef.current = isEqual;

  React.useEffect(() => {
    if (!store) return;

    // Set initial value
    const initial = selectorRef.current(store.getState());
    setValue(initial);

    const unsub = store.subscribe(() => {
      const next = selectorRef.current(store.getState());
      setValue((prev) => {
        if (isEqualRef.current) {
          return isEqualRef.current(prev, next) ? prev : next;
        }
        // Default: reference equality
        return prev === next ? prev : next;
      });
    });

    return unsub;
  }, [store]);

  return value;
}

/** Shallow compare two objects */
function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

// ─── Convenience hooks ───────────────────────────────────────────────────────

/**
 * Get the error for a specific field. Causes re-render only when that error changes.
 */
export function useFieldError(name: string): string | null {
  const ctx = useContext(FieldFlowContext);
  return useStoreSelector(
    ctx?.store,
    (s) => s.errors?.[name] ?? null,
  );
}

/**
 * Get the full state for a specific field.
 */
export function useFieldState(name: string): {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  validating: boolean;
} {
  const ctx = useContext(FieldFlowContext);
  return useStoreSelector(
    ctx?.store,
    (s) => ({
      value: s.values?.[name],
      error: s.errors?.[name] ?? null,
      touched: s.touched?.[name] ?? false,
      dirty: s.dirty?.[name] ?? false,
      validating: s.validating?.[name] ?? false,
    }),
    shallowEqual,
  );
}

/**
 * Watch a specific field value reactively.
 */
export function useWatch(name: string): unknown {
  const ctx = useContext(FieldFlowContext);
  return useStoreSelector(
    ctx?.store,
    (s) => s.values?.[name],
  );
}

/**
 * Watch all form values reactively.
 */
export function useWatchAll(): Record<string, unknown> {
  const ctx = useContext(FieldFlowContext);
  return useStoreSelector(
    ctx?.store,
    (s) => s.values ?? {},
    shallowEqual,
  );
}

/**
 * Get currently focused field info.
 */
export function useFocusedField(): {
  name: string | null;
  label?: string;
  value: unknown;
  error: string | null;
} {
  const ctx = useContext(FieldFlowContext);
  return useStoreSelector(
    ctx?.store,
    (s) => {
      const focusedName = s.focusedField;
      if (!focusedName) return { name: null, label: undefined, value: undefined, error: null };

      const field = s.fields?.find((f) => f.name === focusedName);
      return {
        name: focusedName,
        label: field?.label,
        value: s.values?.[focusedName],
        error: s.errors?.[focusedName] ?? null,
      };
    },
    shallowEqual,
  );
}

/**
 * Internal-only: access raw context (for field components).
 */
export function useFieldFlowContext(): FieldFlowContextValue | null {
  return useContext(FieldFlowContext);
}
