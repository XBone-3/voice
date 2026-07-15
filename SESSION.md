# SESSION.md

# Nova Development Session

Last Updated

2026-07-15

---

## Repository

Status

🟢 Healthy

Branch

main

Build (`cd android && ./gradlew assembleDebug`)

✅ Passing (fully clean rebuild this session — see Notes)

Lint (`npx eslint .`)

✅ Passing

Format (`npx prettier --check .` / `npm run format:check`)

✅ Passing

TypeScript (`npx tsc --noEmit`)

✅ Passing

Unit Tests (`npx jest`)

✅ Passing (9 suites, 34 tests — 1 new suite/test this phase: `bridgeInfo.test.tsx`)

Physical Device

✅ Verified — native bridge call confirmed working end-to-end across two independent relaunches (see Testing)

Documentation

✅ Updated

---

## Development Progress

Current Stage

Stage 1 — Foundation (native Kotlin work now underway; no formal "Stage 2" name has been defined in any document, so none is invented here)

Current Phase

Phase 017

Turbo Module Setup

Last Completed

Phase 016

Native Module Infrastructure — first native Kotlin module, registered and verified working end-to-end on the physical device (ADR-028's layout, ADR-029's fix)

Completion

16 / 100 Phases

---

## Current Objective

Phase 017 (Turbo Module Setup) is next per PROJECT_ROADMAP.md — not yet planned in detail.

---

## Completed This Session

