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

✅ Passing (zero compiler warnings)

Lint (`npx eslint .`)

✅ Passing

Format (`npx prettier --check .` / `npm run format:check`)

✅ Passing

TypeScript (`npx tsc --noEmit`)

✅ Passing

Unit Tests (`npx jest`)

✅ Passing (10 suites, 38 tests — 3 new tests this phase)

Physical Device

✅ Verified — full check→request→OS-dialog→grant flow confirmed interactively (see Testing)

Documentation

✅ Updated

---

## Development Progress

Current Stage

Stage 1 — Foundation

Current Phase

Phase 019

Foreground Service

Last Completed

Phase 018

Permission Manager — generic Android runtime permission check/request mechanism (ADR-031), verified against RECORD_AUDIO without auto-requesting it from real users

Completion

18 / 100 Phases

---

## Current Objective

Phase 019 (Foreground Service) is next per PROJECT_ROADMAP.md — not yet planned in detail.

---

## Completed This Session

✔ **Built a generic Permission Manager**, unambiguously scoped this time (unlike Phase 017): PROJECT_ROADMAP.md names it directly and ADR-028 already reserved a `permissions/` package for it, so no user clarification was needed before planning.

✔ **Correctly separated Android logic from bridge surface**, per ADR-028's package split and ADR-008's thin-bridge principle: `android/.../permissions/PermissionManager.kt` is plain Kotlin (`isGranted`, `request` via `PermissionAwareActivity`/`PermissionListener`) with no React Native dependency — reusable directly by any future native engine's own code, not just through the bridge. `android/.../bridge/PermissionManagerModule.kt` is a new, thin TurboModule that only translates JS calls into calls on that real logic, registered into the existing shared `BridgePackage` (no new `ReactPackage`).

✔ **Verified the framework against source before coding**, carrying over ADR-029's lesson: confirmed by reading `ReactActivity.java` that `MainActivity`'s base class already implements `PermissionAwareActivity` and already forwards `onRequestPermissionsResult` — no `MainActivity.kt` changes were needed, avoiding a guess that could have cost another debugging session like Phase 016's.

✔ **Chose RECORD_AUDIO to verify the mechanism** — the first permission any future engine will genuinely need (Phase 026 Audio Engine / Phase 027 Microphone Manager) — rather than an arbitrary placeholder, while still honoring NON_FUNCTIONAL_REQUIREMENTS.md's "never request permissions before needed": the manifest declares it (shows no prompt by itself), `App.tsx`'s mount effect only *checks* status silently, and the actual *request* (the one call that shows a real system dialog) is a manual, dev-only button on `DeveloperScreen` — real, permanent developer tooling, not a throwaway demo, gated behind the same `IS_DEV` flag that already hides the whole screen from release builds.

✔ Caught and fixed one real compile error during the native build: guessed the generated codegen class would be named `PermissionManagerSpec`, but codegen keeps the `Native` prefix from the spec file's own name (`NativePermissionManagerSpec`) — exactly as it did for `NativeBridgeInfoSpec` in Phase 016, a pattern that should have been checked first rather than assumed.

✔ **Full interactive on-device verification**, the most thorough yet: confirmed the silent `checkPermission()` mount check logs correctly (`'Microphone permission — denied'`), navigated to Developer, confirmed the Permissions card shows "Denied," tapped "Request Microphone" (after locating its exact tap coordinates via `adb shell uiautomator dump`, since two earlier taps at screenshot-scaled guesses missed the real button), watched the **actual Android system permission dialog** appear ("Allow Voice to record audio?"), granted it via "While using the app," and confirmed the card updated live to "Granted" with no further interaction. No crashes at any point.

