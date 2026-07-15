import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

/**
 * Lifecycle Manager (Phase 020, ADR-033) — exposes the app's real
 * process-level foreground/background state (via ProcessLifecycleOwner)
 * as both a command (current snapshot) and an event stream (future
 * transitions), reusing the two bridge patterns proven in Phase
 * 016/017. Independent of the deferred Foreground Service (ADR-032).
 */
export interface Spec extends TurboModule {
  isInForeground(): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

// .get() (nullable), not .getEnforcing() — same rationale as
// NativeBridgeInfo.ts: safe to import in Jest/Node.
export default TurboModuleRegistry.get<Spec>('LifecycleManager');
