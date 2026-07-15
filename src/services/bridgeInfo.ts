import { NativeEventEmitter } from 'react-native';
import NativeBridgeInfo from '@nativeSpecs/NativeBridgeInfo';
import { logger } from '@logger';

/**
 * Thin, typed wrapper around the NativeBridgeInfo TurboModule (ADR-028) —
 * services/'s first real consumer, per its own Phase-005 README. No
 * business logic: translate the native call, log + recover if the module
 * isn't available (e.g. Jest, or a build where linking failed), per
 * ENGINEERING_PRINCIPLES.md's Error Handling ("log, recover, inform,
 * continue whenever possible").
 */
export async function getAndroidVersion(): Promise<string | null> {
  if (NativeBridgeInfo == null) {
    logger.warn('bridgeInfo', 'NativeBridgeInfo module is not linked');
    return null;
  }

  return NativeBridgeInfo.getAndroidVersion();
}

/**
 * Subscribes to the native onMemoryPressure event (Phase 017, ADR-030) —
 * a real Android system signal (ComponentCallbacks2.onTrimMemory), not a
 * simulated one. Returns an unsubscribe function; safe to call even when
 * the module isn't linked (e.g. Jest), in which case it's a no-op.
 */
export function subscribeToMemoryPressure(
  callback: (level: number) => void,
): () => void {
  if (NativeBridgeInfo == null) {
    logger.warn('bridgeInfo', 'NativeBridgeInfo module is not linked');
    return () => {};
  }

  const emitter = new NativeEventEmitter(NativeBridgeInfo);
  const subscription = emitter.addListener('onMemoryPressure', callback);
  return () => subscription.remove();
}
