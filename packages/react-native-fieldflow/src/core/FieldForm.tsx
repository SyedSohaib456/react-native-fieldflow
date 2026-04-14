/**
 * FieldForm — The core form container.
 *
 * Provides:
 * - Form state management (values, errors, touched) via Zustand
 * - Keyboard avoidance with animated spacer
 * - Focus chain management
 * - Validation orchestration
 * - Form persistence (auto-save/restore)
 * - Haptic feedback
 * - Accessibility
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  findNodeHandle,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { FieldFlowContext } from './FormContext';
import type { FieldFlowContextValue } from './FormContext';
import { createFormStore } from './FormStateManager';
import type { FormStore } from './FormStateManager';

import { validateField as runValidation } from '../validation/ValidationEngine';
import { triggerHaptic } from '../haptics/HapticEngine';
import { persistFormValues, restoreFormValues } from '../persistence/PersistEngine';

import type {
  FieldFormHandle,
  FieldFormProps,
  FieldRegistration,
  HapticConfig,
  ValidationRules,
} from '../types';

export const FieldForm = forwardRef<FieldFormHandle, FieldFormProps<any>>((props, ref) => {
  const {
    children,
    onFinish,
    defaultValues = {},

    // Keyboard avoidance
    avoidKeyboard = true,
    extraScrollPadding = 32,
    dismissMode = 'interactive',

    // Scrolling
    scrollable = true,
    inverted = false,
    scrollViewProps,
    ScrollViewComponent,

    // Validation
    validateOn = 'submit',
    revalidateOn = 'change',

    // Persistence
    persistKey,
    persistStorage,

    // Keyboard callbacks
    onKeyboardShow,
    onKeyboardHide,

    // Haptics
    haptics,
    errorShake = true,

    // Accessory views
    accessoryView,
    fieldAccessoryView,
    accessoryViewID,

    // Analytics
    onAnalytics,

    // Config
    autoScroll = true,
    chainEnabled = true,
    autoReturnKeyType = true,
    dismissKeyboardOnTap = false,
    dismissKeyboardOnSubmit = true,

    // Style
    style,
    contentContainerStyle,
  } = props;

  // ── Store ────────────────────────────────────────────────────────────────

  const storeRef = useRef<FormStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createFormStore(defaultValues as Record<string, unknown>);
  }
  const store = storeRef.current;

  // ── Refs ─────────────────────────────────────────────────────────────────

  const scrollRef = useRef<ScrollView | null>(null);
  const fieldRulesRef = useRef<Record<string, ValidationRules>>({});
  const animatedMargin = useRef(new Animated.Value(0)).current;
  const orderCounterRef = useRef(0);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Persistence: Restore ─────────────────────────────────────────────────

  useEffect(() => {
    if (!persistKey) return;

    restoreFormValues(persistKey, persistStorage).then((restored) => {
      if (restored) {
        store.getState().setValues(restored);
      }
    });
  }, [persistKey]);

  // ── Persistence: Auto-save (debounced 500ms) ────────────────────────────

  useEffect(() => {
    if (!persistKey) return;

    const unsub = store.subscribe(() => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
      persistTimerRef.current = setTimeout(() => {
        const values = store.getState().getValues();
        persistFormValues(persistKey, values, persistStorage);
      }, 500);
    });

    return () => {
      unsub();
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current);
    };
  }, [persistKey, persistStorage, store]);

  // ── Keyboard Animation ──────────────────────────────────────────────────

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e.endCoordinates.height;
      const targetPadding = height + (extraScrollPadding ?? 0);
      
      if (avoidKeyboard) {
        if (Platform.OS === 'ios') {
          // If using Reanimated, we skip scheduleLayoutAnimation because 
          // ReanimatedSpacer handles the transition smoothly on the UI thread.
          // Triggering layout animations concurrently can cause frame drops.
          if (!Reanimated) {
            Keyboard.scheduleLayoutAnimation(e);
            animatedMargin.setValue(targetPadding);
          } else {
            // Reanimated is handled by the component worklet
          }
        } else {
          // Android Fallback
          // We use useNativeDriver: false here because we're animating 'height' or 'margin'
          // which is not supported by the native driver in standard Animated API.
          // Using Reanimated is highly recommended for Android 60fps.
          Animated.timing(animatedMargin, {
            toValue: targetPadding,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }).start();
        }
      }
      onKeyboardShow?.(height);
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      if (avoidKeyboard) {
        if (Platform.OS === 'ios') {
          if (!Reanimated) {
            Keyboard.scheduleLayoutAnimation(e as any);
            animatedMargin.setValue(0);
          }
        } else {
          Animated.timing(animatedMargin, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }).start();
        }
      }
      onKeyboardHide?.();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [avoidKeyboard, onKeyboardShow, onKeyboardHide, extraScrollPadding]);


  // ── Android Back Press ──────────────────────────────────────────────────

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Keyboard.dismiss();
      return false; // Don't consume the event
    });

    return () => sub.remove();
  }, []);

  // ── Field Registration ──────────────────────────────────────────────────

  const registerField = useCallback((field: FieldRegistration) => {
    // Assign order if not specified
    if (field.order === -1 || field.order === undefined) {
      field.order = orderCounterRef.current++;
    }
    store.getState().registerField(field);

    // Initialize value if not set
    const currentVal = store.getState().values[field.name];
    if (currentVal === undefined) {
      store.getState().setValue(field.name, '');
    }

    // Store rules reference
    if (field.rules) {
      fieldRulesRef.current[field.name] = field.rules;
    }
  }, [store]);

  const unregisterField = useCallback((name: string) => {
    store.getState().unregisterField(name);
    delete fieldRulesRef.current[name];
  }, [store]);

  // ── Focus Chain ─────────────────────────────────────────────────────────

  const getFields = useCallback(() => store.getState().fields, [store]);

  const focusField = useCallback((name: string) => {
    const fields = getFields();
    const field = fields.find((f) => f.name === name);
    if (field?.ref?.current?.focus) {
      field.ref.current.focus();
      store.getState().setFocusedField(name);
    }
  }, [getFields, store]);

  const focusNext = useCallback((currentName: string) => {
    const fields = getFields();
    const idx = fields.findIndex((f) => f.name === currentName);
    if (idx === -1) return;

    const nextField = fields[idx + 1];
    if (nextField?.ref?.current?.focus) {
      nextField.ref.current.focus();
      store.getState().setFocusedField(nextField.name);

      // Scroll into view
      if (autoScroll && scrollRef.current && nextField.ref.current) {
        const handle = findNodeHandle(nextField.ref.current);
        if (handle) {
          setTimeout(() => {
            requestAnimationFrame(() => {
              scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard?.(
                handle,
                extraScrollPadding,
                true,
              );
            });
          }, 16);
        }
      }
    } else {
      // Past last field
      Keyboard.dismiss();
    }
  }, [getFields, store, autoScroll, extraScrollPadding]);

  const focusPrev = useCallback((currentName: string) => {
    const fields = getFields();
    const idx = fields.findIndex((f) => f.name === currentName);
    if (idx <= 0) return;

    const prevField = fields[idx - 1];
    if (prevField?.ref?.current?.focus) {
      prevField.ref.current.focus();
      store.getState().setFocusedField(prevField.name);
    }
  }, [getFields, store]);

  const getFieldIndex = useCallback((name: string) => {
    return getFields().findIndex((f) => f.name === name);
  }, [getFields]);

  const getFieldCount = useCallback(() => {
    return getFields().length;
  }, [getFields]);

  const isLastField = useCallback((name: string) => {
    const fields = getFields();
    return fields.length > 0 && fields[fields.length - 1]?.name === name;
  }, [getFields]);

  const isFirstField = useCallback((name: string) => {
    const fields = getFields();
    return fields.length > 0 && fields[0]?.name === name;
  }, [getFields]);

  // ── Scroll Into View ────────────────────────────────────────────────────

  const scrollFieldIntoView = useCallback((name: string, padding?: number) => {
    const fields = getFields();
    const field = fields.find((f) => f.name === name);
    if (!field?.ref?.current || !scrollRef.current) return;

    const handle = findNodeHandle(field.ref.current);
    if (!handle) return;

    const pad = padding ?? extraScrollPadding;
    
    // Slight delay to ensure layout has settled (especially for keyboard transitions)
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        
        // Use the native responder for smooth iOS/Android coordination
        scrollRef.current.scrollResponderScrollNativeHandleToKeyboard?.(
          handle,
          pad + 20, // Add a bit more buffer
          true,
        );
      });
    }, 100);
  }, [getFields, extraScrollPadding]);

  // ── Validation ──────────────────────────────────────────────────────────

  const validateSingleField = useCallback(async (name: string): Promise<string | null> => {
    const rules = fieldRulesRef.current[name];
    if (!rules) return null;

    const values = store.getState().getValues();
    const value = values[name];

    store.getState().setValidating(name, true);
    const error = await runValidation(value, rules, values);
    store.getState().setValidating(name, false);

    if (error) {
      store.getState().setError(name, error);
    } else {
      store.getState().clearError(name);
    }

    return error;
  }, [store]);

  const validateAll = useCallback(async (): Promise<Record<string, string>> => {
    const values = store.getState().getValues();
    const errors: Record<string, string> = {};

    const entries = Object.entries(fieldRulesRef.current);
    await Promise.all(
      entries.map(async ([name, rules]) => {
        const error = await runValidation(values[name], rules as ValidationRules, values);
        if (error) {
          errors[name] = error;
          store.getState().setError(name, error);
        } else {
          store.getState().clearError(name);
        }
      }),
    );

    return errors;
  }, [store]);

  // ── Submit ──────────────────────────────────────────────────────────────

  const submitForm = useCallback(async () => {
    store.getState().setSubmitting(true);

    // Validate all fields
    const errors = await validateAll();
    const errorCount = Object.keys(errors).length;

    if (errorCount > 0) {
      // Focus first invalid field
      const fields = getFields();
      const firstInvalid = fields.find((f) => errors[f.name]);
      if (firstInvalid) {
        focusField(firstInvalid.name);
        scrollFieldIntoView(firstInvalid.name);
      }

      // Haptic error feedback
      triggerHaptic(haptics?.onError ?? 'error');

      store.getState().setSubmitting(false);
      return;
    }

    // Dismiss keyboard
    if (dismissKeyboardOnSubmit) {
      Keyboard.dismiss();
    }

    // Haptic success
    triggerHaptic(haptics?.onSuccess ?? 'success');

    // Call onSubmit with typed values
    try {
      await onFinish(store.getState().getValues() as any);
    } catch {
      // User's onSubmit threw — not our problem
    } finally {
      store.getState().setSubmitting(false);
    }
  }, [
    store, validateAll, getFields, focusField, scrollFieldIntoView,
    onFinish, dismissKeyboardOnSubmit,
  ]);

  // ── Imperative Handle ───────────────────────────────────────────────────

  useImperativeHandle(ref, (): FieldFormHandle => ({
    focusNext: (currentIndex) => {
      const fields = getFields();
      if (fields[currentIndex]) {
        focusNext(fields[currentIndex].name);
      }
    },
    scrollInputIntoView: (input, padding) => {
      if (!scrollRef.current || !input) return;
      const handle = findNodeHandle(input);
      if (!handle) return;
      scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard?.(
        handle,
        padding ?? extraScrollPadding,
        true,
      );
    },
    dismissKeyboard: () => Keyboard.dismiss(),
    getScrollView: () => scrollRef.current,
    submit: submitForm,
    reset: (values) => store.getState().reset(values),
  }), [focusNext, extraScrollPadding, submitForm, store, getFields]);

  // ── Context Value ───────────────────────────────────────────────────────

  const ctx = useMemo((): FieldFlowContextValue => ({
    store,
    registerField,
    unregisterField,
    focusField,
    focusNext,
    focusPrev,
    getFieldIndex,
    getFieldCount,
    isLastField,
    isFirstField,
    scrollFieldIntoView,
    scrollRef,
    validateField: validateSingleField,
    validateAll,
    fieldRules: fieldRulesRef,
    submitForm,
    validateOn,
    revalidateOn,
    autoScroll,
    chainEnabled,
    autoReturnKeyType,
    errorShake,
  }), [
    store, registerField, unregisterField, focusField, focusNext, focusPrev,
    getFieldIndex, getFieldCount, isLastField, isFirstField,
    scrollFieldIntoView, validateSingleField, validateAll, submitForm,
    validateOn, revalidateOn, autoScroll, chainEnabled, autoReturnKeyType, errorShake,
  ]);

  // ── Render ──────────────────────────────────────────────────────────────

  const ScrollTarget = (ScrollViewComponent ?? ScrollView) as any;

  const mergedContentContainerStyle = [
    styles.scrollContent,
    contentContainerStyle,
    scrollViewProps?.contentContainerStyle,
  ];

  let content: React.ReactNode;

  if (scrollable) {
    const scrollStyle = [
      styles.flex1, 
      style,
      inverted && { transform: [{ scaleY: -1 }] }
    ];

    content = (
      <ScrollTarget
        ref={scrollRef}
        keyboardDismissMode={dismissMode === 'interactive' ? 'interactive' : (dismissMode === 'on-drag' ? 'on-drag' : 'none')}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
        style={scrollStyle}
        contentContainerStyle={mergedContentContainerStyle}
      >
        <View style={inverted ? { transform: [{ scaleY: -1 }] } : null}>
          
          {inverted ? (
            avoidKeyboard && Reanimated ? <ReanimatedSpacer extraPadding={extraScrollPadding} /> : <Animated.View style={{ height: animatedMargin }} />
          ) : null}
          {inverted && extraScrollPadding && !Reanimated ? <View style={{ height: extraScrollPadding }} /> : null}
          
          {children}
          
          {!inverted && extraScrollPadding && !Reanimated ? <View style={{ height: extraScrollPadding }} /> : null}
          {!inverted ? (
             avoidKeyboard && Reanimated ? <ReanimatedSpacer extraPadding={extraScrollPadding} /> : <Animated.View style={{ height: animatedMargin }} />
          ) : null}
          
        </View>
      </ScrollTarget>
    );

    if (dismissKeyboardOnTap) {
      content = (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      );
    }
  } else {
    // Scrollable = false (e.g. Chat UI)
    if (avoidKeyboard) {
      if (Reanimated) {
        content = (
          <ReanimatedPaddingView style={[styles.flex1, style]} extraPadding={extraScrollPadding}>
            {children}
          </ReanimatedPaddingView>
        );
      } else {
        content = (
          <import_react_native.KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={extraScrollPadding}
            style={[styles.flex1, style]}
          >
            {children}
          </import_react_native.KeyboardAvoidingView>
        );
      }
    } else {
      content = (
        <View style={[styles.flex1, style]}>
          {children}
        </View>
      );
    }
    
    if (dismissKeyboardOnTap) {
      content = (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      );
    }
  }

  return (
    <FieldFlowContext.Provider value={ctx}>
      {content}
    </FieldFlowContext.Provider>
  );
});

FieldForm.displayName = 'FieldForm';

// ── Reanimated Optimized Components ─────────────────────────────────────

let Reanimated: any = null;
try {
  Reanimated = require('react-native-reanimated');
} catch (e) {}

const ReanimatedSpacer = ({ extraPadding }: { extraPadding: number }) => {
  const keyboard = Reanimated.useAnimatedKeyboard();
  const animatedStyle = Reanimated.useAnimatedStyle(() => {
    const pad = keyboard.height.value > 0 ? extraPadding : 0;
    return {
      height: keyboard.height.value + pad,
    };
  }, [extraPadding]);
  return <Reanimated.default.View style={animatedStyle} />;
};

const ReanimatedPaddingView = ({
  style,
  children,
  extraPadding,
}: {
  style: any;
  children: React.ReactNode;
  extraPadding: number;
}) => {
  const keyboard = Reanimated.useAnimatedKeyboard();
  const animatedStyle = Reanimated.useAnimatedStyle(() => {
    const pad = keyboard.height.value > 0 ? extraPadding : 0;
    return {
      paddingBottom: keyboard.height.value + pad,
    };
  }, [extraPadding]);
  return (
    <Reanimated.default.View style={[style, animatedStyle]}>
      {children}
    </Reanimated.default.View>
  );
};

import * as import_react_native from 'react-native';

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
