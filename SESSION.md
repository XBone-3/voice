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

✅ Passing (unchanged this session — no code was written)

Lint (`npx eslint .`)

✅ Passing (unchanged)

Format (`npx prettier --check .` / `npm run format:check`)

✅ Passing (unchanged)

TypeScript (`npx tsc --noEmit`)

✅ Passing (unchanged)

Unit Tests (`npx jest`)

✅ Passing (10 suites, 38 tests — unchanged, no test code touched)

Physical Device

✅ Last verified in Phase 018 — no code changed this session, so no new device verification was needed

Documentation

✅ Updated

---

## Development Progress

Current Stage

Stage 1 — Foundation

Current Phase

Phase 020

Lifecycle Manager (not yet planned)

Last Completed (shipped code)

Phase 018

Permission Manager

Phase 019 Outcome

**Deferred, not completed.** Foreground Service — researched and found that Android 14+ (Nova's target/compile SDK is 36) leaves no honest `foregroundServiceType` to declare with zero real engine capability behind it yet. See ADR-032 and Completed This Session below.

Completion

18 / 100 Phases shipped (Phase 019 deferred — see ADR-032)

---

## Current Objective

Phase 020 (Lifecycle Manager) is next — not yet planned in detail. Likely scoped as a native Activity/process lifecycle tracker (foreground/background/destroy transitions exposed as events via the Phase 017 event-emission pattern), independent of the deferred Foreground Service — to be confirmed when actually planned, not assumed here.

---

## Completed This Session

✔ **Began planning Phase 019 (Foreground Service)** per PROJECT_ROADMAP.md/ADR-006/ADR-028, carrying forward the "verify framework behavior against source/docs before implementing" discipline established in ADR-029/ADR-031.

✔ **Researched Android 14+/15+ foreground service type requirements before writing any code** and found a genuine, consequential blocker: every foreground service must declare a `foregroundServiceType` matching real, current behavior, enforced by the OS itself (not just Play Store policy).
  - `specialUse` (the closest thing to a generic catch-all) is **restricted to system apps, VPN apps, and apps holding `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM`** as of Android 14 — declaring it otherwise throws `ForegroundServiceTypeNotAllowedException` at runtime, a real crash, not a store-review issue.
  - `dataSync` (the historically common generic-background-work type) is capped at **6 hours per rolling 24-hour period on Android 15+**, after which the OS calls `onTimeout()` and stops it until the user reopens the app — directly contradicting Nova's own vision (VISION.md/PROJECT_CONTEXT.md: "always-awake, continuously listening"; ADR-006: "continues operating while backgrounded").
  - The type Nova will actually want (`microphone`, once always-listening voice capture is real) can't be honestly declared yet — Phase 026/027 (Audio Engine/Microphone Manager) don't exist.

✔ **Asked the user how to proceed** rather than silently picking an option — unlike Phase 018's scoping question (where every candidate answer was safe), every option here carried a genuine, consequential downside (crash risk, contradicting the core vision, or building something that would need reworking, not just extending, once a real engine existed). The user chose to defer Phase 019 entirely rather than ship a placeholder.

✔ **No Foreground Service code was written.** Phase 019 is marked **Deferred** (not Complete) in PROJECT_ROADMAP.md/PROJECT_STATE.json, with the research preserved so whichever future phase (most likely Phase 026 Audio Engine or Phase 027 Microphone Manager) actually builds it doesn't have to re-derive this. Recorded as ADR-032.

✔ Confirmed Phase 020 (Lifecycle Manager) is **not** automatically blocked by Phase 019's deferral — a native Activity/process lifecycle tracker doesn't need a foreground service, a special permission, or any OS-level type declaration, so it can follow the same "build infrastructure ahead of the engine" pattern Phase 016–018 used. This is not yet confirmed as the actual scope, only that it isn't blocked — full planning is Phase 020's own job, next session.

---

## Pending

Phase 020 — Lifecycle Manager — not yet planned

Phase 019 — Foreground Service — deferred to whichever phase (likely 026/027) first has a real capability justifying a genuine `foregroundServiceType`

Phase 021 onward — per PROJECT_ROADMAP.md, none started

---

## Blockers

None for Phase 020. Phase 019 (Foreground Service) is blocked until a real engine capability exists to justify an honest `foregroundServiceType` — see ADR-032. This is an intentional, documented block, not an accidental one.

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

11. **New this session:** Phase 019 (Foreground Service) is deferred, not built — see ADR-032. Nova currently has no persistent background-operation mechanism at all, meaning "the assistant continues operating while backgrounded" (ADR-006) is not yet true in practice. This is expected at this stage (no engine has anything to do in the background yet) but is worth tracking explicitly rather than letting it go unnoticed as more phases complete.

---

## Technical Debt

- App branding/identity not yet applied (see Known Issues #1).
- Alias definitions still require keeping two files in sync by hand (`babel.config.js`, `tsconfig.json`) — 11 aliases.
- Settings persistence is a known, explicit gap until Phase 023/024 (see Known Issues #4).
- Accessibility unaudited (see Known Issues #7).
- `PermissionManager` supports only one concurrent request and no rationale UX yet (see Known Issues #10).
- No Foreground Service exists yet — ADR-006's "continues operating while backgrounded" is aspirational until Phase 026/027 or whichever phase builds it (see Known Issues #11).

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

2026-07-15 (Phase 018 — unchanged this session, no code was written)

Tests Performed This Session

None — this session was research and a scoping decision, not implementation. Full regression from Phase 018 remains the last verified state: `eslint`/`prettier`/`tsc`/`jest` (10 suites, 38 tests) all passing, `gradlew assembleDebug` clean, on-device verification of the Permission Manager's full check→request→OS-dialog→grant flow.

Pending

No voice, wake word, or speech recognition code exists yet. Accessibility audit (Known Issues #7) not yet performed. Foreground Service deferred (Known Issues #11).

---

## Architecture Status

Repository state matches:

✔ PROJECT_MANIFEST.md platform policy

✔ CLAUDE.md

✔ ARCHITECTURE_DECISIONS.md ADR-016 through ADR-032 (ADR-032 new this session)

Repository state conflicts with:

None open. ADR-006's "Foreground Service Architecture" is not yet realized in code — this is an explicitly tracked, intentional gap (ADR-032), not a silent conflict.

---

## Documentation Status

README

🟡 Still the generic default React Native CLI readme, not yet Nova-specific

Roadmap

✅ Updated — Phase 019 marked Deferred (not Complete) with the research findings, Phase 020 marked next

Session

✅ Updated

ADR

✅ Updated — ADR-032 added

Architecture Docs

Unchanged this phase (`docs/architecture/overview.md` last updated Phase 015)

---

## Next Phase

Phase 020

Lifecycle Manager

Goal

Not yet planned in detail. Working hypothesis (to be confirmed, not assumed, when this phase is actually planned): a native Activity/process lifecycle tracker — foreground/background/destroy transitions exposed to JS as events, reusing the `NativeEventEmitter` pattern ADR-030 already proved — giving future engines a way to know when the app's lifecycle changes without each building its own `ActivityLifecycleCallbacks`/`LifecycleEventListener` plumbing.

Dependencies

None blocking — independent of Phase 019's deferred Foreground Service

Expected Duration

Unknown until planned

---

## Claude Code Instructions

When starting a new session:

1. Read START_HERE.md and DOCS_MANIFEST.json first (hash-check protocol). Only re-read a static document in full if its hash no longer matches.
2. Always read all four dynamic documents in full: SESSION.md (this file), PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md.
3. Verify repository health against the actual files and toolchain.
4. Continue from Phase 020 (Lifecycle Manager) — Phase 019 (Foreground Service) is intentionally deferred; do not attempt to build it until a real engine phase (most likely 026/027) justifies a genuine `foregroundServiceType`. See ADR-032 before reconsidering this.
5. Do not redesign previous phases.
6. If a native-module phase behaves inexplicably on-device after several rebuilds within the same session, try a fully clean rebuild before spending further effort on architectural theories — see ADR-029.
7. If a roadmap phase name is ambiguous relative to what a prior phase already delivered, ask the user rather than guessing — see ADR-030's Context section.
8. Before writing native code that assumes a framework or OS behavior (e.g. "is this Android permission/service type actually usable the way I assume?"), verify against current official docs first — see ADR-031 and, especially, ADR-032, where this exact check prevented shipping something that would have crashed or silently contradicted Nova's own vision.
9. When locating on-screen tap targets for `adb shell input tap`, prefer `adb shell uiautomator dump` for exact bounds over estimating from a scaled screenshot.
10. When every available option for a phase carries a genuine, consequential downside (not just an ambiguous name), ask the user rather than picking one — see ADR-032's Context section for how this differed from Phase 018's more benign scoping question.
11. Stop after Phase 020 (or its first sub-phase, if it needs splitting).
12. Update this document with verified information only. If any static document changed, update DOCS_MANIFEST.json and START_HERE.md too.

---

## Notes

This session shipped no code — its real output was catching, before writing a single line, that Phase 019 as named ("Foreground Service") cannot currently be built honestly on Android 14+/15+ without either crashing (`specialUse` misuse) or silently violating Nova's own always-on vision (`dataSync`'s 6-hour cap). This is a different situation from every prior phase in this project: it's not a naming ambiguity (like Phase 017) or a scope-uncertainty (like Phase 018's permission choice) — every viable path forward had a real, consequential cost, which is exactly the kind of decision CLAUDE.md says to bring to the user rather than resolve unilaterally. The user chose to defer rather than accept a placeholder. PROJECT_ROADMAP.md and PROJECT_STATE.json now reflect this honestly — Phase 019 is marked Deferred, not Complete, and the project's phase counter moves to Phase 020, which does not depend on it.

## Resume Token

STAGE=1

PHASE=020

STATUS=READY

NEXT=Lifecycle Manager
