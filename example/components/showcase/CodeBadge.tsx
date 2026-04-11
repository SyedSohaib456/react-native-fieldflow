/**
 * Inline code badge — subtle monospace chip.
 */
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

interface CodeBadgeProps {
  children: string;
}

export function CodeBadge({ children }: CodeBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: C.bgInput,
    borderRadius: 6,
    paddingHorizontal: ShowcaseSpacing.sm,
    paddingVertical: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textSecondary,
    ...Platform.select({
      ios: { fontFamily: 'ui-monospace' },
      default: { fontFamily: 'monospace' },
    }),
  },
});
