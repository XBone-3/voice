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

✅ Passing

Lint (`npx eslint .`)

✅ Passing

Format (`npx prettier --check .` / `npm run format:check`)

✅ Passing

TypeScript (`npx tsc --noEmit`)

✅ Passing

Unit Tests (`npx jest`)

✅ Passing (2 suites, 4 tests)

Physical Device

✅ Verified — built, installed, launched, and navigated on the connected device this session (see Testing)

Documentation

✅ Updated

---

## Development Progress

Current Stage

Stage 1 — Foundation

Current Phase

Phase 008

Theme System

Last Completed

Phase 007

Navigation — React Navigation wired across Home/Settings/Developer/Diagnostics, gated by `FEATURES`; a real Metro alias bug was found and fixed along the way (ADR-020)

Completion

7 / 100 Phases

---

## Current Objective

Phase 008 will introduce Material 3 design tokens and theming (ADR-009) — the four screens built in Phase 007 currently use raw inline `StyleSheet` values with no shared theme.

---

## Completed This Session

✔ Installed `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`; removed the now-unused `@react-native/new-app-screen` dependency

✔ Created `src/navigation/types.ts` (typed `RootStackParamList`, all 10 screens) and `src/navigation/RootNavigator.tsx`, which registers `Home`/`Settings` unconditionally and `Developer`/`Diagnostics` only when `FEATURES` (Phase 006, ADR-019) enables them

✔ Built real screen components for the four currently-reachable screens (`HomeScreen`, `SettingsScreen`, `DeveloperScreen`, `DiagnosticsScreen`) with barrel `index.ts` files; the other six screens remain README-only until their engine's `FEATURES` flag flips on, per ADR-019's own design — no dead/unreachable code was added

✔ Rewrote `App.tsx` to render `NavigationContainer` + `RootNavigator` instead of the CLI's default `NewAppScreen`

✔ Fixed a real Jest gap: `@react-navigation`/`react-native-screens` ship ESM and needed `transformIgnorePatterns` extended, or Jest failed on `export` syntax

✔ **Found and fixed a real bug via physical-device testing**, exactly the scenario ADR-018 flagged as unverified: Metro's built-in `resolver.extraNodeModules` cannot resolve `@alias/subpath` imports — it parses any `@word/segment` specifier as one atomic npm-style scoped package name with no subpath, confirmed by reading `metro-resolver`'s source directly. Replaced it with `babel-plugin-module-resolver` in `babel.config.js`; removed the now-dead `extraNodeModules` block from `metro.config.js` and `moduleNameMapper` from `jest.config.js`. Recorded as ADR-020, which supersedes the Metro-side half of ADR-018

✔ Along the way, hit and resolved two environment issues unrelated to the code itself: (1) a stale Gradle daemon lock caused by an earlier background build colliding with the user's own terminal attempt — resolved with `gradlew --stop`; (2) `TaskStop` on a background Metro process did not actually kill the underlying Windows `node.exe`, causing a stale server to keep serving a cached bundle after a "restart" — resolved by finding and force-killing the PID bound to port 8081 directly

✔ **Full on-device verification**: built (`gradlew assembleDebug`, BUILD SUCCESSFUL), installed via `adb install -r`, launched via `adb shell am start`, confirmed no crashes/errors via `adb logcat` (`AndroidRuntime:E`, `ReactNativeJS:V`), and visually confirmed via `adb shell screencap` screenshots that: Home renders with the Nova title and all four links, tapping "Settings" navigates with a native-stack transition, and the hardware back button returns to Home

✔ Full regression: `eslint`, `prettier --check`, `tsc --noEmit`, `jest`, `gradlew assembleDebug` — all pass after every change in this phase

---

## Pending

Phase 008 — Theme System

Phase 009 onward — per PROJECT_ROADMAP.md, none started

---

## Blockers

None.

---

## Known Issues

1. App identity is still CLI default: `package.json` name is `"Voice"`, Android `applicationId` is `com.voice`, no "Nova" branding, icons, or naming has been applied yet.

2. **Open architectural conflict, to resolve at Phase 016 (Native Module Infrastructure):** CLAUDE.md's own "Folder Structure" section and its separate "Kotlin Structure" section describe two different, inconsistent layouts for native engine code, and neither accounts for the real Gradle constraint that Kotlin sources must live under `android/app/src/main/java/com/voice/...` to compile. Still unresolved; flagged so Phase 016 doesn't miss it.

3. `FEATURES` in `src/env/index.ts` (ADR-019) must be updated by hand as each engine's phases complete — nothing currently enforces that a flag reflects reality.

4. The six not-yet-enabled screens (`assistant`, `notifications`, `automation`, `memory`, `history`, `plugins`) remain README-only with no component and no registered route. This is intentional (ADR-019/ADR-020), not an oversight — they get built out when their engine's `FEATURES` flag flips on.

