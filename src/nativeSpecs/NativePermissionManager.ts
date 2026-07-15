import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Permission Manager (Phase 018, ADR-031) — generic check/request bridge
 * over Android runtime permissions. No specific permission is baked in
 * here; callers pass the permission string (e.g.
 * 'android.permission.RECORD_AUDIO').
 */
export interface Spec extends TurboModule {
  checkPermission(permission: string): Promise<boolean>;
  requestPermission(permission: string): Promise<boolean>;
}

// .get() (nullable), not .getEnforcing() — same rationale as
// NativeBridgeInfo.ts: safe to import in Jest/Node.
export default TurboModuleRegistry.get<Spec>('PermissionManager');
