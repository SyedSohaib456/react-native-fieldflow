/**
 * Dedicated icon button for headers and compact actions.
 * Optimized for circular 40x40 touch targets.
 */
import {
  ShowcaseColors as C
} from '@/constants/showcase-theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, type ViewStyle } from 'react-native';

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export function IconButton({
  icon,
  onPress,
  color = C.accent,
  size = 24,
  backgroundColor = C.bgSecondary,
  style
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        Platform.OS === 'android' && { backgroundColor },
        pressed && styles.pressed,
        style
      ]}
    >
      <Ionicons name={icon} size={size} color={color} style={{ alignSelf: 'center', marginLeft: Platform.OS === 'android' ? 0 : 4 }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: Platform.OS === 'android' ? 40 : 30,
    height: Platform.OS === 'android' ? 40 : 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'android' ? 4 : 0,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
