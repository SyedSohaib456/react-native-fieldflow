/**
 * Minimal action button — solid green primary, ghost secondary.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  compact = false,
}: ActionButtonProps) {
  const v = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        v.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={[styles.text, compact && styles.textCompact, v.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const VARIANTS = {
  primary: {
    button: {
      backgroundColor: C.accent,
    } as ViewStyle,
    text: {
      color: C.textOnAccent,
    },
  },
  secondary: {
    button: {
      backgroundColor: C.bgInput,
    } as ViewStyle,
    text: {
      color: C.textPrimary,
    },
  },
  outline: {
    button: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: C.border,
    } as ViewStyle,
    text: {
      color: C.textPrimary,
    },
  },
  danger: {
    button: {
      backgroundColor: C.danger + '10',
      borderWidth: 1,
      borderColor: C.danger + '30',
    } as ViewStyle,
    text: {
      color: C.danger,
    },
  },
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: ShowcaseSpacing.xl,
    borderRadius: ShowcaseRadius.md,
    minHeight: 48,
  },
  buttonCompact: {
    paddingVertical: 8,
    paddingHorizontal: ShowcaseSpacing.lg,
    minHeight: 36,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textCompact: {
    fontSize: 14,
  },
  disabledText: {
    color: C.textTertiary,
  },
});