✔ 3 new Jest tests (`checkPermission`/`requestPermission` not-linked paths; `DeveloperScreen`'s Permissions card resolving to "Denied"). `developerScreen.test.tsx`'s render helper was made `async`/`await act(async () => ...)` (the same pattern `App.test.tsx` already used) since the new card's permission check resolves on a microtask. Full regression: `eslint`/`prettier`/`tsc`/`jest` (10 suites, 38 tests) all pass, `gradlew assembleDebug` clean with zero warnings.

✔ Recorded the design (why RECORD_AUDIO, the permissions/-vs-bridge/ split, the manual-dev-trigger approach) as ADR-031.

---

## Pending

Phase 019 — Foreground Service — not yet planned

Phase 020 onward — per PROJECT_ROADMAP.md, none started

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

8. The exact stale build artifact that caused Phase 016's on-device failure was never isolated — only that a full clean rebuild fixed it (ADR-029). If native modules misbehave again after several same-session rebuilds, try a clean rebuild before deep architectural investigation.

9. `onMemoryPressure` currently only reaches the logger — no engine reacts to it yet (none exist that need to), per ADR-030.

10. **New this session:** `PermissionManager.requestPermission()` only supports one in-flight request at a time (a single fixed request code) — fine for this phase's manual test button, but a future phase requesting multiple permissions concurrently will need per-call request codes or a queue (ADR-031). Also, no "show rationale before re-asking" UX exists yet — deferred to whichever phase (likely 026/027) first has a real user-facing permission moment to design it for.

---

## Technical Debt

- App branding/identity not yet applied (see Known Issues #1).
- Alias definitions still require keeping two files in sync by hand (`babel.config.js`, `tsconfig.json`) — 11 aliases.
- Settings persistence is a known, explicit gap until Phase 023/024 (see Known Issues #4).
- Accessibility unaudited (see Known Issues #7).
- `PermissionManager` supports only one concurrent request and no rationale UX yet (see Known Issues #10).

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

✔ `npx jest` — pass (10 suites, 38 tests; 3 new: `permissions.test.ts` not-linked paths ×2, `developerScreen.test.tsx`'s Permissions card)

✔ `cd android && ./gradlew assembleDebug` — BUILD SUCCESSFUL, zero compiler warnings (after fixing one real compile error — wrong generated spec class name, corrected to `NativePermissionManagerSpec`)

✔ Installed and launched on the physical device; confirmed silent `checkPermission()` logs correctly on mount; navigated to Developer; confirmed "Denied" status; tapped "Request Microphone"; confirmed the real Android permission dialog appeared; granted it; confirmed the UI updated live to "Granted"; no crashes throughout

Pending

No voice, wake word, or speech recognition code exists yet. Accessibility audit (Known Issues #7) not yet performed.

---

## Architecture Status

Repository state matches:

✔ PROJECT_MANIFEST.md platform policy

✔ CLAUDE.md

✔ ARCHITECTURE_DECISIONS.md ADR-016 through ADR-031 (ADR-031 new this session)

Repository state conflicts with:

None open.

---

## Documentation Status

README

🟡 Still the generic default React Native CLI readme, not yet Nova-specific

Roadmap

✅ Updated — Phase 018 marked complete, Phase 019 marked next

Session

✅ Updated

ADR

✅ Updated — ADR-031 added

Architecture Docs

Unchanged this phase (`docs/architecture/overview.md` last updated Phase 015) — should be revisited once a few more native-infra phases (019–022) land, rather than updated piecemeal after each one

---

## Next Phase

Phase 019

Foreground Service

Goal

Not yet planned in detail. Per ADR-028's package layout, this is where `android/.../services/` (Foreground Service and other Android Services) gets populated.

Dependencies

Phase 018 (Permission Manager) — complete; any service requiring a runtime permission can now use the proven check/request mechanism

Expected Duration

Unknown until planned

---

## Claude Code Instructions

When starting a new session:

1. Read START_HERE.md and DOCS_MANIFEST.json first (hash-check protocol). Only re-read a static document in full if its hash no longer matches.
2. Always read all four dynamic documents in full: SESSION.md (this file), PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md.
3. Verify repository health against the actual files and toolchain.
4. Continue from Phase 019.
5. Do not redesign previous phases.
6. If a native-module phase behaves inexplicably on-device after several rebuilds within the same session, try a fully clean rebuild (`node_modules`, `android/build`, `android/app/build`, `android/.gradle`, Metro `--reset-cache`) before spending further effort on architectural theories — see ADR-029.
7. If a roadmap phase name is ambiguous relative to what a prior phase already delivered, ask the user rather than guessing — see ADR-030's Context section. (Phase 018 did NOT need this — its scope was already unambiguous from PROJECT_ROADMAP.md/ADR-028.)
8. Before writing native code that assumes a framework behavior (e.g. "does the base Activity class already implement X interface?"), verify by reading the actual React Native source first, not by guessing — see ADR-031.
9. When locating on-screen tap targets for `adb shell input tap`, prefer `adb shell uiautomator dump` for exact bounds over estimating from a scaled screenshot — two guessed taps missed the real button this phase before the dump gave exact coordinates.
10. Stop after Phase 019 (or its first sub-phase, if it needs splitting).
11. Update this document with verified information only. If any static document changed, update DOCS_MANIFEST.json and START_HERE.md too.

---

## Notes

Phase 018 was refreshingly unambiguous compared to Phase 017 — PROJECT_ROADMAP.md named it directly and ADR-028 had already reserved its package, so implementation could start immediately without a clarifying question. The main design tension was honoring NON_FUNCTIONAL_REQUIREMENTS.md's "never request permissions before needed" while still needing a real, non-fake permission to prove the mechanism against — resolved by using RECORD_AUDIO (genuinely, imminently needed by Phase 026/027) but gating the only prompt-showing call behind a manual, dev-only control rather than any automatic path. On-device verification took a few extra iterations purely due to tap-coordinate estimation from scaled screenshots being unreliable for small UI elements — `adb shell uiautomator dump` solved this cleanly and is now recorded as the preferred approach for future phases needing precise on-device taps.

## Resume Token

STAGE=1

PHASE=019

STATUS=READY

NEXT=Foreground Service
