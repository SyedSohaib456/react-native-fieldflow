/**
 * FieldOTP — OTP input with individual cells, auto-advance, paste support.
 */

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';

import { useFieldFlowContext, useFieldError } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldOTPProps } from '../types';

export const FieldOTP = forwardRef<View, FieldOTPProps>((props, ref) => {
  const {
    length = 6,
    autoFocus = false,
    autoSubmit = false,
    onComplete,
    secureTextEntry = false,
    variant = 'border',
    cellStyle,
    textStyle,
    focusedCellStyle,
    errorCellStyle,
    accessoryView,
    ...baseProps
  } = props;

  const {
    name,
    rules,
    showIf,
    containerStyle,
    hapticOnFocus,
    hapticOnError,
    ...restParams
  } = baseProps;

  const ctx = useFieldFlowContext();
  const theme = useTheme();

  const [digits, setDigits] = useState<string[]>(new Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRefs = useRef<(TextInput | null)[]>(new Array(length).fill(null));
  const containerRef = useRef<View | null>(null);

  // Animations for each cell
  const cellAnims = useRef(
    new Array(length).fill(null).map(() => new Animated.Value(1)),
  ).current;

  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Reactive error from store ───────────────────────────────────────────

  const error = useFieldError(name);
  const hasError = !!error;

  // ── Registration ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!ctx) return;

    ctx.registerField({
      name,
      ref: { current: inputRefs.current[0] },
      rules,
      label: name,
      type: 'otp',
      order: Date.now(),
    });

    // Initialize value
    ctx.store.getState().setValue(name, '');

    if (rules) {
      ctx.fieldRules.current[name] = rules;
    }

    return () => {
      ctx.unregisterField(name);
    };
  }, [ctx, name, rules]);

  // ── Sync to store ───────────────────────────────────────────────────────

  const updateStore = useCallback((newDigits: string[]) => {
    const code = newDigits.join('');
    ctx?.store.getState().setValue(name, code);

    if (code.length === length) {
      onComplete?.(code);
      if (autoSubmit) {
        ctx?.submitForm();
      }
    }
  }, [ctx, name, length, onComplete, autoSubmit]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleChangeText = useCallback((text: string, index: number) => {
    // Handle paste
    if (text.length > 1) {
      const pasted = text.replace(/\D/g, '').slice(0, length);
      const newDigits = new Array(length).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      updateStore(newDigits);

      // Focus the next empty cell or last cell
      const nextEmpty = newDigits.findIndex((d) => d === '');
      const targetIndex = nextEmpty === -1 ? length - 1 : nextEmpty;
      inputRefs.current[targetIndex]?.focus();
      return;
    }

    // Single character
    const digit = text.replace(/\D/g, '');
    if (digit.length === 0) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    updateStore(newDigits);

    // Animate cell
    Animated.sequence([
      Animated.timing(cellAnims[index], {
        toValue: 1.15,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(cellAnims[index], {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits, length, updateStore, cellAnims]);

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          // Move to previous cell
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          setDigits(newDigits);
          updateStore(newDigits);
          inputRefs.current[index - 1]?.focus();
        } else {
          // Clear current cell
          const newDigits = [...digits];
          newDigits[index] = '';
          setDigits(newDigits);
          updateStore(newDigits);
        }
      }
    },
    [digits, updateStore],
  );

  const handleFocus = useCallback((index: number) => {
    setFocusedIndex(index);
    ctx?.store.getState().setFocusedField(name);
    if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
  }, [ctx, name, theme.hapticStyle]);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
    ctx?.store.getState().setFocusedField(null);
  }, [ctx]);

  // ── Error shake ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (hasError && (ctx?.store.getState().submitCount ?? 0) > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      triggerHaptic('error');
    }
  }, [hasError, shakeAnim, ctx]);

  // Auto-focus first cell
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [autoFocus]);

  return (
    <View ref={containerRef} style={containerStyle}>
      <Animated.View
        style={[
          styles.row,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        {digits.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const cellBorderColor = hasError
            ? theme.colors.error
            : isFocused
            ? theme.colors.primary
            : theme.colors.border;

          const cellVariantStyle = variant === 'underlined' 
            ? { borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, borderBottomWidth: 1.5, borderRadius: 0 }
            : variant === 'solid'
            ? { borderWidth: 0, backgroundColor: isFocused ? theme.colors.backgroundFocused : theme.colors.background }
            : { borderWidth: 1.5, borderRadius: theme.borderRadius };

          return (
            <Animated.View
              key={index}
              style={[
                styles.cell,
                {
                  borderColor: cellBorderColor,
                },
                cellVariantStyle,
                isFocused && { backgroundColor: theme.colors.backgroundFocused },
                cellStyle,
                isFocused && focusedCellStyle,
                hasError && errorCellStyle,
                { transform: [{ scale: cellAnims[index] }] },
              ]}
            >
              <TextInput
                ref={(r) => { inputRefs.current[index] = r; }}
                style={[
                  styles.cellInput,
                  {
                    fontSize: theme.fontSize + 4,
                    color: theme.colors.text,
                    fontFamily: theme.fontFamily || undefined,
                    fontWeight: '700',
                  },
                  textStyle,
                ]}
                value={secureTextEntry && digit ? '●' : digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                keyboardType="number-pad"
                maxLength={length} // Allow paste of full code
                textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                selectTextOnFocus
                accessibilityLabel={`Digit ${index + 1} of ${length}`}
                accessibilityHint={hasError && error ? error : undefined}
              />
            </Animated.View>
          );
        })}
      </Animated.View>

      {/* Error */}
      {hasError && error ? (
        <Text
          style={[
            styles.error,
            {
              fontSize: theme.errorFontSize,
              color: theme.colors.error,
              marginTop: theme.spacing.errorTopMargin,
            },
          ]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
      
      {accessoryView}
    </View>
  );
});

FieldOTP.displayName = 'FieldOTP';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  cell: {
    width: 48,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellInput: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
    fontWeight: '700',
  },
  error: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 8,
  },
});