---

## Technical Debt

- App branding/identity not yet applied (see Known Issues #1).
- Native Kotlin folder layout undecided (see Known Issues #2).
- Alias definitions still require keeping two files in sync by hand (`babel.config.js`, `tsconfig.json`) — down from three after ADR-020, but not eliminated.
- Screens have zero shared theming yet (raw `StyleSheet` values) — this is exactly Phase 008's job.

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

This session performed real, full device verification for the first time (previous phases were JS-tooling-only): build → install → launch → logcat check → screenshot → tap navigation → back-button navigation, all confirmed working.

---

## Testing

Last Tested

2026-07-15

Tests Performed

✔ `npx eslint .` — pass

✔ `npx prettier --check .` — pass

✔ `npx tsc --noEmit` — pass

✔ `npx jest` — pass (2 suites, 4 tests)

✔ `cd android && ./gradlew assembleDebug` — BUILD SUCCESSFUL

✔ `adb install -r app-debug.apk` — Success

✔ `adb shell am start -n com.voice/.MainActivity` — launched without crash

✔ `adb logcat -d AndroidRuntime:E` / `ReactNativeJS:V` — no fatal crashes, no JS console errors

✔ Screenshot-verified: Home screen renders correctly; tap navigation to Settings works with native transition; hardware back button returns to Home

ADB commands used this session

```
adb devices
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb reverse tcp:8081 tcp:8081
adb shell am force-stop com.voice
adb logcat -c
adb shell am start -n com.voice/.MainActivity
adb logcat -d AndroidRuntime:E *:S
adb logcat -d ReactNativeJS:V *:S
adb shell screencap -p /sdcard/<file>.png
adb pull /sdcard/<file>.png ./<file>.png   # MSYS_NO_PATHCONV=1 needed in Git Bash
adb shell input tap <x> <y>
adb shell input keyevent KEYCODE_BACK
```

Pending

No voice, wake word, or speech recognition code exists yet.

---

## Architecture Status

Repository state matches:

✔ PROJECT_MANIFEST.md platform policy

✔ CLAUDE.md (phases followed in order)

✔ ARCHITECTURE_DECISIONS.md ADR-016 through ADR-019, plus ADR-020 (new — supersedes the Metro-resolver half of ADR-018)

✔ ADR-012 (Navigation Architecture) — now directly implemented, not just aspirational

Repository state conflicts with:

None currently open at the React Native layer. See Known Issues #2 for the unresolved native-layer documentation conflict, scoped to Phase 016.

---

## Documentation Status

README

🟡 Still the generic default React Native CLI readme, not yet Nova-specific

Roadmap

✅ Updated — Phase 007 marked complete, Phase 008 marked next

Session

✅ Updated

ADR

✅ Updated — ADR-020 added, superseding the Metro-side portion of ADR-018

Architecture Docs

❌ `docs/architecture/` exists but is empty — still no architecture documentation written

---

## Next Phase

Phase 008

Theme System

Goal

Introduce Material 3 design tokens (color, typography, spacing) in `src/theme/`, per ADR-009, and apply them to the four screens built in Phase 007, which currently use raw inline styles.

Dependencies

Phase 005 (Folder Structure — `src/theme/` already exists), Phase 007 (Navigation — screens exist to theme) — both complete

Expected Duration

Medium

---

## Claude Code Instructions

When starting a new session:

1. Read START_HERE.md and DOCS_MANIFEST.json first (hash-check protocol — see START_HERE.md). Only re-read a static document in full if its hash no longer matches.
2. Always read all four dynamic documents in full: SESSION.md (this file), PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md.
3. Verify repository health against the actual files and toolchain — do not trust documentation without spot-checking, and where a phase's changes affect runtime behavior (not just JS tooling), verify on the physical device, not just via `tsc`/`jest`. Phase 007 is a direct lesson here: `tsc` and `jest` both passed while the app was actually broken on-device.
4. Continue from Phase 008.
5. Do not redesign previous phases.
6. Stop after Phase 008.
7. Update this document with verified information only. If any static document changed, update DOCS_MANIFEST.json and START_HERE.md too.

---

## Notes

Phase 007's most important lesson: alias/tooling changes that touch the actual bundler must be verified on a running app, not just via `tsc`/`jest`, which use entirely separate resolution mechanisms and can both pass while Metro is genuinely broken. This is now built into the Claude Code Instructions above. Two environment quirks were also worked around this session (stale Gradle daemon lock from concurrent builds; `TaskStop` not killing the underlying Windows Metro process) — neither is a code issue, both are noted above under Testing/Completed for anyone hitting the same thing later.

## Resume Token

STAGE=1

PHASE=008

STATUS=READY

NEXT=Theme System
