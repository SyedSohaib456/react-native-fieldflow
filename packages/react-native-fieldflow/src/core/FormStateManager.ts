/**
 * Form State Manager — Zustand store factory for FieldFlow form state.
 *
 * Each <FieldForm> creates its own isolated store instance.
 * This gives us reactive state with fine-grained subscriptions,
 * no prop drilling, and zero boilerplate.
 */

import type { FieldRegistration, FormStoreState } from '../types';

// ─── Zustand Detection ───────────────────────────────────────────────────────

let zustandCreate: any = null;
let useZustandStore: any = null;

try {
  const zustand = require('zustand');
  zustandCreate = zustand.create ?? zustand.default?.create;
} catch {
  // Zustand not available — use lightweight fallback
}

// ─── Lightweight Fallback Store ──────────────────────────────────────────────

type Listener = () => void;

function createFallbackStore(
  initialValues: Record<string, unknown>,
): {
  getState: () => FormStoreState;
  setState: (partial: Partial<FormStoreState> | ((state: FormStoreState) => Partial<FormStoreState>)) => void;
  subscribe: (listener: Listener) => () => void;
} {
  const listeners = new Set<Listener>();

  const state: FormStoreState = createInitialState(initialValues);

  // Bind all actions
  bindActions(state, () => {
    listeners.forEach((l) => l());
  });

  return {
    getState: () => state,
    setState: (partial) => {
      const updates = typeof partial === 'function' ? partial(state) : partial;
      Object.assign(state, updates);
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// ─── Initial State Factory ───────────────────────────────────────────────────

function createInitialState(
  defaultValues: Record<string, unknown>,
): FormStoreState {
  return {
    values: { ...defaultValues },
    errors: {},
    touched: {},
    dirty: {},
    validating: {},
    isSubmitting: false,
    submitCount: 0,
    isDirty: false,
    fields: [],
    focusedField: null,

    // Actions are bound later
    setValue: () => {},
    setValues: () => {},
    getValue: () => undefined,
    getValues: () => ({}),
    setError: () => {},
    clearError: () => {},
    clearErrors: () => {},
    getError: () => null,
    getErrors: () => ({}),
    setTouched: () => {},
    setValidating: () => {},
    setSubmitting: () => {},
    registerField: () => {},
    unregisterField: () => {},
    setFocusedField: () => {},
    reset: () => {},
  };
}

function bindActions(
  state: FormStoreState,
  notify: () => void,
): void {
  state.setValue = (name, value) => {
    state.values = { ...state.values, [name]: value };
    state.dirty = { ...state.dirty, [name]: true };
    state.isDirty = true;
    notify();
  };

  state.setValues = (values) => {
    state.values = { ...state.values, ...values };
    notify();
  };

  state.getValue = (name) => state.values[name];

  state.getValues = () => ({ ...state.values });

  state.setError = (name, message) => {
    state.errors = { ...state.errors, [name]: message };
    notify();
  };

  state.clearError = (name) => {
    const next = { ...state.errors };
    delete next[name];
    state.errors = next;
    notify();
  };

  state.clearErrors = () => {
    state.errors = {};
    notify();
  };

  state.getError = (name) => state.errors[name] ?? null;

  state.getErrors = () => ({ ...state.errors });

  state.setTouched = (name, value) => {
    state.touched = { ...state.touched, [name]: value };
    notify();
  };

  state.setValidating = (name, value) => {
    state.validating = { ...state.validating, [name]: value };
    notify();
  };

  state.setSubmitting = (value) => {
    state.isSubmitting = value;
    if (value) state.submitCount += 1;
    notify();
  };

  state.registerField = (field: FieldRegistration) => {
    const existing = state.fields.findIndex((f) => f.name === field.name);
    if (existing >= 0) {
      // Update existing registration
      const next = [...state.fields];
      next[existing] = field;
      state.fields = next;
    } else {
      // Insert in order
      state.fields = [...state.fields, field].sort((a, b) => a.order - b.order);
    }
    notify();
  };

  state.unregisterField = (name) => {
    state.fields = state.fields.filter((f) => f.name !== name);
    // Clean up associated state
    const nextValues = { ...state.values };
    const nextErrors = { ...state.errors };
    const nextTouched = { ...state.touched };
    const nextDirty = { ...state.dirty };
    const nextValidating = { ...state.validating };
    delete nextValues[name];
    delete nextErrors[name];
    delete nextTouched[name];
    delete nextDirty[name];
    delete nextValidating[name];
    state.values = nextValues;
    state.errors = nextErrors;
    state.touched = nextTouched;
    state.dirty = nextDirty;
    state.validating = nextValidating;
    notify();
  };

  state.setFocusedField = (name) => {
    state.focusedField = name;
    notify();
  };

  state.reset = (values) => {
    state.values = values ? { ...values } : {};
    state.errors = {};
    state.touched = {};
    state.dirty = {};
    state.validating = {};
    state.isSubmitting = false;
    state.isDirty = false;
    state.focusedField = null;
    notify();
  };
}

// ─── Store Factory ───────────────────────────────────────────────────────────

export type FormStore = {
  getState: () => FormStoreState;
  setState: (partial: Partial<FormStoreState> | ((state: FormStoreState) => Partial<FormStoreState>)) => void;
  subscribe: (listener: Listener) => () => void;
};

/**
 * Creates an isolated form store for a single FieldForm instance.
 * Uses Zustand if available, otherwise uses a lightweight fallback.
 */
export function createFormStore(
  defaultValues: Record<string, unknown> = {},
): FormStore {
  if (zustandCreate) {
    return zustandCreate((set: any, get: any) => {
      const initial = createInitialState(defaultValues);

      return {
        ...initial,

        setValue: (name: string, value: unknown) =>
          set((s: FormStoreState) => ({
            values: { ...s.values, [name]: value },
            dirty: { ...s.dirty, [name]: true },
            isDirty: true,
          })),

        setValues: (values: Record<string, unknown>) =>
          set((s: FormStoreState) => ({
            values: { ...s.values, ...values },
          })),

        getValue: (name: string) => get().values[name],
        getValues: () => ({ ...get().values }),

        setError: (name: string, message: string) =>
          set((s: FormStoreState) => ({
            errors: { ...s.errors, [name]: message },
          })),

        clearError: (name: string) =>
          set((s: FormStoreState) => {
            const next = { ...s.errors };
            delete next[name];
            return { errors: next };
          }),

        clearErrors: () => set({ errors: {} }),

        getError: (name: string) => get().errors[name] ?? null,
        getErrors: () => ({ ...get().errors }),

        setTouched: (name: string, value: boolean) =>
          set((s: FormStoreState) => ({
            touched: { ...s.touched, [name]: value },
          })),

        setValidating: (name: string, value: boolean) =>
          set((s: FormStoreState) => ({
            validating: { ...s.validating, [name]: value },
          })),

        setSubmitting: (value: boolean) =>
          set((s: FormStoreState) => ({
            isSubmitting: value,
            submitCount: value ? s.submitCount + 1 : s.submitCount,
          })),

        registerField: (field: FieldRegistration) =>
          set((s: FormStoreState) => {
            const existing = s.fields.findIndex((f) => f.name === field.name);
            if (existing >= 0) {
              const next = [...s.fields];
              next[existing] = field;
              return { fields: next };
            }
            return {
              fields: [...s.fields, field].sort((a, b) => a.order - b.order),
            };
          }),

        unregisterField: (name: string) =>
          set((s: FormStoreState) => {
            const nextValues = { ...s.values };
            const nextErrors = { ...s.errors };
            const nextTouched = { ...s.touched };
            const nextDirty = { ...s.dirty };
            const nextValidating = { ...s.validating };
            delete nextValues[name];
            delete nextErrors[name];
            delete nextTouched[name];
            delete nextDirty[name];
            delete nextValidating[name];
            return {
              fields: s.fields.filter((f) => f.name !== name),
              values: nextValues,
              errors: nextErrors,
              touched: nextTouched,
              dirty: nextDirty,
              validating: nextValidating,
            };
          }),

        setFocusedField: (name: string | null) => set({ focusedField: name }),

        reset: (values?: Record<string, unknown>) =>
          set({
            values: values ? { ...values } : {},
            errors: {},
            touched: {},
            dirty: {},
            validating: {},
            isSubmitting: false,
            isDirty: false,
            focusedField: null,
          }),
      };
    });
  }

  // Fallback path
  return createFallbackStore(defaultValues);
}
