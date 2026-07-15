import { NativeEventEmitter } from 'react-native';
import NativeLifecycleManager from '@nativeSpecs/NativeLifecycleManager';
import { logger } from '@logger';

/**
 * Thin, typed wrapper around the LifecycleManager TurboModule (ADR-033).
 * No business logic — this is a real, native process-lifecycle signal
 * (ProcessLifecycleOwner), distinct from RN's own JS-only AppState:
 * future native engines can subscribe to services/LifecycleManager.kt
 * directly, without going through JS at all.
 */
export async function isInForeground(): Promise<boolean | null> {
  if (NativeLifecycleManager == null) {
    logger.warn('lifecycle', 'LifecycleManager module is not linked');
    return null;
  }

  return NativeLifecycleManager.isInForeground();
}

export function subscribeToLifecycle(
  callback: (foreground: boolean) => void,
): () => void {
  if (NativeLifecycleManager == null) {
    logger.warn('lifecycle', 'LifecycleManager module is not linked');
    return () => {};
  }

  const emitter = new NativeEventEmitter(NativeLifecycleManager);
  const subscription = emitter.addListener('onLifecycleChanged', callback);
  return () => subscription.remove();
}
