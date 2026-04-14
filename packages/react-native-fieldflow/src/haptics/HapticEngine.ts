/**
 * Haptic Engine — Multi-fallback haptic feedback system.
 * Tries expo-haptics → react-native-haptic-feedback → Vibration API.
 * All detection is at runtime — zero hard dependencies.
 */

import { Vibration } from 'react-native';
import type { HapticStyle } from '../types';

type HapticProvider = 'expo' | 'community' | 'vibration' | 'none';

let cachedProvider: HapticProvider | null = null;
let expoHaptics: any = null;
let communityHaptics: any = null;

function detectProvider(): HapticProvider {
  if (cachedProvider !== null) return cachedProvider;

  // Try expo-haptics
  try {
    expoHaptics = require('expo-haptics');
    if (expoHaptics?.impactAsync) {
      cachedProvider = 'expo';
      return 'expo';
    }
  } catch {}

  // Try react-native-haptic-feedback
  try {
    communityHaptics = require('react-native-haptic-feedback');
    if (communityHaptics?.trigger) {
      cachedProvider = 'community';
      return 'community';
    }
  } catch {}

  // Fallback to Vibration API
  cachedProvider = 'vibration';
  return 'vibration';
}

function triggerExpo(style: HapticStyle): void {
  if (!expoHaptics) return;

  switch (style) {
    case 'light':
      expoHaptics.impactAsync(expoHaptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      expoHaptics.impactAsync(expoHaptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      expoHaptics.impactAsync(expoHaptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'selection':
      expoHaptics.selectionAsync();
      break;
    case 'success':
      expoHaptics.notificationAsync(expoHaptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      expoHaptics.notificationAsync(expoHaptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      expoHaptics.notificationAsync(expoHaptics.NotificationFeedbackType.Error);
      break;
  }
}

function triggerCommunity(style: HapticStyle): void {
  if (!communityHaptics) return;

  const typeMap: Record<HapticStyle, string> = {
    light: 'impactLight',
    medium: 'impactMedium',
    heavy: 'impactHeavy',
    selection: 'selection',
    success: 'notificationSuccess',
    warning: 'notificationWarning',
    error: 'notificationError',
  };

  communityHaptics.trigger(typeMap[style] ?? 'impactMedium');
}

function triggerVibration(style: HapticStyle): void {
  const patterns: Record<HapticStyle, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 40,
    selection: 5,
    success: 30,
    warning: [0, 20, 10, 20],
    error: [0, 30, 15, 30, 15, 30],
  } as any;

  const pattern = patterns[style] ?? 20;
  if (Array.isArray(pattern)) {
    Vibration.vibrate(pattern);
  } else {
    Vibration.vibrate(pattern);
  }
}

/**
 * Trigger haptic feedback with the specified style.
 * Automatically detects the best available haptic provider.
 */
export function triggerHaptic(style: HapticStyle | false): void {
  if (style === false) return;

  const provider = detectProvider();

  switch (provider) {
    case 'expo':
      triggerExpo(style);
      break;
    case 'community':
      triggerCommunity(style);
      break;
    case 'vibration':
      triggerVibration(style);
      break;
    case 'none':
      break;
  }
}

/**
 * Check if haptic feedback is available on this device.
 */
export function isHapticAvailable(): boolean {
  return detectProvider() !== 'none';
}
