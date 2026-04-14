import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFieldFlowContext, useFieldError, useWatch } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldDateProps } from '../types';

export const FieldDate = forwardRef<View, FieldDateProps>((props, ref) => {
  const {
    mode = 'date',
    display = 'default',
    placeholder = 'Select date...',
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
  const dummyRef = useRef<View>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  // ── Reactive hooks ──────────────────────────────────────────────────────
  const value = useWatch(name);
  const error = useFieldError(name);
  const hasError = !!error;

  const dateValue = value instanceof Date ? value : (value ? new Date(value as string | number) : new Date());

  // ── Registration ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx) return;
    ctx.registerField({
      name,
      ref: dummyRef as any,
      rules,
      label: label ?? name,
      type: 'date',
      order: Date.now(),
    });
    if (rules) ctx.fieldRules.current[name] = rules;
    return () => ctx.unregisterField(name);
  }, [ctx, name, label, rules]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
    if (ctx?.autoScroll) {
      ctx.scrollFieldIntoView(name);
    }
  }, [theme.hapticStyle, ctx, name]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    ctx?.store.getState().setTouched(name, true);
    if (ctx?.validateOn === 'blur') ctx.validateField(name);
  }, [ctx, name]);

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setIsOpen(false);
    }
    
    if (selectedDate) {
      if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
      ctx?.store.getState().setValue(name, selectedDate.toISOString());
    }
  };

  const formatDate = (date: Date) => {
    if (mode === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const borderColor = hasError ? theme.colors.error : (focused ? theme.colors.borderFocused : theme.colors.border);

  // ── showIf ──────────────────────────────────────────────────────────────
  const allValues = ctx?.store.getState().values ?? {};
  const shouldShow = showIf ? showIf(allValues) : true;
  if (!shouldShow) return null;

  return (
    <View ref={dummyRef} style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontSize: theme.labelFontSize, color: hasError ? theme.colors.error : theme.colors.label, fontFamily: theme.fontFamily || undefined, marginBottom: theme.spacing.labelBottomMargin }, labelStyle]}>
          {label}{rules?.required ? ' *' : ''}
        </Text>
      ) : null}

      <Pressable
        onPress={handleOpen}
        onPressIn={() => setFocused(true)}
        onPressOut={() => setFocused(false)}
        style={[styles.inputRow, { borderColor, borderRadius: theme.borderRadius, height: theme.inputHeight, backgroundColor: focused ? theme.colors.backgroundFocused : theme.colors.background }, inputContainerStyle]}
      >
        <View style={styles.inputContent}>
          {leftIcon ? <View style={[styles.iconSlotLeft, leftIconStyle]}>{leftIcon}</View> : null}
          <Text style={[styles.text, { color: value ? theme.colors.text : theme.colors.placeholder, fontSize: theme.fontSize, fontFamily: theme.fontFamily || undefined }, inputStyle]}>
            {value ? formatDate(dateValue) : placeholder}
          </Text>
        </View>
        {rightIcon ? <View style={[styles.iconSlotRight, rightIconStyle]}>{rightIcon}</View> : <Ionicons name="calendar-outline" size={18} color={theme.colors.placeholder} />}
      </Pressable>

      {hasError ? (
        <Text style={[styles.error, { fontSize: theme.errorFontSize, color: theme.colors.error, marginTop: theme.spacing.errorTopMargin }, errorStyle]}>
          {error}
        </Text>
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={isOpen} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={handleClose} />
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background, borderRadius: 20 }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleClose}><Text style={[styles.doneBtn, { color: theme.colors.primary }]}>Done</Text></TouchableOpacity>
              </View>
              <DateTimePicker
                value={dateValue}
                mode={mode}
                display={display === 'default' ? 'spinner' : display as any}
                onChange={onChange}
                textColor={theme.colors.text}
              />
            </View>
          </View>
        </Modal>
      ) : (
        isOpen && (
          <DateTimePicker
            value={dateValue}
            mode={mode}
            display={display as any}
            onChange={onChange}
          />
        )
      )}
    </View>
  );
});

FieldDate.displayName = 'FieldDate';

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, paddingHorizontal: 16 },
  inputContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconSlotLeft: { marginRight: 8 },
  iconSlotRight: { marginLeft: 8 },
  text: { flex: 1 },
  error: { fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalContent: { paddingBottom: 40, paddingHorizontal: 20 },
  modalHeader: { height: 50, justifyContent: 'center', alignItems: 'flex-end', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#CCC' },
  doneBtn: { fontWeight: '600', fontSize: 17 },
});
