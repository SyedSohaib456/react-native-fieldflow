/**
 * Simple section label with optional description.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ShowcaseColors as C,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

interface SectionLabelProps {
  title: string;
  description?: string;
}

export function SectionLabel({ title, description }: SectionLabelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: C.textTertiary,
    lineHeight: 20,
  },
});
