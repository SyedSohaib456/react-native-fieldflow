/**
 * FieldInput — Smart text input with validation, auto-inference, and focus chain.
 *
 * Features:
 * - Auto-registers into FieldForm's focus chain
 * - Name-based smart inference (email → email keyboard, password → secure, phone → phone-pad)
 * - Validation with animated error display
 * - Error shake animation on failed submit
 * - Conditional rendering via showIf
 * - Full accessibility
 * - Haptic feedback on focus/error
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputSubmitEditingEventData,
  type KeyboardTypeOptions,
} from 'react-native';

import { useFieldFlowContext, useFieldError, useWatch } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldInputProps, FieldType } from '../types';

// ─── Smart Inference ─────────────────────────────────────────────────────────

interface InferredProps {
  keyboardType?: KeyboardTypeOptions;
  textContentType?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
}

function inferFromName(name: string | undefined): InferredProps {
  if (!name) return {};
  const lower = name.toLowerCase();

  if (lower.includes('email')) {
    return {
      keyboardType: 'email-address',
      textContentType: 'emailAddress',
      autoCapitalize: 'none',
      autoComplete: 'email',
    };
  }

  if (lower.includes('password') || lower.includes('confirm')) {
    return {
      secureTextEntry: true,
      textContentType: lower.includes('password') ? 'password' : 'none',
      autoCapitalize: 'none',
      autoComplete: 'password',
    };
  }

  if (lower.includes('phone') || lower.includes('mobile') || lower.includes('tel')) {
    return {
      keyboardType: 'phone-pad',
      textContentType: 'telephoneNumber',
      autoComplete: 'tel',
    };
  }

  if (lower.includes('name') || lower.includes('first') || lower.includes('last')) {
    return {
      textContentType: lower.includes('first') ? 'givenName' : lower.includes('last') ? 'familyName' : 'name',
      autoCapitalize: 'words',
      autoComplete: 'name',
    };
  }

  if (lower.includes('url') || lower.includes('website') || lower.includes('link')) {
    return {
      keyboardType: 'url',
      textContentType: 'URL',
      autoCapitalize: 'none',
      autoComplete: 'url',
    };
  }

  if (lower.includes('zip') || lower.includes('postal')) {
    return {
      keyboardType: 'number-pad',
      textContentType: 'postalCode',
      autoComplete: 'postal-code',
    };
  }

  return {};
}

function inferFieldType(name: string | undefined, secureTextEntry?: boolean): FieldType {
  if (!name) return 'text';
  const lower = name.toLowerCase();
  if (secureTextEntry || lower.includes('password')) return 'password';
  if (lower.includes('email')) return 'email';
  if (lower.includes('phone') || lower.includes('tel')) return 'phone';
  return 'text';
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FieldInput = forwardRef<TextInput, FieldInputProps>((props, forwardedRef) => {
  const {
    name,
    label,
    rules,
    shouldIgnoreChain = false,
    nextRef,
    onFormSubmit,
    showIf,
    accessoryView,
    keyboardExtension,
    suppressKeyboard,
    leftIcon,
    rightIcon,
    leftIconStyle,
    rightIconStyle,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    hapticOnFocus = false,
    hapticOnError = true,
    control,  // RHF adapter
    formik,   // Formik adapter
    onSubmitEditing,
    onFocus,
    onBlur,
    onChangeText,
    returnKeyType,
    blurOnSubmit,
    secureTextEntry,
    ...restParams
  } = props;

  const ctx = useFieldFlowContext();
  const theme = useTheme();

  const internalRef = useRef<TextInput | null>(null);
  const orderRef = useRef(-1);
  const [focused, setFocused] = useState(false);

  // Error animation
  const errorAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Smart Inference ──────────────────────────────────────────────────────

  const inferred = useMemo(() => inferFromName(name), [name]);
  const fieldType = useMemo(
    () => inferFieldType(name, secureTextEntry ?? inferred.secureTextEntry),
    [name, secureTextEntry, inferred.secureTextEntry],
  );

  // ── Ref Forwarding ──────────────────────────────────────────────────────

  const setRefs = useCallback(
    (node: TextInput | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<TextInput | null>).current = node;
      }
    },
    [forwardedRef],
  );

  // ── Reactive Store Values ───────────────────────────────────────────────

  // Use reactive hooks so component re-renders when values change
  const storeValue = useWatch(name);
  const storeError = useFieldError(name);
  const hasError = !!storeError;

  // ── showIf Conditional Rendering ────────────────────────────────────────

  const allValues = ctx?.store.getState().values ?? {};
  const shouldShow = showIf ? showIf(allValues) : true;
  const [visible, setVisible] = useState(shouldShow);
  const visibilityAnim = useRef(new Animated.Value(shouldShow ? 1 : 0)).current;

  useEffect(() => {
    if (shouldShow && !visible) {
      setVisible(true);
      Animated.timing(visibilityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else if (!shouldShow && visible) {
      Animated.timing(visibilityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [shouldShow, visible, visibilityAnim]);

  // ── Registration ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!ctx || shouldIgnoreChain || !visible) return;

    ctx.registerField({
      name,
      ref: internalRef,
      rules,
      label,
      type: fieldType,
      order: orderRef.current === -1 ? Date.now() : orderRef.current,
    });

    // Store rules
    if (rules) {
      ctx.fieldRules.current[name] = rules;
    }

    return () => {
      ctx.unregisterField(name);
    };
  }, [ctx, name, shouldIgnoreChain, visible, label, fieldType, rules]);

  // ── Error Animation ─────────────────────────────────────────────────────

  useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: hasError ? 1 : 0,
      duration: theme.animationDuration,
      useNativeDriver: true,
    }).start();
  }, [hasError, errorAnim, theme.animationDuration]);

  // ── Shake Animation ─────────────────────────────────────────────────────

  const triggerShake = useCallback(() => {
    if (!ctx?.errorShake) return;

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [ctx?.errorShake, shakeAnim]);

  // Shake when error appears after submit
  useEffect(() => {
    if (hasError && (ctx?.store.getState().submitCount ?? 0) > 0) {
      triggerShake();
      if (hapticOnError) {
        triggerHaptic('error');
      }
    }
  }, [hasError, triggerShake, hapticOnError, ctx]);

  // ── Event Handlers ──────────────────────────────────────────────────────

  const handleChangeText = useCallback((text: string) => {
    ctx?.store.getState().setValue(name, text);
    onChangeText?.(text);

    // Revalidate on change if we already have an error
    const currentError = ctx?.store.getState().errors[name];
    if (currentError && ctx?.revalidateOn === 'change') {
      ctx.validateField(name);
    }

    // Validate on change if configured
    if (ctx?.validateOn === 'change') {
      ctx.validateField(name);
    }
  }, [ctx, name, onChangeText]);

  const handleFocus = useCallback((e: any) => {
    setFocused(true);
    ctx?.store.getState().setFocusedField(name);
    onFocus?.(e);

    if (hapticOnFocus) {
      triggerHaptic('light');
    }

    // Auto-scroll
    if (ctx?.autoScroll && internalRef.current) {
      ctx.scrollFieldIntoView(name);
    }
  }, [ctx, name, onFocus, hapticOnFocus]);

  const handleBlur = useCallback((e: any) => {
    setFocused(false);
    ctx?.store.getState().setTouched(name, true);
    ctx?.store.getState().setFocusedField(null);
    onBlur?.(e);

    // Validate on blur
    const currentError = ctx?.store.getState().errors[name];
    if (ctx?.validateOn === 'blur' || (currentError && ctx?.revalidateOn === 'blur')) {
      ctx?.validateField(name);
    }
  }, [ctx, name, onBlur]);

  const handleSubmitEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      onSubmitEditing?.(e);

      if (!ctx) return;

      if (nextRef?.current) {
        nextRef.current.focus();
      } else if (ctx.isLastField(name)) {
        onFormSubmit?.();
        ctx.submitForm();
      } else if (ctx.chainEnabled) {
        ctx.focusNext(name);
      }
    },
    [ctx, name, nextRef, onSubmitEditing, onFormSubmit],
  );

  // ── Resolve Props ───────────────────────────────────────────────────────

  const resolvedReturnKeyType = returnKeyType ??
    (ctx?.autoReturnKeyType
      ? (ctx.isLastField(name) ? 'done' : 'next')
      : undefined
    );

  const resolvedBlurOnSubmit = blurOnSubmit ?? false;

  // Don't render if hidden
  if (!visible) return null;

  // ── Styles ──────────────────────────────────────────────────────────────

  const borderColor = hasError
    ? theme.colors.error
    : focused
    ? theme.colors.borderFocused
    : theme.colors.border;

  const backgroundColor = focused
    ? theme.colors.backgroundFocused
    : theme.colors.background;

  // Haptic Style Resolution
  const resolvedFocusHaptic = hapticOnFocus 
    ? (typeof hapticOnFocus === 'boolean' ? theme.hapticStyle : hapticOnFocus) 
    : false;

  const resolvedErrorHaptic = hapticOnError
    ? (typeof hapticOnError === 'boolean' ? 'error' : hapticOnError)
    : false;

  // Convert value to string for TextInput
  const displayValue = typeof storeValue === 'string'
    ? storeValue
    : String(storeValue ?? '');

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          opacity: visibilityAnim,
          transform: [
            { translateX: shakeAnim },
            { scale: visibilityAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
          ],
        },
      ]}
    >
      {/* Label */}
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
          {rules?.required ? ' *' : ''}
        </Text>
      ) : null}

      {/* Input Row */}
      <View
        style={[
          styles.inputContainer,
          {
            height: theme.inputHeight,
            borderColor,
            backgroundColor,
            borderRadius: theme.borderRadius,
          },
          inputContainerStyle,
        ]}
      >
        {leftIcon ? (
          <View style={[styles.iconLeft, leftIconStyle]}>
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          {...restParams}
          ref={setRefs}
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={(e) => {
            handleFocus(e);
            if (resolvedFocusHaptic) triggerHaptic(resolvedFocusHaptic);
          }}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          returnKeyType={resolvedReturnKeyType}
          blurOnSubmit={resolvedBlurOnSubmit}
          secureTextEntry={secureTextEntry ?? inferred.secureTextEntry}
          keyboardType={restParams.keyboardType ?? inferred.keyboardType}
          textContentType={restParams.textContentType ?? (inferred.textContentType as any)}
          autoCapitalize={restParams.autoCapitalize ?? inferred.autoCapitalize}
          autoComplete={restParams.autoComplete ?? (inferred.autoComplete as any)}
          placeholderTextColor={restParams.placeholderTextColor ?? theme.colors.placeholder}
          style={[
            styles.input,
            {
              fontSize: theme.fontSize,
              color: theme.colors.text,
              fontFamily: theme.fontFamily || undefined,
            },
            inputStyle,
          ]}
          // Accessibility
          accessibilityLabel={label ?? name}
          accessibilityHint={hasError && storeError ? storeError : undefined}
          accessibilityState={{
            disabled: restParams.editable === false,
          }}
        />

        {rightIcon ? (
          <View style={[styles.iconRight, rightIconStyle]}>
            {rightIcon}
          </View>
        ) : null}
      </View>

      {/* Error Message */}
      <Animated.View
        style={[
          styles.errorContainer,
          {
            opacity: errorAnim,
            transform: [{
              translateY: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-4, 0],
              }),
            }],
          },
        ]}
      >
        {hasError && storeError ? (
          <Text
            style={[
              styles.errorText,
              {
                fontSize: theme.errorFontSize,
                color: theme.colors.error,
                fontFamily: theme.fontFamily || undefined,
                marginTop: theme.spacing.errorTopMargin,
              },
              errorStyle,
            ]}
            accessibilityLiveRegion="polite"
          >
            {storeError}
          </Text>
        ) : null}
      </Animated.View>
    </Animated.View>
  );
});

FieldInput.displayName = 'FieldInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 4,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  errorContainer: {
    minHeight: 18,
  },
  errorText: {
    fontWeight: '500',
  },
});
