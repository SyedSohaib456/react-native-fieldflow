/**
 * FieldAmount — Locale-aware currency input with live formatting.
 */

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFieldFlowContext, useFieldError } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldAmountProps } from '../types';

// ─── Formatting Helpers ──────────────────────────────────────────────────────

function formatNumber(value: number, locale: string, decimals: number): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    // Fallback for environments without Intl
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

function parseNumber(text: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = text.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ─── Currency Symbols ────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨', INR: '₹', AED: 'د.إ',
  SAR: '﷼', CNY: '¥', KRW: '₩', BRL: 'R$', CAD: 'C$', AUD: 'A$',
  CHF: 'CHF', MXN: 'MX$', SGD: 'S$', HKD: 'HK$', NOK: 'kr', SEK: 'kr',
  DKK: 'kr', NZD: 'NZ$', ZAR: 'R', THB: '฿', TRY: '₺', RUB: '₽',
};

export const FieldAmount = forwardRef<TextInput, FieldAmountProps>((props, ref) => {
  const {
    currency = 'USD',
    locale = 'en-US',
    min,
    max,
    decimals = 2,
    prefix,
    suffix,
    placeholder = '0.00',
    ...baseProps
  } = props;

  const {
    name,
    label,
    rules,
    showIf,
    leftIcon,
    rightIcon,
    leftIconStyle,
    rightIconStyle,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    hapticOnFocus,
    hapticOnError,
    ...restParams
  } = baseProps;

  const ctx = useFieldFlowContext();
  const theme = useTheme();

  const internalRef = useRef<TextInput | null>(null);
  const [displayValue, setDisplayValue] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Reactive error from store ───────────────────────────────────────────

  const error = useFieldError(name);
  const hasError = !!error;

  // ── Registration ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!ctx) return;

    ctx.registerField({
      name,
      ref: internalRef,
      rules,
      label: label ?? name,
      type: 'amount',
      order: Date.now(),
    });

    ctx.store.getState().setValue(name, 0);

    if (rules) {
      ctx.fieldRules.current[name] = rules;
    }

    return () => ctx.unregisterField(name);
  }, [ctx, name, label, rules]);

  const setRefs = useCallback((node: TextInput | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  }, [ref]);

  // ── showIf ──────────────────────────────────────────────────────────────

  const allValues = ctx?.store.getState().values ?? {};
  const shouldShow = showIf ? showIf(allValues) : true;
  if (!shouldShow) return null;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleChangeText = useCallback((text: string) => {
    const num = parseNumber(text);

    // Min/max enforcement with shake
    if (max !== undefined && num > max) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
      triggerHaptic('warning');
      return;
    }

    const formatted = num > 0 ? formatNumber(num, locale, decimals) : '';
    setDisplayValue(formatted);
    ctx?.store.getState().setValue(name, num);
  }, [ctx, name, locale, decimals, max, shakeAnim]);

  const handleFocus = useCallback(() => {
    ctx?.store.getState().setFocusedField(name);
    if (ctx?.autoScroll) {
      ctx.scrollFieldIntoView(name);
    }
    if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
  }, [ctx, name, theme.hapticStyle]);

  const handleBlur = useCallback(() => {
    ctx?.store.getState().setFocusedField(null);
    ctx?.store.getState().setTouched(name, true);

    // Validate on blur
    if (ctx?.validateOn === 'blur') {
      ctx.validateField(name);
    }
  }, [ctx, name]);

  // ── Render ──────────────────────────────────────────────────────────────

  const currencySymbol = prefix ?? CURRENCY_SYMBOLS[currency] ?? currency;
  const [focused, setFocused] = useState(false);
  const borderColor = hasError
    ? theme.colors.error
    : focused
    ? theme.colors.borderFocused
    : theme.colors.border;


  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ translateX: shakeAnim }] },
      ]}
    >
      {label ? (
        <Text
          style={[
            styles.label,
            {
              fontSize: theme.labelFontSize,
              color: hasError ? theme.colors.error : theme.colors.label,
              fontFamily: theme.fontFamily || undefined,
              marginBottom: theme.spacing.labelBottomMargin,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputRow,
          {
            borderColor,
            borderRadius: theme.borderRadius,
            backgroundColor: focused ? theme.colors.backgroundFocused : theme.colors.background,
            height: theme.inputHeight,
          },
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={[styles.iconSlot, leftIconStyle]}>{leftIcon}</View>
        ) : null}

        {/* Currency prefix */}
        <Text
          style={[
            styles.currencyPrefix,
            { color: theme.colors.placeholder, fontSize: theme.fontSize },
          ]}
        >
          {currencySymbol}
        </Text>

        <TextInput
          {...restParams}
          ref={setRefs}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={() => { setFocused(true); handleFocus(); }}
          onBlur={() => { setFocused(false); handleBlur(); }}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          style={[
            styles.input,
            {
              fontSize: theme.fontSize,
              color: theme.colors.text,
              fontFamily: theme.fontFamily || undefined,
            },
            inputStyle,
          ]}
          accessibilityLabel={label ?? name}
        />

        {/* Suffix */}
        {suffix ? (
          <Text
            style={[
              styles.suffix,
              { color: theme.colors.placeholder, fontSize: theme.fontSize - 2 },
            ]}
          >
            {suffix}
          </Text>
        ) : null}

        {rightIcon ? (
          <View style={[styles.iconSlot, rightIconStyle]}>{rightIcon}</View>
        ) : null}
      </View>

      {/* Error */}
      {hasError ? (
        <Text
          style={[
            styles.error,
            {
              fontSize: theme.errorFontSize,
              color: theme.colors.error,
              marginTop: theme.spacing.errorTopMargin,
            },
            errorStyle,
          ]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </Animated.View>
  );
});

FieldAmount.displayName = 'FieldAmount';

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  currencyPrefix: {
    fontWeight: '600',
    marginRight: 8,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  suffix: {
    marginLeft: 8,
    opacity: 0.6,
  },
  error: {
    fontWeight: '500',
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
