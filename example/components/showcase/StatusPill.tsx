/**
 * Compact status pill — shows live values with a dot indicator.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

interface StatusPillProps {
  label: string;
  value: string;
  active?: boolean;
}

export function StatusPill({
  label,
  value,
  active = false,
}: StatusPillProps) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      <View style={[styles.dot, active && styles.dotActive]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, active && styles.valueActive]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.bgInput,
    borderRadius: ShowcaseRadius.full,
    paddingHorizontal: ShowcaseSpacing.md,
    paddingVertical: 6,
  },
  pillActive: {
    backgroundColor: C.accentLight,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.textTertiary,
  },
  dotActive: {
    backgroundColor: C.accent,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  valueActive: {
    color: C.accent,
  },
});
