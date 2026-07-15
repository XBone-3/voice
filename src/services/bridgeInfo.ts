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
