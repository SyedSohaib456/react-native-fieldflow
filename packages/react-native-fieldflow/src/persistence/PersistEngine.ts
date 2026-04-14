/**
 * Persistence Engine — Auto-save/restore form values.
 * Uses MMKV if available, falls back to AsyncStorage, then no-op.
 */

import type { PersistStorage } from '../types';

let cachedStorage: PersistStorage | null = null;
let storageDetected = false;

/**
 * Detects the best available storage at runtime.
 * Priority: react-native-mmkv → @react-native-async-storage/async-storage → no-op
 */
function detectStorage(): PersistStorage | null {
  if (storageDetected) return cachedStorage;
  storageDetected = true;

  // Try MMKV first (best performance)
  try {
    const mmkvModule = require('react-native-mmkv');
    if (mmkvModule?.MMKV) {
      const storage = new mmkvModule.MMKV({ id: 'fieldflow-persist' });
      cachedStorage = {
        getItem: (key: string) => storage.getString(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      };
      return cachedStorage;
    }
  } catch {}

  // Try AsyncStorage
  try {
    const asyncStorage = require('@react-native-async-storage/async-storage');
    const as = asyncStorage.default ?? asyncStorage;
    if (as?.getItem) {
      cachedStorage = {
        getItem: (key: string) => as.getItem(key),
        setItem: (key: string, value: string) => as.setItem(key, value),
        removeItem: (key: string) => as.removeItem(key),
      };
      return cachedStorage;
    }
  } catch {}

  return null;
}

/**
 * Get the default storage adapter (auto-detected).
 */
export function getDefaultStorage(): PersistStorage | null {
  return detectStorage();
}

const PERSIST_PREFIX = '@fieldflow:';

/**
 * Save form values to persistent storage.
 */
export async function persistFormValues(
  key: string,
  values: Record<string, unknown>,
  storage?: PersistStorage,
): Promise<void> {
  const s = storage ?? detectStorage();
  if (!s) return;

  try {
    const serialized = JSON.stringify(values);
    await s.setItem(`${PERSIST_PREFIX}${key}`, serialized);
  } catch {
    // Silently fail — persistence is best-effort
  }
}

/**
 * Restore form values from persistent storage.
 */
export async function restoreFormValues(
  key: string,
  storage?: PersistStorage,
): Promise<Record<string, unknown> | null> {
  const s = storage ?? detectStorage();
  if (!s) return null;

  try {
    const raw = await s.getItem(`${PERSIST_PREFIX}${key}`);
    if (raw) {
      return JSON.parse(raw) as Record<string, unknown>;
    }
  } catch {
    // Silently fail
  }

  return null;
}

/**
 * Clear persisted form data for a given key.
 */
export async function clearPersistedForm(
  key: string,
  storage?: PersistStorage,
): Promise<void> {
  const s = storage ?? detectStorage();
  if (!s) return;

  try {
    await s.removeItem(`${PERSIST_PREFIX}${key}`);
  } catch {
    // Silently fail
  }
}
