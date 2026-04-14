/**
 * Accessory View presets — drop-in accessory views for common use cases.
 */

import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFieldFlowContext, useFocusedField } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { dismissKeyboard } from '../keyboard/hooks';
import type {
  AccessoryCharCountProps,
  AccessoryDoneProps,
  AccessoryFieldLabelProps,
  AccessoryPasswordStrengthProps,
  AccessoryPrevNextProps,
  AccessorySuggestionsProps,
  AccessoryToolbarProps,
} from '../types';

// ─── AccessoryPrevNext ───────────────────────────────────────────────────────

export function AccessoryPrevNext(props: AccessoryPrevNextProps) {
  const {
    showPrev = true,
    showNext = true,
    showDone = true,
    prevLabel = '‹ Prev',
    nextLabel = 'Next ›',
    doneLabel = 'Done',
    onDone,
    buttonStyle,
    containerStyle,
  } = props;

  const ctx = useFieldFlowContext();
  const theme = useTheme();
  const focused = useFocusedField();

  const isFirst = focused.name ? ctx?.isFirstField(focused.name) : true;
  const isLast = focused.name ? ctx?.isLastField(focused.name) : true;

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder }, containerStyle]}>
      {showPrev && !isFirst ? (
        <TouchableOpacity onPress={() => focused.name && ctx?.focusPrev(focused.name)} style={[styles.btn, buttonStyle]}>
          <Text style={[styles.btnText, { color: theme.colors.toolbarButton }]}>{prevLabel}</Text>
        </TouchableOpacity>
      ) : <View style={styles.btn} />}

      <View style={styles.spacer} />

      {showNext && !isLast ? (
        <TouchableOpacity onPress={() => focused.name && ctx?.focusNext(focused.name)} style={[styles.btn, buttonStyle]}>
          <Text style={[styles.btnText, { color: theme.colors.toolbarButton }]}>{nextLabel}</Text>
        </TouchableOpacity>
      ) : showDone ? (
        <TouchableOpacity onPress={onDone ?? dismissKeyboard} style={[styles.btn, buttonStyle]}>
          <Text style={[styles.btnText, styles.bold, { color: theme.colors.toolbarButton }]}>{doneLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// ─── AccessoryDone ───────────────────────────────────────────────────────────

export function AccessoryDone(props: AccessoryDoneProps) {
  const { label = 'Done', style, onPress } = props;
  const theme = useTheme();

  return (
    <View style={[styles.row, styles.rowRight, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder }, style]}>
      <TouchableOpacity onPress={onPress ?? dismissKeyboard} style={styles.btn}>
        <Text style={[styles.btnText, styles.bold, { color: theme.colors.toolbarButton }]}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── AccessoryToolbar ────────────────────────────────────────────────────────

export function AccessoryToolbar(props: AccessoryToolbarProps) {
  const {
    renderLeft,
    renderCenter,
    renderRight,
    height = 44,
    containerStyle,
    borderTopWidth = 1,
    borderTopColor,
  } = props;

  const theme = useTheme();
  const focused = useFocusedField();
  const fieldInfo = {
    name: focused.name ?? '',
    label: focused.label,
    value: focused.value,
    error: focused.error,
    type: 'text' as const,
  };

  return (
    <View style={[styles.row, { height, borderTopWidth, borderTopColor: borderTopColor ?? theme.colors.toolbarBorder, backgroundColor: theme.colors.toolbar }, containerStyle]}>
      <View style={styles.slot}>{renderLeft?.(fieldInfo)}</View>
      <View style={[styles.slot, styles.center]}>{renderCenter?.(fieldInfo)}</View>
      <View style={[styles.slot, styles.right]}>{renderRight?.(fieldInfo)}</View>
    </View>
  );
}

// ─── AccessoryFieldLabel ─────────────────────────────────────────────────────

export function AccessoryFieldLabel(props: AccessoryFieldLabelProps) {
  const { style, textStyle } = props;
  const theme = useTheme();
  const focused = useFocusedField();

  return (
    <View style={[styles.row, styles.center, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder }, style]}>
      <Text style={[styles.labelText, { color: theme.colors.label, fontFamily: theme.fontFamily || undefined }, textStyle]} numberOfLines={1}>
        {focused.label ?? focused.name ?? ''}
      </Text>
    </View>
  );
}

// ─── AccessoryCharCount ──────────────────────────────────────────────────────

export function AccessoryCharCount(props: AccessoryCharCountProps) {
  const {
    warningThreshold = 0.8,
    dangerThreshold = 0.95,
    warningColor = '#F59E0B',
    dangerColor,
    style,
    textStyle,
  } = props;

  const theme = useTheme();
  const focused = useFocusedField();
  const value = String(focused.value ?? '');
  // Note: maxLength would need to come from the field registration
  const maxLength = 280; // Sensible default

  const ratio = value.length / maxLength;
  let color = theme.colors.placeholder;
  if (ratio >= (dangerThreshold)) color = dangerColor ?? theme.colors.error;
  else if (ratio >= warningThreshold) color = warningColor;

  return (
    <View style={[styles.row, styles.rowRight, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder }, style]}>
      <Text style={[styles.charCount, { color }, textStyle]}>
        {value.length} / {maxLength}
      </Text>
    </View>
  );
}

// ─── AccessoryPasswordStrength ───────────────────────────────────────────────

export function AccessoryPasswordStrength(props: AccessoryPasswordStrengthProps) {
  const { showLabel = true, barStyle, containerStyle } = props;
  const theme = useTheme();
  const focused = useFocusedField();
  const value = String(focused.value ?? '');

  // Simple strength calc
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^a-zA-Z0-9]/.test(value)) score++;
  const level = Math.min(Math.floor(score / 1.5), 3);

  const colors = [theme.colors.error, '#F59E0B', '#EAB308', theme.colors.success];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!value) return null;

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder, gap: 10 }, containerStyle]}>
      <View style={[styles.strengthBar, barStyle]}>
        <View style={[styles.strengthFill, { width: `${((level + 1) / 4) * 100}%`, backgroundColor: colors[level] }]} />
      </View>
      {showLabel ? (
        <Text style={[styles.strengthLabel, { color: colors[level] }]}>{labels[level]}</Text>
      ) : null}
    </View>
  );
}

