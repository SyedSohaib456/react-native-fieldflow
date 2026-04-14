import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useFieldFlowContext, useFieldError } from '../core/FormContext';
import { useTheme } from '../theme/ThemeContext';
import { triggerHaptic } from '../haptics/HapticEngine';
import type { FieldPhoneProps } from '../types';

// ─── Constants ──────────────────────────────────────────────────────────────

const { height: windowHeight } = Dimensions.get('window');

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatPhoneNumber = (digits: string, dialCode: string) => {
  if (dialCode === '+1') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
  return digits;
};

const toE164 = (digits: string, dialCode: string) => {
  return `${dialCode}${digits}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const FieldPhone = forwardRef<TextInput, FieldPhoneProps>((props, ref) => {
  const {
    defaultCountry = 'US',
    showFlag = true,
    showDialCode = true,
    placeholder = '000 000 0000',
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
  const [country, setCountry] = useState<Country>(
    COUNTRIES.find((c) => c.code === defaultCountry) || COUNTRIES[0],
  );
  const [phoneText, setPhoneText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

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
      type: 'phone',
      order: Date.now(),
    });

    ctx.store.getState().setValue(name, '');

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
    const digits = text.replace(/\D/g, '');
    const formatted = formatPhoneNumber(digits, country.dialCode);
    setPhoneText(formatted);
    ctx?.store.getState().setValue(name, toE164(digits, country.dialCode));
  }, [ctx, name, country]);

  const openPicker = useCallback(() => {
    setPickerOpen(true);
    setSearchText('');
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 200 }),
      Animated.timing(backdropAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, backdropAnim]);

  const closePicker = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setPickerOpen(false));
  }, [slideAnim, backdropAnim]);

  const selectCountry = useCallback((c: Country) => {
    setCountry(c);
    closePicker();
    const digits = phoneText.replace(/\D/g, '');
    ctx?.store.getState().setValue(name, toE164(digits, c.dialCode));
    setTimeout(() => internalRef.current?.focus(), 300);
  }, [closePicker, phoneText, ctx, name]);

  const filteredCountries = searchText
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.dialCode.includes(searchText),
      )
    : COUNTRIES;

  const [focused, setFocused] = useState(false);
  const borderColor = hasError
    ? theme.colors.error
    : focused
    ? theme.colors.borderFocused
    : theme.colors.border;

  const sheetHeight = Math.min(windowHeight * 0.65, 550);

  return (
    <View style={[styles.container, containerStyle]}>
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
        {leftIcon ? (
          <View style={[styles.customIconLeft, leftIconStyle]}>
            {leftIcon}
          </View>
        ) : null}

        {/* Country picker button */}
        <Pressable onPress={openPicker} style={styles.countryButton}>
          {showFlag ? <Text style={styles.flag}>{country.flag}</Text> : null}
          {showDialCode ? (
            <Text
              style={[
                styles.dialCode,
                { color: theme.colors.text, fontFamily: theme.fontFamily || undefined },
              ]}
            >
              {country.dialCode}
            </Text>
          ) : null}
          <Ionicons name="chevron-down" size={12} color={theme.colors.placeholder} />
        </Pressable>

        {/* Separator */}
        <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />

        {/* Phone input */}
        <TextInput
          ref={setRefs}
          value={phoneText}
          onChangeText={handleChangeText}
          onFocus={() => {
            setFocused(true);
            ctx?.store.getState().setFocusedField(name);
            if (ctx?.autoScroll) ctx.scrollFieldIntoView(name);
            if (theme.hapticStyle) triggerHaptic(theme.hapticStyle);
          }}
          onBlur={() => {
            setFocused(false);
            ctx?.store.getState().setFocusedField(null);
            ctx?.store.getState().setTouched(name, true);
            if (ctx?.validateOn === 'blur') ctx.validateField(name);
          }}
          onSubmitEditing={() => {
            if (ctx?.isLastField(name)) {
              ctx.submitForm();
            } else if (ctx?.chainEnabled) {
              ctx.focusNext(name);
            }
          }}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          returnKeyType={ctx?.autoReturnKeyType ? (ctx.isLastField(name) ? 'done' : 'next') : undefined}
          blurOnSubmit={false}
          style={[
            styles.phoneInput,
            {
              fontSize: theme.fontSize,
              color: theme.colors.text,
              fontFamily: theme.fontFamily || undefined,
            },
            inputStyle,
          ]}
          accessibilityLabel={label ?? 'Phone number'}
        />

        {rightIcon ? (
          <View style={[styles.customIconRight, rightIconStyle]}>
            {rightIcon}
          </View>
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

      {/* Country Picker Sheet */}
      <Modal visible={pickerOpen} transparent animationType="none" onRequestClose={closePicker} statusBarTranslucent>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]}
        >
          <Pressable style={styles.backdropPress} onPress={closePicker} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              backgroundColor: theme.colors.background,
              transform: [{
                translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] }),
              }],
            },
          ]}
        >
          <View style={styles.handleBar}>
            <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          </View>

          <Text
            style={[
              styles.sheetTitle,
              { color: theme.colors.text, fontSize: theme.fontSize + 2, fontFamily: theme.fontFamily || undefined },
            ]}
          >
            Select Country
          </Text>

          <View style={styles.searchContainer}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search country..."
              placeholderTextColor={theme.colors.placeholder}
              style={[
                styles.searchInput,
                { borderColor: theme.colors.border, borderRadius: theme.borderRadius, color: theme.colors.text },
              ]}
              autoFocus
            />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredCountries.map((c) => (
              <Pressable
                key={c.code}
                onPress={() => selectCountry(c)}
                style={[
                  styles.countryRow,
                  c.code === country.code && { backgroundColor: theme.colors.backgroundFocused },
                ]}
              >
                <Text style={styles.countryFlag}>{c.flag}</Text>
                <Text
                  style={[
                    styles.countryName,
                    { color: theme.colors.text, fontFamily: theme.fontFamily || undefined },
                  ]}
                >
                  {c.name}
                </Text>
                <Text style={[styles.countryDial, { color: theme.colors.placeholder }]}>
                  {c.dialCode}
                </Text>
                {c.code === country.code ? (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
});

FieldPhone.displayName = 'FieldPhone';

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  label: { fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  flag: { fontSize: 20 },
  dialCode: { fontSize: 15, fontWeight: '600' },
  separator: { width: 1.5, height: '50%' },
  phoneInput: { flex: 1, height: '100%', paddingHorizontal: 12 },
  customIconLeft: { marginLeft: 12 },
  customIconRight: { marginRight: 12 },
  error: { fontWeight: '500' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  backdropPress: { flex: 1 },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 20,
  },
  handleBar: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  sheetTitle: { fontWeight: '700', textAlign: 'center', paddingBottom: 12 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInput: { borderWidth: 1, paddingHorizontal: 14, height: 42 },
  countryRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12,
  },
  countryFlag: { fontSize: 24 },
  countryName: { flex: 1, fontSize: 16 },
  countryDial: { fontSize: 14 },
});
