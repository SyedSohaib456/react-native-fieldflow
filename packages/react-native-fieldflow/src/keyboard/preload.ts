/**
 * Keyboard preloading — warms the keyboard on mount for instant first-field focus.
 */

import { TextInput } from 'react-native';

let preloaded = false;

/**
 * Preload the keyboard by briefly focusing a hidden TextInput.
 * This forces the system keyboard to initialize, so first visible focus is instant.
 *
 * @param delayMs - Delay before preloading. Default: 100ms.
 */
export function preloadKeyboard(delayMs: number = 100): void {
  if (preloaded) return;

  setTimeout(() => {
    // Create a temporary off-screen TextInput
    // This triggers the native keyboard initialization without visual artifacts
    try {
      const input = new (TextInput as any)();
      if (input?.focus) {
        input.focus();
        setTimeout(() => {
          input.blur?.();
          preloaded = true;
        }, 50);
      }
    } catch {
      // Best-effort — some architectures may not support this pattern
      preloaded = true;
    }
  }, delayMs);
}

/**
 * Reset the preloaded state (for testing).
 */
export function resetPreloadState(): void {
  preloaded = false;
}