// ─── AccessorySuggestions ────────────────────────────────────────────────────

export function AccessorySuggestions(props: AccessorySuggestionsProps) {
  const { suggestions = [], chipStyle, containerStyle } = props;
  const theme = useTheme();
  const ctx = useFieldFlowContext();
  const focused = useFocusedField();

  const handleTap = useCallback((suggestion: string) => {
    if (focused.name && ctx) {
      const current = String(ctx.store.getState().values[focused.name] ?? '');
      ctx.store.getState().setValue(focused.name, current + suggestion);
    }
  }, [ctx, focused.name]);

  if (suggestions.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={[styles.suggestionsScroll, { backgroundColor: theme.colors.toolbar, borderTopColor: theme.colors.toolbarBorder }, containerStyle]}
      contentContainerStyle={styles.suggestionsContent}
    >
      {suggestions.map((s) => (
        <TouchableOpacity
          key={s}
          onPress={() => handleTap(s)}
          style={[styles.chip, { backgroundColor: `${theme.colors.primary}15`, borderRadius: theme.borderRadius - 4 }, chipStyle]}
        >
          <Text style={[styles.chipText, { color: theme.colors.primary }]}>{s}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderTopWidth: 1,
    paddingHorizontal: 12,
  },
  rowRight: { justifyContent: 'flex-end' },
  btn: { paddingHorizontal: 8, paddingVertical: 6, minWidth: 50 },
  btnText: { fontSize: 15, fontWeight: '600' },
  bold: { fontWeight: '700' },
  spacer: { flex: 1 },
  slot: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  labelText: { fontSize: 14, fontWeight: '500' },
  charCount: { fontSize: 13, fontWeight: '500' },
  strengthBar: { flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: '600', minWidth: 40 },
  suggestionsScroll: { borderTopWidth: 1, height: 44 },
  suggestionsContent: { alignItems: 'center', paddingHorizontal: 8, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 14, fontWeight: '500' },
});
