import { name as APP_NAME, version as APP_VERSION } from '../../package.json';

export const IS_DEV = __DEV__;
export { APP_NAME, APP_VERSION };

/**
 * Per-engine feature flags. Screens stay hidden from navigation until their
 * backing Kotlin engine is actually built, so Phase 007+ never links to
 * unimplemented functionality (see ADR-019). Flip to `true` as each engine's
 * roadmap phases complete. Home and Settings are unconditional shell screens
 * and are not gated here.
 */
export const FEATURES = {
  assistant: false,
  notifications: false,
  automation: false,
  memory: false,
  history: false,
  plugins: false,
  developer: IS_DEV,
  diagnostics: IS_DEV,
} as const;
