import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

import type { KeyboardHeightPayload, UseKeyboardHeightOptions } from './types';

function defaultShowEvent(): 'keyboardWillShow' | 'keyboardDidShow' {
  return Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
}

function defaultHideEvent(): 'keyboardWillHide' | 'keyboardDidHide' {
  return Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
}

/**
 * Subscribes to keyboard frame changes. Height is `0` when hidden.
 */
export function useKeyboardHeight(options?: UseKeyboardHeightOptions): number {
  const [height, setHeight] = useState(0);

  const showEvent = options?.showEvent ?? defaultShowEvent();
  const hideEvent = options?.hideEvent ?? defaultHideEvent();

  useEffect(() => {
    const showSub = Keyboard.addListener(showEvent, e => {
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

export function useKeyboardVisible(options?: UseKeyboardHeightOptions): boolean {
  return useKeyboardHeight(options) > 0;
}

/**
 * Height plus visibility in one subscription (avoids double listener vs two separate hooks).
 */
export function useKeyboardState(options?: UseKeyboardHeightOptions): {
  height: number;
  visible: boolean;
} {
  const height = useKeyboardHeight(options);
  return useMemo(
    () => ({
      height,
      visible: height > 0,
    }),
    [height],
  );
}

export function dismissKeyboard(): void {
  Keyboard.dismiss();
}

/**
 * Low-level: run callbacks on show/hide with the same event names the form uses by default.
 */
export function subscribeKeyboard(
  onShow: (payload: KeyboardHeightPayload) => void,
  onHide: () => void,
  options?: UseKeyboardHeightOptions,
): () => void {
  const showEvent = options?.showEvent ?? defaultShowEvent();
  const hideEvent = options?.hideEvent ?? defaultHideEvent();

  const showSub = Keyboard.addListener(showEvent, e => {
    onShow({ height: e.endCoordinates.height, event: e });
  });
  const hideSub = Keyboard.addListener(hideEvent, onHide);

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}
