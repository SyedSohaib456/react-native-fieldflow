import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useFieldFlowContext, useFieldError, useWatch } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldSelectProps, SelectOption } from '../types';

const { height: windowHeight } = Dimensions.get('window');

export const FieldSelect = forwardRef<View, FieldSelectProps<any>>((props, ref) => {
  const {
    options,
    placeholder = 'Select...',
    searchable = false,
    multiSelect = false,
    sheetTitle,
    renderOption,
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
  const [searchText, setSearchText] = useState('');
  const [focused, setFocused] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  // ── Reactive hooks ──────────────────────────────────────────────────────
  const value = useWatch(name);
  const error = useFieldError(name);
  const hasError = !!error;

  const selected = useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // ── Registration ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ctx) return;
    ctx.registerField({
      name,
      ref: dummyRef as any,
      rules,
      label: label ?? name,
      type: 'select',
      order: Date.now(),
    });
    if (rules) ctx.fieldRules.current[name] = rules;
    return () => ctx.unregisterField(name);
  }, [ctx, name, label, rules]);

  const openSheet = useCallback(() => {
    setIsOpen(true);
    setSearchText('');
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 200 }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
    if (ctx?.autoScroll) {
      ctx.scrollFieldIntoView(name);
    }
  }, [theme.hapticStyle, slideAnim, backdropAnim, ctx, name]);

  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setIsOpen(false));
    ctx?.store.getState().setTouched(name, true);
    if (ctx?.validateOn === 'blur') ctx.validateField(name);
  }, [slideAnim, backdropAnim, ctx, name]);

  const handleSelect = useCallback((option: SelectOption<any>) => {
    if (multiSelect) {
      const isSelected = selected.includes(option.value);
      const nextSelected = isSelected
        ? selected.filter((v: any) => v !== option.value)
        : [...selected, option.value];
      ctx?.store.getState().setValue(name, nextSelected);
    } else {
      ctx?.store.getState().setValue(name, option.value);
      closeSheet();
    }
  }, [multiSelect, selected, ctx, name, closeSheet]);

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchText.toLowerCase()) ||
      o.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);

  const displayValue = useMemo(() => {
    if (selected.length === 0) return '';
    if (multiSelect) return `${selected.length} selected`;
    const option = options.find((o) => o.value === selected[0]);
    return option ? option.label : '';
  }, [selected, options, multiSelect]);

  const borderColor = hasError ? theme.colors.error : (focused ? theme.colors.borderFocused : theme.colors.border);
  const sheetHeight = Math.min(windowHeight * 0.75, 600);

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
        onPress={openSheet}
        onPressIn={() => setFocused(true)}
        onPressOut={() => setFocused(false)}
        style={[styles.selectInput, { borderColor, borderRadius: theme.borderRadius, height: theme.inputHeight, backgroundColor: focused ? theme.colors.backgroundFocused : theme.colors.background }, inputContainerStyle]}
      >
        <View style={styles.inputContent}>
          {leftIcon ? <View style={[styles.iconSlotLeft, leftIconStyle]}>{leftIcon}</View> : null}
          <Text style={[styles.selectText, { color: displayValue ? theme.colors.text : theme.colors.placeholder, fontSize: theme.fontSize, fontFamily: theme.fontFamily || undefined }, inputStyle]} numberOfLines={1}>
            {displayValue || placeholder}
          </Text>
        </View>
        {rightIcon ? <View style={[styles.iconSlotRight, rightIconStyle]}>{rightIcon}</View> : <Ionicons name="chevron-down" size={14} color={theme.colors.placeholder} />}
      </Pressable>

      {hasError ? (
        <Text style={[styles.error, { fontSize: theme.errorFontSize, color: theme.colors.error, marginTop: theme.spacing.errorTopMargin }, errorStyle]}>
          {error}
        </Text>
      ) : null}

      <Modal visible={isOpen} transparent animationType="none" onRequestClose={closeSheet} statusBarTranslucent>
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]}>
          <Pressable style={styles.backdropPress} onPress={closeSheet} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { height: sheetHeight, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: theme.colors.background, transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] }) }] }]}>
          <View style={styles.handleBar}><View style={[styles.handle, { backgroundColor: theme.colors.border }]} /></View>
          {sheetTitle ? <Text style={[styles.sheetTitle, { color: theme.colors.text, fontSize: theme.fontSize + 2, fontFamily: theme.fontFamily || undefined }]}>{sheetTitle}</Text> : null}
          {searchable ? (
            <View style={styles.searchContainer}>
              <View style={[styles.searchInputWrapper, { borderColor: theme.colors.border, borderRadius: theme.borderRadius }]}>
                <Ionicons name="search" size={16} color={theme.colors.placeholder} style={{ marginRight: 8 }} />
                <TextInput value={searchText} onChangeText={setSearchText} placeholder="Search..." placeholderTextColor={theme.colors.placeholder} style={[styles.searchInput, { color: theme.colors.text, fontSize: theme.fontSize - 1, fontFamily: theme.fontFamily || undefined }]} autoFocus />
              </View>
            </View>
          ) : null}
          <ScrollView style={styles.optionsList} keyboardShouldPersistTaps="handled">
            {filteredOptions.map((option) => {
              const isSelected = selected.includes(option.value);
              if (renderOption) {
                return <Pressable key={String(option.value)} onPress={() => handleSelect(option)}>{renderOption(option, isSelected)}</Pressable>;
              }
              return (
                <Pressable key={String(option.value)} onPress={() => handleSelect(option)} style={[styles.optionRow, isSelected && { backgroundColor: theme.colors.backgroundFocused }]}>
                  {multiSelect ? (
                    <View style={[styles.checkbox, { borderColor: isSelected ? theme.colors.primary : theme.colors.border, backgroundColor: isSelected ? theme.colors.primary : 'transparent' }]}>
                      {isSelected ? <Ionicons name="checkmark" size={14} color="#FFF" /> : null}
                    </View>
                  ) : null}
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionLabel, { color: theme.colors.text, fontSize: theme.fontSize, fontFamily: theme.fontFamily || undefined, fontWeight: isSelected ? '600' : '400' }]}>{option.label}</Text>
                    {option.description ? <Text style={[styles.optionDescription, { color: theme.colors.placeholder, fontSize: theme.fontSize - 2 }]}>{option.description}</Text> : null}
                  </View>
                  {!multiSelect && isSelected ? <Ionicons name="checkmark" size={20} color={theme.colors.primary} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
          {multiSelect ? (
            <View style={[styles.doneContainer, { borderTopColor: theme.colors.border }]}>
              <TouchableOpacity onPress={closeSheet} style={[styles.doneButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.doneButtonText}>Done{selected.length > 0 ? ` (${selected.length})` : ''}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Animated.View>
      </Modal>
    </View>
  );
});

FieldSelect.displayName = 'FieldSelect';

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontWeight: '600' },
  selectInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, paddingHorizontal: 16 },
  inputContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconSlotLeft: { marginRight: 8 },
  iconSlotRight: { marginLeft: 8 },
  selectText: { flex: 1 },
  error: { fontWeight: '500' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  backdropPress: { flex: 1 },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 20 },
  handleBar: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  sheetTitle: { fontWeight: '700', textAlign: 'center', paddingBottom: 12 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, height: '100%', padding: 0 },
  optionsList: { flex: 1 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  optionContent: { flex: 1, gap: 2 },
  optionLabel: {},
  optionDescription: {},
  doneContainer: { borderTopWidth: 1, padding: 16 },
  doneButton: { height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  doneButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
