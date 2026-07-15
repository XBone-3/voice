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

✅ Passing (zero compiler warnings, first-try clean build)

Lint (`npx eslint .`)

✅ Passing

Format (`npx prettier --check .` / `npm run format:check`)

✅ Passing

TypeScript (`npx tsc --noEmit`)

✅ Passing

Unit Tests (`npx jest`)

✅ Passing (11 suites, 40 tests — 2 new this phase)

Physical Device

✅ Verified — real Home-button background/foreground round-trip confirmed both the command and event bridge patterns (see Testing)

Documentation

✅ Updated

---

## Development Progress

Current Stage

Stage 1 — Foundation

Current Phase

Phase 021

Broadcast Receivers

Last Completed

Phase 020

Lifecycle Manager — native process-lifecycle tracker (ADR-033), independent of the deferred Foreground Service (Phase 019)

Completion

20 / 100 Phases shipped (Phase 019 remains deferred — see ADR-032)

---

## Current Objective

Phase 021 (Broadcast Receivers) is next per PROJECT_ROADMAP.md — not yet planned in detail.

---

## Completed This Session

✔ **Resolved a real scope fork before writing code.** ADR-028 groups Phase 019 (Foreground Service, deferred) and Phase 020 (Lifecycle Manager) under the same `services/` package, raising a genuine question: does "Lifecycle Manager" mean an independent app/process lifecycle tracker, or lifecycle coordination *for* the (non-existent) Foreground Service — which would be just as blocked? Asked the user rather than assuming; confirmed it's the independent tracker.

