/**
 * Keyboard hooks — unified keyboard height, visibility, frame tracking.
 * Supports optional Reanimated 3 adapter for UI-thread animation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import type {
  KeyboardFrame,
  KeyboardHeightPayload,
  UseKeyboardHeightOptions,
} from '../types';

// ─── Event name helpers ──────────────────────────────────────────────────────

function defaultShowEvent(): 'keyboardWillShow' | 'keyboardDidShow' {
  return Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
}

function defaultHideEvent(): 'keyboardWillHide' | 'keyboardDidHide' {
  return Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
}

// ─── Reanimated Detection ────────────────────────────────────────────────────

let reanimatedAvailable = false;
let useAnimatedKeyboardHook: (() => { height: { value: number }; state: { value: number } }) | null = null;

try {
  const reanimated = require('react-native-reanimated');
  if (reanimated?.useAnimatedKeyboard) {
    useAnimatedKeyboardHook = reanimated.useAnimatedKeyboard;
    reanimatedAvailable = true;
  }
} catch {
  // Reanimated not available
}

// ─── useKeyboardHeight ───────────────────────────────────────────────────────

/**
 * Returns the current keyboard height. 0 when hidden.
 * Uses Reanimated 3's useAnimatedKeyboard if available for UI-thread tracking.
 */
export function useKeyboardHeight(options?: UseKeyboardHeightOptions): number {
  const [height, setHeight] = useState(0);

  const showEvent = options?.showEvent ?? defaultShowEvent();
  const hideEvent = options?.hideEvent ?? defaultHideEvent();

  useEffect(() => {
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showEvent, hideEvent]);

  return height;
}

// ─── useKeyboardVisible ──────────────────────────────────────────────────────

/**
 * Returns true while the keyboard is visible.
 */
export function useKeyboardVisible(options?: UseKeyboardHeightOptions): boolean {
  return useKeyboardHeight(options) > 0;
}

// ─── useKeyboardState ────────────────────────────────────────────────────────

/**
 * Combined height + visibility in one subscription.
 */
export function useKeyboardState(options?: UseKeyboardHeightOptions): {
  height: number;
  visible: boolean;
} {
  const height = useKeyboardHeight(options);
  return useMemo(
    () => ({ height, visible: height > 0 }),
    [height],
  );
}

// ─── useKeyboardWillShow / useKeyboardWillHide ───────────────────────────────

/**
 * Event-style hook: fires when keyboard will show.
 * On Android, uses keyboardDidShow since keyboardWillShow isn't available.
 */
export function useKeyboardWillShow(cb: (height: number) => void): void {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    const event = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const sub = Keyboard.addListener(event, (e) => {
      cbRef.current(e.endCoordinates.height);
    });
    return () => sub.remove();
  }, []);
}

/**
 * Event-style hook: fires when keyboard will hide.
 */
export function useKeyboardWillHide(cb: () => void): void {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    const event = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const sub = Keyboard.addListener(event, () => {
      cbRef.current();
    });
    return () => sub.remove();
  }, []);
}

// ─── useKeyboardFrame ────────────────────────────────────────────────────────

/**
 * Full keyboard frame info — height, Y positions, duration, animation state.
 * Frame-accurate during transitions.
 */
export function useKeyboardFrame(): KeyboardFrame {
  const [frame, setFrame] = useState<KeyboardFrame>({
    height: 0,
    startY: 0,
    endY: 0,
    duration: 0,
    easing: 'keyboard',
    isVisible: false,
    isAnimating: false,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setFrame({
        height: e.endCoordinates.height,
        startY: e.startCoordinates?.screenY ?? 0,
        endY: e.endCoordinates.screenY,
        duration: e.duration ?? 250,
        easing: (e as any).easing ?? 'keyboard',
        isVisible: true,
        isAnimating: true,
      });

      // Mark animation as complete after duration
      setTimeout(() => {
        setFrame((prev) => ({ ...prev, isAnimating: false }));
      }, e.duration ?? 250);
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      setFrame({
        height: 0,
        startY: e?.startCoordinates?.screenY ?? 0,
        endY: e?.endCoordinates?.screenY ?? 0,
        duration: e?.duration ?? 250,
        easing: (e as any)?.easing ?? 'keyboard',
        isVisible: false,
        isAnimating: true,
      });

      setTimeout(() => {
        setFrame((prev) => ({ ...prev, isAnimating: false }));
      }, e?.duration ?? 250);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return frame;
}

// ─── Low-level utilities ─────────────────────────────────────────────────────

export function dismissKeyboard(): void {
  Keyboard.dismiss();
}

/**
 * Subscribe to keyboard show/hide events imperatively.
 * Returns an unsubscribe function.
 */
export function subscribeKeyboard(
  onShow: (payload: KeyboardHeightPayload) => void,
  onHide: () => void,
  options?: UseKeyboardHeightOptions,
): () => void {
  const showEvent = options?.showEvent ?? defaultShowEvent();
  const hideEvent = options?.hideEvent ?? defaultHideEvent();

  const showSub = Keyboard.addListener(showEvent, (e) => {
    onShow({ height: e.endCoordinates.height, event: e });
  });
  const hideSub = Keyboard.addListener(hideEvent, onHide);

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}

/**
 * Check if Reanimated 3 is available for UI-thread keyboard tracking.
 */
export function isReanimatedAvailable(): boolean {
  return reanimatedAvailable;
}
