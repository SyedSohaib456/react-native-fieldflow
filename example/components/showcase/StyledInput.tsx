/**
 * Minimal styled TextInput with Ionicons icon support.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { FieldInput, type FieldInputProps } from '../../../packages/react-native-fieldflow/src';
import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

export interface StyledInputProps extends FieldInputProps {
  label?: string;
  hint?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Render as a plain TextInput (no KeyboardForm registration). */
  plain?: boolean;
}

export const StyledInput = forwardRef<TextInput, StyledInputProps>(
  ({ label, hint, icon, plain, style, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    const InputComp = plain ? TextInput : FieldInput;

    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.row, focused && styles.rowFocused]}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={focused ? C.accent : C.textTertiary}
              style={styles.icon}
            />
          ) : null}
          <InputComp
            ref={ref as any}
            placeholderTextColor={C.textTertiary}
            style={[styles.input, icon ? styles.inputWithIcon : null, style]}
            onFocus={e => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={e => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            {...rest}
          />
        </View>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    );
  },
);

StyledInput.displayName = 'StyledInput';

const styles = StyleSheet.create({
  wrapper: {
    gap: ShowcaseSpacing.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: C.textPrimary,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowFocused: {
    backgroundColor: C.bgInputFocused,
    borderColor: C.borderFocused,
  },
  icon: {
    marginLeft: ShowcaseSpacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: C.textPrimary,
    paddingHorizontal: ShowcaseSpacing.lg,
    paddingVertical: 14,
    lineHeight: 22,
  },
  inputWithIcon: {
    paddingLeft: ShowcaseSpacing.sm,
  },
  hint: {
    fontSize: 13,
    color: C.textTertiary,
    marginLeft: 2,
  },
});
