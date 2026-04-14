/**
 * Platform-parity components — cross-platform keyboard-tracking views.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import { useKeyboardHeight } from '../keyboard/hooks';
import type {
  KeyboardStickyViewProps,
  OverFieldViewProps,
  KeyboardFillViewProps,
  KeyboardBackgroundSyncProps,
} from '../types';

// ─── KeyboardStickyView ──────────────────────────────────────────────────────

/**
 * A view that sticks above the keyboard — rises when keyboard opens,
 * returns to bottom when it closes. Perfect for submit buttons.
 */
export function KeyboardStickyView(props: KeyboardStickyViewProps) {
  const { offset = {}, style, children } = props;
  const { closed: closedOffset = 0, opened: openedOffset = 8 } = offset;

  const keyboardHeight = useKeyboardHeight();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = keyboardHeight > 0
      ? -(keyboardHeight + openedOffset)
      : -closedOffset;

    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [keyboardHeight, closedOffset, openedOffset]);

  return (
    <Animated.View
      style={[
        styles.stickyView,
        { transform: [{ translateY }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

KeyboardStickyView.displayName = 'KeyboardStickyView';

// ─── OverFieldView ───────────────────────────────────────────────────────────

/**
 * Renders a view between content and keyboard.
 * Slides in/out with animation. Use for emoji pickers, GIF pickers, etc.
 */
export function OverFieldView(props: OverFieldViewProps) {
  const {
    visible,
    height = 260,
    animationDuration = 200,
    onShow,
    onHide,
    style,
    children,
  } = props;

  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start(() => {
      if (visible) onShow?.();
      else onHide?.();
    });
  }, [visible, animationDuration]);

  return (
    <Animated.View
      style={[
        styles.overFieldView,
        {
          height,
          opacity: slideAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [height, 0],
            }),
          }],
        },
        style,
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
}

OverFieldView.displayName = 'OverFieldView';

// ─── KeyboardFillView ────────────────────────────────────────────────────────

/**
 * Fills exactly the keyboard space with a custom view.
 * Use for custom keyboards (calculators, color pickers, date pickers).
 */
export function KeyboardFillView(props: KeyboardFillViewProps) {
  const {
    height: customHeight,
    animationDuration = 200,
    style,
    children,
  } = props;

  const keyboardHeight = useKeyboardHeight();
  const [cachedHeight, setCachedHeight] = useState(300); // Reasonable default

  // Cache keyboard height for when keyboard is hidden but fill view is shown
  useEffect(() => {
    if (keyboardHeight > 0) {
      setCachedHeight(keyboardHeight);
    }
  }, [keyboardHeight]);

  const finalHeight = customHeight ?? cachedHeight;

  return (
    <View style={[styles.fillView, { height: finalHeight }, style]}>
      {children}
    </View>
  );
}

KeyboardFillView.displayName = 'KeyboardFillView';

// ─── KeyboardBackgroundSync ──────────────────────────────────────────────────

/**
 * Sets the area behind/below the keyboard to match your UI color.
 * iOS only — Android keyboard background is system-controlled.
 */
export function KeyboardBackgroundSync(props: KeyboardBackgroundSyncProps) {
  const { color } = props;

  // This is primarily a visual hack — we draw a colored view at screen bottom
  if (Platform.OS !== 'ios') return null;

  const resolvedColor = typeof color === 'string' ? color : color?.light ?? '#F5F5F5';

  return (
    <View
      style={[
        styles.bgSync,
        { backgroundColor: resolvedColor },
      ]}
    />
  );
}

KeyboardBackgroundSync.displayName = 'KeyboardBackgroundSync';

// ─── SoftInputMode (Android) ─────────────────────────────────────────────────

export enum SoftInputMode {
  ADJUST_RESIZE = 'adjustResize',
  ADJUST_PAN = 'adjustPan',
  ADJUST_NOTHING = 'adjustNothing',
}

/**
 * Change Android's softInputMode at runtime.
 * No-op on iOS.
 */
export function setSoftInputMode(_mode: SoftInputMode): void {
  // This requires a native module to actually work.
  // Without native code, we can only hint via documentation.
  // Best-effort: this is a no-op in pure JS.
  if (__DEV__) {
    console.log(`[FieldFlow] setSoftInputMode: ${_mode} (requires native module — no-op in JS-only mode)`);
  }
}

/**
 * Hook version of setSoftInputMode.
 */
export function useSoftInputMode(mode: SoftInputMode, deps: any[] = []): void {
  useEffect(() => {
    setSoftInputMode(mode);
    // No cleanup needed since this is a no-op without native module
  }, [mode, ...deps]);
}

const styles = StyleSheet.create({
  stickyView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  overFieldView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  fillView: {
    overflow: 'hidden',
  },
  bgSync: {
    position: 'absolute',
    bottom: -500,
    left: 0,
    right: 0,
    height: 500,
  },
});