✔ **First native Kotlin code in the project.** `src/nativeSpecs/NativeBridgeInfo.ts` (TurboModule spec, `getAndroidVersion(): Promise<string>`), `android/app/src/main/java/com/voice/bridge/NativeBridgeInfoModule.kt` (implementation) and `BridgePackage.kt` (`BaseReactPackage`, following react-native-screens' own real pattern), registered manually in `MainApplication.kt`'s `packageList` per RN's documented pattern for non-autolinked packages. `src/services/bridgeInfo.ts` is `services/`'s first real consumer; wired into `App.tsx`'s existing mount effect.

✔ **Deep on-device debugging investigation.** The first native build succeeded (after fixing one real deprecation warning — a 7-arg vs. 6-arg `ReactModuleInfo` constructor), but `TurboModuleRegistry.get('NativeBridgeInfo')` kept returning `null` in JS despite native logging confirming `BridgePackage.getModule()` was invoked and did return a valid instance. Ruled out, one at a time, with device evidence: stale installed APK, stale Metro bundle (confirmed via `--reset-cache`), synchronous vs. Promise-based method signature, and the `useTurboModuleInterop` New-Architecture feature flag (force-disabled via `dangerouslyForceOverride`, confirmed at `false` via logging — still failed, so reverted).

✔ **Isolated the bug to this project specifically**, not RN 0.86 or Bridgeless generally, by scaffolding a throwaway minimal RN 0.86 app from scratch with the identical manually-registered `BaseReactPackage` pattern (including the Promise-based signature and a two-hop service-wrapper JS structure). It worked correctly on the first try.

✔ **Root cause: stale build artifacts** accumulated in this project's own `node_modules`/`android/build`/`android/app/build`/`android/.gradle`/Metro transform cache across the phase's own iterative edits. A fully clean rebuild (`rm -rf node_modules android/build android/app/build android/.gradle`, fresh `npm install`, fresh `gradlew assembleDebug` — 136/136 tasks executed, none cached — plus Metro `--reset-cache`) fixed it immediately. Confirmed via `adb logcat` across two independent relaunches: `'[App] Native bridge OK — Android 16'`.

✔ Kept the Promise-based method signature as a permanent improvement (safer default than `isBlockingSynchronousMethod`, independent of the root cause). Reverted the feature-flag override and all temporary debug logging once they were proven not to be the fix.

✔ Recorded the full investigation, the elimination process, and a new standing practice (clean-rebuild-first when native behavior seems "impossible" after several same-session rebuilds; build a throwaway minimal repro when a bug's cause is ambiguous between project and platform) as ADR-029.

✔ Full regression suite re-run after the clean rebuild: `eslint`/`prettier`/`tsc`/`jest` (9 suites, 34 tests) all pass, `gradlew assembleDebug` clean, on-device verification confirmed twice.

---

## Pending

Phase 017 — Turbo Module Setup — not yet planned

Phase 018 onward — per PROJECT_ROADMAP.md, none started

---

## Blockers

None.

---

## Known Issues

1. App identity is still CLI default: `package.json` name is `"Voice"`, Android `applicationId` is `com.voice`, no "Nova" branding, icons, or naming has been applied yet.

2. `FEATURES` in `src/env/index.ts` (ADR-019) must be updated by hand as each engine's phases complete — nothing currently enforces that a flag reflects reality.

3. The six not-yet-enabled screens remain README-only with no component and no registered route — intentional (ADR-019/ADR-020), not an oversight.

4. The theme preference does not persist across app restarts (ADR-024) — deliberate, temporary, until Phase 023/024.

5. Logger has no content-based redaction yet (ADR-026) — a documented convention, not enforced in code.

6. `Button` and `MenuLink` (`src/components/`) duplicate similar Pressable+ripple styling — a deliberate, small, accepted tradeoff (ADR-027).

7. Accessibility (TalkBack, dynamic font scaling, contrast) has never been explicitly audited across the real screens/components built so far (flagged in Phase 015). Not urgent (Phase 094 exists later in the roadmap), but still open.

8. **New this session:** the exact stale build artifact that caused Phase 016's on-device failure was never isolated — only that a full clean rebuild fixed it (ADR-029). If native modules misbehave again after several same-session rebuilds, try a clean rebuild before deep architectural investigation.

---

## Technical Debt

- App branding/identity not yet applied (see Known Issues #1).
- Alias definitions still require keeping two files in sync by hand (`babel.config.js`, `tsconfig.json`) — 11 aliases (`@nativeSpecs` added this phase).
- Settings persistence is a known, explicit gap until Phase 023/024 (see Known Issues #4).
- Accessibility unaudited (see Known Issues #7).

---

## Physical Device

Primary Device

I2219

Android Version

16 (API 36)

USB Debugging

Enabled

ADB

Verified — `adb devices` reports `10BEAG3HR7003TF	device`

---

## Testing

Last Tested

2026-07-15

Tests Performed

✔ `npx eslint .` — pass

✔ `npx prettier --check .` — pass

✔ `npx tsc --noEmit` — pass

✔ `npx jest` — pass (9 suites, 34 tests; 1 new suite: `bridgeInfo.test.tsx`, confirming null-return + warning-log behavior when the native module isn't linked, e.g. in Jest/Node)

✔ `cd android && ./gradlew assembleDebug` — BUILD SUCCESSFUL, fully clean rebuild (136/136 tasks executed, zero cached), zero compiler warnings

✔ Installed and launched on the physical device across two independent relaunches; `adb logcat` confirmed `'[App] Native bridge OK — Android 16'` both times, no crashes

Pending

No voice, wake word, or speech recognition code exists yet. Accessibility audit (Known Issues #7) not yet performed.

---

## Architecture Status

Repository state matches:

✔ PROJECT_MANIFEST.md platform policy

✔ CLAUDE.md

✔ ARCHITECTURE_DECISIONS.md ADR-016 through ADR-029 (ADR-029 new this session)

Repository state conflicts with:

None open.

---

## Documentation Status

README

🟡 Still the generic default React Native CLI readme, not yet Nova-specific

Roadmap

✅ Updated — Phase 016 marked complete, Phase 017 marked next

Session

✅ Updated

ADR

✅ Updated — ADR-029 added

Architecture Docs

Unchanged this phase (`docs/architecture/overview.md` last updated Phase 015)

---

## Next Phase

Phase 017

Turbo Module Setup

Goal

Not yet planned in detail — per PROJECT_ROADMAP.md, follows Phase 016's native module infrastructure. Should benefit directly from this phase's now-proven `BridgePackage` registration pattern and the clean-rebuild-first debugging practice (ADR-029) if native behavior seems inexplicable again.

Dependencies

Phase 016 (Native Module Infrastructure) — complete; `BridgePackage`/`NativeBridgeInfo` establish the working pattern this phase builds on

Expected Duration

Unknown until planned

---

## Claude Code Instructions

When starting a new session:

1. Read START_HERE.md and DOCS_MANIFEST.json first (hash-check protocol). Only re-read a static document in full if its hash no longer matches.
2. Always read all four dynamic documents in full: SESSION.md (this file), PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md.
3. Verify repository health against the actual files and toolchain.
4. Continue from Phase 017.
5. Do not redesign previous phases.
6. If a native-module phase behaves inexplicably on-device after several rebuilds within the same session, try a fully clean rebuild (`node_modules`, `android/build`, `android/app/build`, `android/.gradle`, Metro `--reset-cache`) before spending further effort on architectural theories — see ADR-029.
7. Stop after Phase 017 (or its first sub-phase, if it needs splitting).
8. Update this document with verified information only. If any static document changed, update DOCS_MANIFEST.json and START_HERE.md too.

---

## Notes

Phase 016 took far longer than a typical phase because of an extensive on-device debugging investigation: the native registration was correct from the start, but on-device the module never resolved from JS. The investigation ruled out several plausible-sounding causes one at a time (stale APK, stale Metro bundle, sync-vs-async signature, the `useTurboModuleInterop` feature flag) with real device evidence for each, before a from-scratch throwaway RN 0.86 app proved the registration pattern itself was fine — which pointed at this project's own accumulated build state. A fully clean rebuild fixed it immediately. The actual specific stale artifact was never identified, only that clearing everything and rebuilding did. This is recorded as a new standing practice in ADR-029: try a clean rebuild early when native behavior seems architecturally impossible, and build a minimal throwaway reproduction when a bug's cause is ambiguous between the project and the platform.

## Resume Token

STAGE=1

PHASE=017

STATUS=READY

NEXT=Turbo Module Setup
