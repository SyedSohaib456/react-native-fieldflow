import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFieldFlowContext, useFieldError, useWatch } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldTagsProps } from '../types';

export const FieldTags = forwardRef<TextInput, FieldTagsProps>((props, ref) => {
  const {
    placeholder = 'Add tag...',
    separators,
    maxTags,
    suggestions,
    renderTag,
    tagStyle,
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
  const containerRef = useRef<View>(null);

  const [inputText, setInputText] = useState('');
  const [focused, setFocused] = useState(false);

  // ── Reactive hooks ──────────────────────────────────────────────────────
  const tags = useWatch(name) as string[] || [];
  const error = useFieldError(name);
  const hasError = !!error;

  // ── Registration ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx) return;
    ctx.registerField({
      name,
      ref: containerRef as any,
      rules,
      label: label ?? name,
      type: 'tags',
      order: Date.now(),
    });
    if (rules) ctx.fieldRules.current[name] = rules;
    return () => ctx.unregisterField(name);
  }, [ctx, name, label, rules]);

  const setRefs = useCallback((node: TextInput | null) => {
    internalRef.current = node;
  }, []);

  const addTag = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const nextTags = [...tags, trimmed];
      ctx?.store.getState().setValue(name, nextTags);
      setInputText('');
      if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
    }
  }, [inputText, tags, ctx, name, theme.hapticStyle]);

  const removeTag = useCallback((tag: string) => {
    const nextTags = tags.filter((t) => t !== tag);
    ctx?.store.getState().setValue(name, nextTags);
    if (theme.hapticStyle) triggerHaptic('light');
  }, [tags, ctx, name, theme.hapticStyle]);

  const borderColor = hasError ? theme.colors.error : (focused ? theme.colors.borderFocused : theme.colors.border);

  // ── showIf ──────────────────────────────────────────────────────────────
  const allValues = ctx?.store.getState().values ?? {};
  const shouldShow = showIf ? showIf(allValues) : true;
  if (!shouldShow) return null;

  return (
    <View ref={containerRef} style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontSize: theme.labelFontSize, color: hasError ? theme.colors.error : theme.colors.label, fontFamily: theme.fontFamily || undefined, marginBottom: theme.spacing.labelBottomMargin }, labelStyle]}>
          {label}{rules?.required ? ' *' : ''}
        </Text>
      ) : null}

      <Pressable 
        onPress={() => internalRef.current?.focus()}
        style={[styles.tagInputContainer, { borderColor, borderRadius: theme.borderRadius, backgroundColor: focused ? theme.colors.backgroundFocused : theme.colors.background, minHeight: theme.inputHeight }, inputContainerStyle]}
      >
        {leftIcon ? <View style={[styles.iconSlotLeft, leftIconStyle]}>{leftIcon}</View> : null}
        
        <View style={styles.tagWrap}>
          {tags.map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary + '40', borderRadius: 20 }, tagStyle]}>
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>{tag}</Text>
              <Pressable onPress={() => removeTag(tag)} style={styles.removeBtn}>
                <Ionicons name="close-circle" size={14} color={theme.colors.primary} />
              </Pressable>
            </View>
          ))}
          
          <TextInput
            ref={setRefs}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTag}
            onFocus={() => {
              setFocused(true);
              if (ctx?.autoScroll) ctx.scrollFieldIntoView(name);
            }}
            onBlur={() => { setFocused(false); ctx?.store.getState().setTouched(name, true); if (ctx?.validateOn === 'blur') ctx.validateField(name); }}
            placeholder={tags.length === 0 ? placeholder : ''}
            placeholderTextColor={theme.colors.placeholder}
            style={[styles.input, { color: theme.colors.text, fontSize: theme.fontSize, fontFamily: theme.fontFamily || undefined }, inputStyle]}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>

        {rightIcon ? <View style={[styles.iconSlotRight, rightIconStyle]}>{rightIcon}</View> : null}
      </Pressable>

      {hasError ? (
        <Text style={[styles.error, { fontSize: theme.errorFontSize, color: theme.colors.error, marginTop: theme.spacing.errorTopMargin }, errorStyle]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

FieldTags.displayName = 'FieldTags';

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontWeight: '600' },
  tagInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, paddingHorizontal: 12, paddingVertical: 8 },
  tagWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  tagText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  removeBtn: { padding: 2 },
  input: { minWidth: 60, padding: 0, height: 24 },
  iconSlotLeft: { marginRight: 8 },
  iconSlotRight: { marginLeft: 8 },
  error: { fontWeight: '500' },
});
