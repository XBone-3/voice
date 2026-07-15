import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * First native module (Phase 016, ADR-028) — proves the TurboModule
 * pattern end-to-end with the smallest honest slice: one method reading
 * a real native value. Full device information is deliberately Phase
 * 022's job, not this one. Promise-based, not synchronous: see ADR-029.
 */
export interface Spec extends TurboModule {
  getAndroidVersion(): Promise<string>;
}

// .get() (nullable), not .getEnforcing() — matches react-native-screens'
// own real spec (NativeScreensModule.ts): safe to import in Jest/Node,
// where the native module genuinely isn't linked, without hard-crashing.
export default TurboModuleRegistry.get<Spec>('NativeBridgeInfo');