✔ **Built `services/LifecycleManager.kt`** (plain Kotlin, no RN dependency, per ADR-028's package split) wrapping `ProcessLifecycleOwner` — confirmed already present transitively (Gradle cache) and declared explicitly in `app/build.gradle` for the compile classpath, since Jetpack Lifecycle is already named in the project's own tech stack. `isInForeground()` reads the **current** lifecycle state live (no manually-tracked variable, no startup race); `start()` registers a `DefaultLifecycleObserver` once, dispatched to the main thread since `Lifecycle.addObserver()` requires it and `NativeModule.initialize()` isn't guaranteed to run there.

✔ **Built a thin `bridge/LifecycleManagerModule.kt`** TurboModule, registered in the existing `BridgePackage` — the **first module to combine both proven bridge patterns from the start**: `isInForeground(): Promise<Boolean>` (command, Phase 016's pattern) and `onLifecycleChanged` (event, Phase 017's pattern), rather than adding one in a later phase the way `NativeBridgeInfo` did.

✔ **Zero compile errors this time** — applied the ADR-031 lesson (generated codegen classes keep the `Native` prefix, e.g. `NativeLifecycleManagerSpec`) correctly from the start; `gradlew assembleDebug` succeeded on the first attempt.

✔ **On-device verification exercised a real background/foreground round-trip**, not just a cold launch: installed, launched — confirmed both `isInForeground()` (command) and the initial `onLifecycleChanged` (event) fired correctly. Pressed the hardware Home button to genuinely background the app — confirmed the `'App backgrounded'` event fired, plus a bonus confirmation that Phase 017's `onMemoryPressure` event still works (`level 20` = the real `TRIM_MEMORY_UI_HIDDEN` signal Android sends on backgrounding). Relaunched — confirmed `'App foregrounded'` fired again. Navigated to `DiagnosticsScreen` and confirmed the full, correctly-ordered event timeline displayed with **zero code changes** to that screen, extending ADR-030's confirmation. No crashes.

✔ 2 new Jest tests (`isInForeground`/`subscribeToLifecycle` not-linked paths, mirroring `permissions.test.ts`'s pattern exactly). Full regression: `eslint`/`prettier`/`tsc`/`jest` (11 suites, 40 tests) all pass, `gradlew assembleDebug` clean, zero warnings.

✔ Recorded the scope resolution and design as ADR-033.

---

## Pending

Phase 021 — Broadcast Receivers — not yet planned

Phase 019 — Foreground Service — still deferred to whichever phase (likely 026/027) first has a real capability justifying a genuine `foregroundServiceType` (ADR-032)

Phase 022 onward — per PROJECT_ROADMAP.md, none started

---

## Blockers

None for Phase 021. Phase 019 (Foreground Service) remains intentionally blocked — see ADR-032.

---

## Known Issues

1. App identity is still CLI default: `package.json` name is `"Voice"`, Android `applicationId` is `com.voice`, no "Nova" branding, icons, or naming has been applied yet.

2. `FEATURES` in `src/env/index.ts` (ADR-019) must be updated by hand as each engine's phases complete — nothing currently enforces that a flag reflects reality.

3. The six not-yet-enabled screens remain README-only with no component and no registered route — intentional (ADR-019/ADR-020), not an oversight.

4. The theme preference does not persist across app restarts (ADR-024) — deliberate, temporary, until Phase 023/024.

5. Logger has no content-based redaction yet (ADR-026) — a documented convention, not enforced in code.

6. `Button` and `MenuLink` (`src/components/`) duplicate similar Pressable+ripple styling — a deliberate, small, accepted tradeoff (ADR-027).

7. Accessibility (TalkBack, dynamic font scaling, contrast) has never been explicitly audited across the real screens/components built so far (flagged in Phase 015). Not urgent (Phase 094 exists later in the roadmap), but still open.

8. The exact stale build artifact that caused Phase 016's on-device failure was never isolated — only that a full clean rebuild fixed it (ADR-029). If native modules misbehave again after several same-session rebuilds, try a clean rebuild before deep architectural investigation.

9. `onMemoryPressure` currently only reaches the logger — no engine reacts to it yet (none exist that need to), per ADR-030.

10. `PermissionManager.requestPermission()` only supports one in-flight request at a time; no rationale/re-ask UX yet (ADR-031) — deferred to whichever phase first has a real user-facing permission moment.

11. Phase 019 (Foreground Service) is deferred, not built — see ADR-032. Nova currently has no persistent background-operation mechanism at all; "the assistant continues operating while backgrounded" (ADR-006) is not yet true in practice. Expected at this stage, but tracked explicitly.

12. **New this session:** `services/LifecycleManager.kt`'s `start()` only supports a single registered callback — fine today (exactly one consumer, `LifecycleManagerModule`), but a future native engine wanting its own direct subscription (bypassing the bridge) will need this extended to a listener list (ADR-033).

---

## Technical Debt

- App branding/identity not yet applied (see Known Issues #1).
- Alias definitions still require keeping two files in sync by hand (`babel.config.js`, `tsconfig.json`) — 11 aliases, unchanged this phase (`@nativeSpecs`/`@services` already covered the new files, no new top-level `src/` folder was needed).
- Settings persistence is a known, explicit gap until Phase 023/024 (see Known Issues #4).
- Accessibility unaudited (see Known Issues #7).
- `PermissionManager` supports only one concurrent request and no rationale UX yet (see Known Issues #10).
- No Foreground Service exists yet — ADR-006's "continues operating while backgrounded" is aspirational until Phase 026/027 or whichever phase builds it (see Known Issues #11).
- `LifecycleManager.start()` supports only one listener (see Known Issues #12).

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

✔ `npx jest` — pass (11 suites, 40 tests; 2 new in `lifecycle.test.ts`)

✔ `cd android && ./gradlew assembleDebug` — BUILD SUCCESSFUL, zero compiler warnings, first attempt (no compile errors this time)

✔ Installed and launched on the physical device; confirmed `isInForeground()` command and `onLifecycleChanged` event both fire correctly on launch; pressed the hardware Home button to genuinely background the app and confirmed the backgrounded event (plus a bonus reconfirmation of Phase 017's memory-pressure event); relaunched and confirmed the foregrounded event fired again; confirmed `DiagnosticsScreen` displays the full event timeline correctly with zero code changes; no crashes throughout

Pending

No voice, wake word, or speech recognition code exists yet. Accessibility audit (Known Issues #7) not yet performed. Foreground Service deferred (Known Issues #11).

---

## Architecture Status

Repository state matches:

✔ PROJECT_MANIFEST.md platform policy

✔ CLAUDE.md

✔ ARCHITECTURE_DECISIONS.md ADR-016 through ADR-033 (ADR-033 new this session)

Repository state conflicts with:

None open. ADR-006's "Foreground Service Architecture" remains an explicitly tracked, intentional gap (ADR-032), not a silent conflict.

---

## Documentation Status

README

🟡 Still the generic default React Native CLI readme, not yet Nova-specific

Roadmap

✅ Updated — Phase 020 marked complete, Phase 021 marked next

Session

✅ Updated

ADR

✅ Updated — ADR-033 added

Architecture Docs

Unchanged this phase (`docs/architecture/overview.md` last updated Phase 015) — should be revisited once a few more native-infra phases (021–022) land

---

## Next Phase

Phase 021

Broadcast Receivers

Goal

Not yet planned in detail. Per ADR-028's package layout, this populates `android/.../receivers/` with `BroadcastReceiver` infrastructure.

Dependencies

Phase 020 (Lifecycle Manager) — complete; any future receiver-driven engine can now also observe app foreground/background state via `LifecycleManager`

Expected Duration

Unknown until planned

---

## Claude Code Instructions

When starting a new session:

1. Read START_HERE.md and DOCS_MANIFEST.json first (hash-check protocol). Only re-read a static document in full if its hash no longer matches.
2. Always read all four dynamic documents in full: SESSION.md (this file), PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md.
3. Verify repository health against the actual files and toolchain.
4. Continue from Phase 021 (Broadcast Receivers). Phase 019 (Foreground Service) remains intentionally deferred — see ADR-032 before reconsidering it.
5. Do not redesign previous phases.
6. If a native-module phase behaves inexplicably on-device after several rebuilds within the same session, try a fully clean rebuild before spending further effort on architectural theories — see ADR-029.
7. If a roadmap phase name is ambiguous relative to what a prior phase already delivered, or relative to another phase's deferral, ask the user rather than guessing — see ADR-030 and ADR-033's Context sections for two different examples of this.
8. Before writing native code that assumes a framework or OS behavior, verify against current official docs first — see ADR-031/032.
9. When locating on-screen tap targets for `adb shell input tap`, prefer `adb shell uiautomator dump` for exact bounds over estimating from a scaled screenshot.
10. When every available option for a phase carries a genuine, consequential downside, ask the user rather than picking one — see ADR-032.
11. When generating a codegen-backed native module, remember the generated Java/Kotlin spec class keeps the `Native` prefix from the `.ts` spec file's own name (e.g. `NativeFooSpec`, not `FooSpec`) — got this right on the first try this phase, after Phase 018 caught it the hard way.
12. Stop after Phase 021 (or its first sub-phase, if it needs splitting).
13. Update this document with verified information only. If any static document changed, update DOCS_MANIFEST.json and START_HERE.md too.

---

## Notes

Phase 020 had a real scope fork worth resolving carefully: ADR-028 groups it with the just-deferred Phase 019 under the same `services/` package, so "Lifecycle Manager" could plausibly have meant something just as blocked as the Foreground Service. Asking first (rather than assuming last session's tentative note was correct) avoided either wasted work or a wrongly-deferred phase. Once resolved, this phase went smoothly — the first module built from scratch combining both proven bridge patterns (command + event) at once, zero compile errors (the Phase 018 codegen-naming lesson held), and on-device verification that exercised a genuine background/foreground cycle via the hardware Home button rather than just a cold launch.

## Resume Token

STAGE=1

PHASE=021

STATUS=READY

NEXT=Broadcast Receivers
