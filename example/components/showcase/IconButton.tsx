/**
 * Dedicated icon button for headers and compact actions.
 * Optimized for circular 40x40 touch targets.
 */
import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ShowcaseColors as C, 
  ShowcaseRadius
} from '@/constants/showcase-theme';

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
        { backgroundColor },
        pressed && styles.pressed,
        style
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
