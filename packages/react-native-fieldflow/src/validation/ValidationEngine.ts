/**
 * Validation Engine — orchestrates rule execution for a single field.
 * Supports sync and async rules, debouncing, and cross-field validation.
 */

import type { ValidationRules, ValidationResult } from '../types';
import {
  validateRequired,
  validateMin,
  validateMax,
  validateMinLength,
  validateMaxLength,
  validatePattern,
  validateEmail,
  validateUrl,
  validateNumeric,
  validateMatches,
} from './rules';

/**
 * Validate a single field's value against its rules (sync only).
 * Returns the first error found, or null if all pass.
 */
export function validateFieldSync(
  value: unknown,
  rules: ValidationRules,
  allValues: Record<string, unknown>,
): string | null {
  if (rules.required) {
    const err = validateRequired(value, rules.required);
    if (err) return err;
  }

  // Skip further validation if empty and not required
  const str = String(value ?? '');
  if (str.length === 0) return null;

  if (rules.email) {
    const err = validateEmail(value, rules.email);
    if (err) return err;
  }

  if (rules.url) {
    const err = validateUrl(value, rules.url);
    if (err) return err;
  }

  if (rules.numeric) {
    const err = validateNumeric(value, rules.numeric);
    if (err) return err;
  }

  if (rules.minLength !== undefined) {
    const err = validateMinLength(value, rules.minLength);
    if (err) return err;
  }

  if (rules.maxLength !== undefined) {
    const err = validateMaxLength(value, rules.maxLength);
    if (err) return err;
  }

  if (rules.min !== undefined) {
    const err = validateMin(value, rules.min);
    if (err) return err;
  }

  if (rules.max !== undefined) {
    const err = validateMax(value, rules.max);
    if (err) return err;
  }

  if (rules.pattern) {
    const err = validatePattern(value, rules.pattern);
    if (err) return err;
  }

  if (rules.matches) {
    const err = validateMatches(value, rules.matches, allValues);
    if (err) return err;
  }

  return null;
}

/**
 * Validate a field, including async custom rule.
 * Returns a Promise that resolves to the first error or null.
 */
export async function validateField(
  value: unknown,
  rules: ValidationRules,
  allValues: Record<string, unknown>,
): Promise<string | null> {
  // Run sync rules first
  const syncError = validateFieldSync(value, rules, allValues);
  if (syncError) return syncError;

  // Run async custom rule
  if (rules.custom) {
    const result = rules.custom(String(value ?? ''), allValues);
    if (result instanceof Promise) {
      return await result;
    }
    return result;
  }

  return null;
}

/**
 * Validate all fields in a form.
 * Returns a record of field name → error message (only for invalid fields).
 */
export async function validateAllFields(
  values: Record<string, unknown>,
  fieldRules: Record<string, ValidationRules>,
): Promise<Record<string, string>> {
  const errors: Record<string, string> = {};

  const entries = Object.entries(fieldRules);
  const results = await Promise.all(
    entries.map(([name, rules]) => validateField(values[name], rules, values)),
  );

  entries.forEach(([name], i) => {
    const err = results[i];
    if (err) errors[name] = err;
  });

  return errors;
}

/**
 * Creates a debounced version of validateField for async validation.
 */
export function createDebouncedValidator(
  delayMs: number = 400,
): {
  validate: (
    value: unknown,
    rules: ValidationRules,
    allValues: Record<string, unknown>,
  ) => Promise<string | null>;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return {
    validate: (value, rules, allValues) => {
      return new Promise((resolve) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          const result = await validateField(value, rules, allValues);
          resolve(result);
        }, delayMs);
      });
    },
    cancel: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    },
  };
}
