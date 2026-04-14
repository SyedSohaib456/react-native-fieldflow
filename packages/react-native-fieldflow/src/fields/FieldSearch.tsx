import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { useFieldFlowContext, useWatch } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldSearchProps } from '../types';

export const FieldSearch = forwardRef<TextInput, FieldSearchProps>((props, ref) => {
  const {
    placeholder = 'Search...',
    onSearch,
    loading = false,
    autoFocus = false,
    ...baseProps
  } = props;

  const {
    name,
    label, // Search usually doesn't show label but we support it now
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

  const [focused, setFocused] = useState(false);
  const value = useWatch(name);

  // ── Registration ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx) return;
    ctx.registerField({
      name,
      ref: internalRef,
      type: 'search',
      order: Date.now(),
    });
    return () => ctx.unregisterField(name);
  }, [ctx, name]);

  const setRefs = useCallback((node: TextInput | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as any).current = node;
  }, [ref]);

  const handleClear = useCallback(() => {
    ctx?.store.getState().setValue(name, '');
    if (theme.hapticStyle) triggerHaptic('light');
  }, [ctx, name, theme.hapticStyle]);

  const borderColor = focused ? theme.colors.borderFocused : theme.colors.border;

  // ── showIf ──────────────────────────────────────────────────────────────
  const allValues = ctx?.store.getState().values ?? {};
  const shouldShow = showIf ? showIf(allValues) : true;
  if (!shouldShow) return null;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputRow,
          {
            borderColor,
            borderRadius: theme.borderRadius,
            height: theme.inputHeight,
            backgroundColor: focused ? theme.colors.backgroundFocused : theme.colors.background,
          },
          inputContainerStyle,
        ]}
      >
        <View style={[styles.leftSide, leftIconStyle]}>
          {leftIcon ?? <Ionicons name="search" size={20} color={theme.colors.placeholder} />}
        </View>

        <TextInput
          ref={setRefs}
          value={String(value || '')}
          onChangeText={(text) => ctx?.store.getState().setValue(name, text)}
          onSubmitEditing={() => onSearch?.(String(value || ''))}
          onFocus={() => { setFocused(true); if (theme.hapticStyle) triggerHaptic(theme.hapticStyle); }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          autoFocus={autoFocus}
          style={[
            styles.input,
            { color: theme.colors.text, fontSize: theme.fontSize, fontFamily: theme.fontFamily || undefined },
            inputStyle,
          ]}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <View style={[styles.rightSide, rightIconStyle]}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : value && String(value).length > 0 ? (
            <Pressable onPress={handleClear}>
              <Ionicons name="close-circle" size={18} color={theme.colors.placeholder} />
            </Pressable>
          ) : rightIcon}
        </View>
      </View>
    </View>
  );
});

FieldSearch.displayName = 'FieldSearch';

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, paddingHorizontal: 12 },
  leftSide: { marginRight: 8 },
  input: { flex: 1, height: '100%', padding: 0 },
  rightSide: { marginLeft: 8 },
});
