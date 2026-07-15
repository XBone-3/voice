import NativePermissionManager from '@nativeSpecs/NativePermissionManager';
import { logger } from '@logger';

/**
 * Thin, typed wrapper around the PermissionManager TurboModule (ADR-031).
 * No business logic — generic over any Android permission string; no
 * automatic requests are ever made from this file, per
 * NON_FUNCTIONAL_REQUIREMENTS.md's "never request permissions before
 * needed." Callers decide when to check/request.
 */
export async function checkPermission(permission: string): Promise<boolean> {
  if (NativePermissionManager == null) {
    logger.warn('permissions', 'PermissionManager module is not linked');
    return false;
  }

  return NativePermissionManager.checkPermission(permission);
}

export async function requestPermission(permission: string): Promise<boolean> {
  if (NativePermissionManager == null) {
    logger.warn('permissions', 'PermissionManager module is not linked');
    return false;
  }

  return NativePermissionManager.requestPermission(permission);
}
