/**
 * Feature card with Ionicons and optional toggle.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import {
  ShowcaseColors as C,
  ShowcaseRadius,
  ShowcaseSpacing,
} from '@/constants/showcase-theme';

interface FeatureCardProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress?: () => void;
  /** Show a toggle switch for toggle-able features. */
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
}

export function FeatureCard({
  icon,
  title,
  description,
  onPress,
  toggleValue,
  onToggle,
}: FeatureCardProps) {
  const hasToggle = toggleValue !== undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress && styles.cardPressed,
      ]}>
      {icon ? (
        <Ionicons name={icon} size={20} color={C.textSecondary} style={styles.icon} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: C.border, true: C.accent }}
          thumbColor="#fff"
          ios_backgroundColor={C.border}
        />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={18} color={C.textTertiary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bgPrimary,
    borderRadius: ShowcaseRadius.md,
    padding: ShowcaseSpacing.lg,
    borderWidth: 1,
    borderColor: C.border,
    gap: ShowcaseSpacing.md,
  },
  cardPressed: {
    backgroundColor: C.bgInput,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: C.textPrimary,
  },
  description: {
    fontSize: 14,
    color: C.textSecondary,
    lineHeight: 20,
  },
});
