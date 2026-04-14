/**
 * Form Analytics — tracks form interaction metrics.
 */

import { useCallback, useEffect, useRef } from 'react';

import { useFieldFlowContext } from '../core/FormContext';
import type { FormAnalytics } from '../types';

/**
 * Track form interaction metrics.
 * Returns stable analytics object updated after each submit.
 */
export function useFormAnalytics(): FormAnalytics {
  const ctx = useFieldFlowContext();
  const mountTime = useRef(Date.now());
  const firstInteractionTime = useRef<number | null>(null);
  const fieldFocusTimes = useRef<Record<string, number>>({});
  const fieldDurations = useRef<Record<string, number>>({});
  const fieldErrors = useRef<Record<string, number>>({});
  const submitAttempts = useRef(0);
  const lastSubmitAt = useRef<Date | null>(null);
  const currentField = useRef<string | null>(null);
  const currentFieldFocusStart = useRef<number | null>(null);

  // Track focus changes
  useEffect(() => {
    if (!ctx) return;

    const unsub = ctx.store.subscribe(() => {
      const state = ctx.store.getState();
      const focused = state.focusedField;

      // First interaction tracking
      if (focused && !firstInteractionTime.current) {
        firstInteractionTime.current = Date.now();
      }

      // Field duration tracking
      if (focused !== currentField.current) {
        // End previous field timing
        if (currentField.current && currentFieldFocusStart.current) {
          const duration = Date.now() - currentFieldFocusStart.current;
          fieldDurations.current[currentField.current] =
            (fieldDurations.current[currentField.current] ?? 0) + duration;
        }

        // Start new field timing
        currentField.current = focused;
        currentFieldFocusStart.current = focused ? Date.now() : null;
      }

      // Error tracking
      Object.keys(state.errors).forEach((name) => {
        fieldErrors.current[name] = (fieldErrors.current[name] ?? 0) + 1;
      });

      // Submit tracking
      if (state.isSubmitting) {
        submitAttempts.current++;
        lastSubmitAt.current = new Date();
      }
    });

    return unsub;
  }, [ctx]);

  const getAnalytics = useCallback((): FormAnalytics => {
    const now = Date.now();
    const ttfi = firstInteractionTime.current
      ? firstInteractionTime.current - mountTime.current
      : now - mountTime.current;

    const tts = firstInteractionTime.current && lastSubmitAt.current
      ? lastSubmitAt.current.getTime() - firstInteractionTime.current
      : 0;

    // Determine abandoned fields
    const allFields = ctx?.store.getState().fields ?? [];
    const values = ctx?.store.getState().values ?? {};
    const abandoned = allFields
      .filter((f) => {
        const val = values[f.name];
        const wasFocused = fieldDurations.current[f.name] !== undefined;
        const isEmpty = val === '' || val === undefined || val === null;
        return wasFocused && isEmpty;
      })
      .map((f) => f.name);

    return {
      timeToFirstInteraction: ttfi,
      timeToSubmit: tts,
      fieldDurations: { ...fieldDurations.current },
      fieldErrors: { ...fieldErrors.current },
      abandonedFields: abandoned,
      submitAttempts: submitAttempts.current,
      lastSubmitAt: lastSubmitAt.current,
    };
  }, [ctx]);

  return getAnalytics();
}
