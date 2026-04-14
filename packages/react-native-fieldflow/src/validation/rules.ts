/**
 * Built-in validation rules for FieldFlow.
 * Each rule returns an error message string or null if valid.
 */

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const URL_RE = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/;
const NUMERIC_RE = /^-?\d*\.?\d+$/;

type RuleValue<T> = T | [T, string] | { value: T; message: string };

function getMessage<T>(rule: RuleValue<T>, fallback: string): string {
  if (Array.isArray(rule)) return rule[1];
  if (rule && typeof rule === 'object' && 'message' in rule) return rule.message;
  return fallback;
}

function getRuleValue<T>(rule: RuleValue<T>): T {
  if (Array.isArray(rule)) return rule[0];
  if (rule && typeof rule === 'object' && 'value' in rule) return rule.value;
  return rule as T;
}

export function validateRequired(
  value: unknown,
  rule: boolean | string | { value: boolean; message: string },
): string | null {
  if (!rule) return null;
  const msg = getMessage(rule as any, 'This field is required');
  const ruleVal = getRuleValue(rule as any);
  if (!ruleVal) return null;

  if (value === undefined || value === null || value === '') return msg;
  if (Array.isArray(value) && value.length === 0) return msg;
  return null;
}

export function validateMin(
  value: unknown,
  rule: RuleValue<number>,
): string | null {
  const min = getRuleValue(rule);
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num < min) {
    return getMessage(rule, `Must be at least ${min}`);
  }
  return null;
}

export function validateMax(
  value: unknown,
  rule: RuleValue<number>,
): string | null {
  const max = getRuleValue(rule);
  const num = Number(value);
  if (isNaN(num)) return null;
  if (num > max) {
    return getMessage(rule, `Must be at most ${max}`);
  }
  return null;
}

export function validateMinLength(
  value: unknown,
  rule: RuleValue<number>,
): string | null {
  const minLen = getRuleValue(rule);
  const str = String(value ?? '');
  if (str.length < minLen) {
    return getMessage(rule, `Must be at least ${minLen} characters`);
  }
  return null;
}

export function validateMaxLength(
  value: unknown,
  rule: RuleValue<number>,
): string | null {
  const maxLen = getRuleValue(rule);
  const str = String(value ?? '');
  if (str.length > maxLen) {
    return getMessage(rule, `Must be at most ${maxLen} characters`);
  }
  return null;
}

export function validatePattern(
  value: unknown,
  rule: RuleValue<RegExp>,
): string | null {
  const pattern = getRuleValue(rule);
  const str = String(value ?? '');
  if (str.length === 0) return null; // Let required rule handle empty
  if (!pattern.test(str)) {
    return getMessage(rule, 'Invalid format');
  }
  return null;
}

export function validateEmail(
  value: unknown,
  rule: boolean | string | { value: boolean; message: string },
): string | null {
  if (!rule) return null;
  const str = String(value ?? '');
  if (str.length === 0) return null;
  const msg = getMessage(rule as any, 'Invalid email address');
  const ruleVal = getRuleValue(rule as any);
  if (!ruleVal) return null;

  if (!EMAIL_RE.test(str)) return msg;
  return null;
}

export function validateUrl(
  value: unknown,
  rule: boolean | string | { value: boolean; message: string },
): string | null {
  if (!rule) return null;
  const str = String(value ?? '');
  if (str.length === 0) return null;
  const msg = getMessage(rule as any, 'Invalid URL');
  const ruleVal = getRuleValue(rule as any);
  if (!ruleVal) return null;

  if (!URL_RE.test(str)) return msg;
  return null;
}

export function validateNumeric(
  value: unknown,
  rule: boolean | string | { value: boolean; message: string },
): string | null {
  if (!rule) return null;
  const str = String(value ?? '');
  if (str.length === 0) return null;
  const msg = getMessage(rule as any, 'Must be a number');
  const ruleVal = getRuleValue(rule as any);
  if (!ruleVal) return null;

  if (!NUMERIC_RE.test(str)) return msg;
  return null;
}

export function validateMatches(
  value: unknown,
  rule: RuleValue<string>,
  allValues: Record<string, unknown>,
): string | null {
  const fieldName = getRuleValue(rule);
  const otherValue = allValues[fieldName];
  if (value !== otherValue) {
    return getMessage(rule, `Must match ${fieldName}`);
  }
  return null;
}
