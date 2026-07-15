# ARCHITECTURE_DECISIONS.md

# Architecture Decision Records (ADR)

## Purpose

This document records every major architectural decision made throughout the project.

Features explain **what** was built.

Code explains **how** it was built.

Architecture Decision Records explain **why** it was built that way.

Future contributors—including Claude Code—must read this document before proposing architectural changes.

No architectural decision should be reversed without creating a new ADR explaining the reason.

---

# ADR Format

Every decision must follow this structure.

---

## ADR-XXX

Title

Date

Status

Context

Problem

Options Considered

Decision

Consequences

Future Considerations

---

Status values

Accepted

Proposed

Deprecated

Superseded

Rejected

---

# ADR-001

## Android Only

Status

Accepted

Date

YYYY-MM-DD

### Context

The assistant is intended to integrate deeply with the Android operating system.

Supporting iOS would introduce architectural compromises because iOS restricts background execution, notification access, accessibility automation, and system control.

### Decision

Support Android exclusively.

Do not build cross-platform abstractions for Apple platforms.

### Consequences

Advantages

Full Android API access

Better performance

Simpler architecture

Lower maintenance cost

Offline capability

Background services

Accessibility integration

Disadvantages

No iOS support

### Future

Android remains the primary platform unless this decision is formally superseded.

---

# ADR-002

## Kotlin Owns Native Logic

Status

Accepted

### Context

React Native is excellent for UI.

Android system functionality is significantly more reliable in Kotlin.

### Decision

Business logic interacting with Android belongs in Kotlin.

React Native owns:

UI

Navigation

Animations

Presentation

Kotlin owns:

Voice

Permissions

Services

Notifications

Accessibility

Automation

Media

Storage

Sensors

The React Native bridge must remain thin.

### Consequences

Cleaner architecture

Higher reliability

Better debugging

Improved performance

---

# ADR-003

## Voice First Interface

Status

Accepted

### Context

The project vision is an assistant that reduces screen interaction.

### Decision

Voice becomes the primary interaction model.

Typing becomes secondary.

Touch becomes tertiary.

Every feature should eventually become accessible through voice.

### Consequences

Simpler user experience

Higher accessibility

Reduced UI complexity

---

# ADR-004

## Offline First

Status

Accepted

### Context

Internet connectivity should never determine whether the assistant functions.

### Decision

Core capabilities must remain operational offline.

Examples

Notifications

Calls

Contacts

SMS

Automation

Media

Calendar

Memory

History

### Consequences

Improved privacy

Better responsiveness

More reliable experience

Reduced external dependencies

---

# ADR-005

## AI Is Optional

Status

Accepted

### Context

Many assistants unnecessarily invoke AI for deterministic tasks.

### Decision

AI is only used when deterministic logic cannot satisfy the request.

Decision hierarchy

Android APIs

↓

Rule Engine

↓

Context Engine

↓

Local AI

↓

Clarification

Never invoke AI for simple deterministic actions.

### Consequences

Faster execution

Lower battery consumption

Predictable behavior

Offline support

---

# ADR-006

## Foreground Service Architecture

Status

Accepted

### Context

The assistant should remain available without requiring the UI to stay open.

### Decision

Core assistant functionality operates inside a Foreground Service.

React Native UI is optional.

The assistant continues operating while the application is backgrounded.

### Consequences

Continuous availability

Improved responsiveness

Requires careful battery optimization

---

# ADR-007

## Modular Engine Architecture

Status

Accepted

### Context

Large monolithic assistants become difficult to maintain.

### Decision

Split the assistant into independent engines.

Voice Engine

Wake Word Engine

Speech Engine

Command Engine

Context Engine

Notification Engine

Accessibility Engine

Automation Engine

Memory Engine

Plugin Engine

Bridge Engine

Each engine communicates through interfaces.

### Consequences

Independent testing

Replaceable implementations

Future extensibility

Simpler maintenance

---

# ADR-008

## Thin Bridge

Status

Accepted

### Context

Large React Native bridges become difficult to maintain.

### Decision

The bridge only transfers:

Commands

Events

State

No business logic.

No Android logic.

### Consequences

Better separation

Improved maintainability

Cleaner debugging

---

# ADR-009

## Modern Material Design

Status

Accepted

### Context

The assistant should feel native.

### Decision

Use Material 3 principles.

Generous spacing.

Meaningful motion.

Dark mode.

Adaptive layouts.

Minimal UI.

Avoid visual clutter.

### Consequences

Premium experience

Better accessibility

Future Android compatibility

---

# ADR-010

## Physical Device Development

Status

Accepted

### Context

Many Android APIs behave differently on emulators.

### Decision

Development targets a real Android device connected through USB.

The emulator is optional.

Physical device verification is mandatory.

### Consequences

More reliable testing

Fewer production surprises

---

# ADR-011

## Local Data Ownership

Status

Accepted

### Context

User trust is fundamental.

### Decision

Assistant memory belongs to the user.

Store locally.

Encrypt sensitive information.

Never upload automatically.

### Consequences

Higher privacy

Offline support

Reduced compliance complexity

---

# ADR-012

## Navigation Architecture

Status

Accepted

### Context

Single-screen applications become unmaintainable.

### Decision

Every major subsystem receives its own screen.

Examples

Assistant

Notifications

Automation

Memory

History

Plugins

Settings

Developer

Diagnostics

Never build a giant scrolling dashboard.

### Consequences

Improved scalability

Cleaner code

Better UX

---

# ADR-013

## Dependency Policy

Status

Accepted

### Context

Dependency bloat increases maintenance cost.

### Decision

Before adding any dependency ask:

Can Android already do this?

Can Kotlin already do this?

Can Jetpack already do this?

Can we reasonably build it?

If yes,

Do not add another dependency.

Every dependency requires documented justification.

### Consequences

Smaller APK

Lower maintenance

Better stability

---

# ADR-014

## Performance Over Features

Status

Accepted

### Context

Slow assistants feel unintelligent.

### Decision

Performance regressions block feature work.

If latency exceeds targets,

Optimization becomes higher priority than new functionality.

### Consequences

Consistently responsive assistant

Higher perceived intelligence

Better battery usage

---

# ADR-015

## Documentation Is Code

Status

Accepted

### Context

Long-lived projects lose context over time.

### Decision

Every architectural change updates:

README

SESSION.md

ROADMAP

Architecture Decisions

Relevant documentation

No phase is complete until documentation is updated.

### Consequences

Knowledge retention

Faster onboarding

Reduced redesign

---

# ADR-016

## TypeScript Configuration Baseline

Status

Accepted

Date

2026-07-15

### Context

Phase 003 required a deliberate decision on the TypeScript configuration Nova is built on, rather than silently relying on whatever the React Native CLI happened to generate.

`tsconfig.json` extends `@react-native/typescript-config` (version 0.86.0). That preset's own `tsconfig.json` was inspected directly and already sets:

- `strict: true`
- `isolatedModules: true`
- `noEmit: true`
- `moduleResolution: "bundler"`
- `esModuleInterop: true`
- `jsx: "react-native"`
- Modern `es2022`-range `lib` targets

This satisfies the Clean Code and Scalability sections of ENGINEERING_PRINCIPLES.md and the Maintainability requirements of NON_FUNCTIONAL_REQUIREMENTS.md without modification.

### Decision

Accept `@react-native/typescript-config` as-is. No local `compilerOptions` overrides are introduced in this phase.

Path aliases (e.g. `@voice-engine/*`, `@command-engine/*`, `@shared/*`) are explicitly deferred to Phase 005 (Folder Structure). Introducing aliases now, before any of those directories exist, would be speculative configuration with nothing to alias. When Phase 005 creates the real module directories, that phase must also decide the accompanying Metro/Babel module-resolution mechanism — Metro does not read `tsconfig.json` `paths` for runtime module resolution, so a resolver such as `babel-plugin-module-resolver` (or an equivalent Metro-level solution) will need to be evaluated then.

### Consequences

Advantages

No premature or speculative configuration

Production-grade strictness already in place with zero added maintenance surface

Clear, documented handoff point for Phase 005

Disadvantages

Deep relative imports (`../../../`) remain necessary until Phase 005 introduces aliases

### Future

Revisit this ADR when Phase 005 (Folder Structure) is planned. If path aliases are introduced then, that phase should reference this ADR and record the chosen module-resolution mechanism.

---

# ADR-017

## ESLint + Prettier Configuration Scope

Status

Accepted

Date

2026-07-15

### Context

Phase 004 required a deliberate decision on ESLint and Prettier, the same way Phase 003b (ADR-016) reviewed TypeScript.

`.eslintrc.js` extends `@react-native/eslint-config`, which was inspected directly in `node_modules`. It already bundles React, React Hooks, React Native, TypeScript, and Jest plugin rules with per-filetype overrides, and extends `eslint-config-prettier` to disable any stylistic rule that would conflict with Prettier. `npx eslint .` passed cleanly before this phase.

`.prettierrc.js` already carried a deliberate baseline (`arrowParens: 'avoid'`, `singleQuote: true`, `trailingComma: 'all'`). However, no `.prettierignore` (or `.eslintignore`) existed, and no npm script could run Prettier at all. Running `npx prettier --check .` surfaced 190 false-positive files — generated Android build JSON under `android/build/`, and every project Markdown document — none of which should ever be reformatted by Prettier.

### Decision

1. Accept `@react-native/eslint-config` unmodified — no local rule overrides.
2. Add `.prettierignore` and `.eslintignore`, both excluding `android/` and `ios/` (native platform projects; no hand-written JS/TS lives there, and their build outputs are already `.gitignore`d).
3. `.prettierignore` additionally excludes `package-lock.json` (npm-regenerated; reformatting it only creates churn) and `*.md` — every project document uses a deliberate one-sentence-per-line style, and Prettier's Markdown formatter would collapse or rewrite that style project-wide.
4. Add a `format:check` npm script (`prettier --check .`), mirroring the existing `lint` script, so Prettier compliance is actually checkable going forward.
5. Reformatted `package.json` itself (Prettier flagged one real issue: a missing trailing newline) since it is genuine project source, not a generated or excluded file.

### Consequences

Advantages

Prettier is now actually usable and enforceable, matching the standard ESLint already had

Project documentation's intentional formatting is protected from being silently rewritten

No new dependencies — only configuration and one npm script were added

Disadvantages

None identified

### Future

If a real `src/` tree with hand-written code appears under `android/` or `ios/` (unlikely, per ADR-002: Kotlin owns native logic, not JS), the ignore scope in this ADR should be revisited.

Note (2026-07-15, Phase 005): the `ios/` folder referenced above was already removed from the repository before this ADR was written; the ignore pattern was added defensively and is harmless, but SESSION.md had stale "ios/ exists" entries carried forward from before its removal — corrected in Phase 005's SESSION.md update rather than by editing this historical record.

---

# ADR-018

## Path Alias Resolution (React Native Side)

Status

Accepted

Date

2026-07-15

### Context

ADR-016 deferred the path-alias / module-resolution decision to Phase 005, once real folders existed to alias against. Phase 005 created the `src/` tree (`screens/`, `components/`, `navigation/`, `hooks/`, `services/`, `stores/`, `theme/`, `assets/`), so that decision is now due.

Metro (the React Native bundler) does not read `tsconfig.json`'s `paths` for runtime module resolution — a separate mechanism is required for aliases to actually work in the built app, not just in the editor/type-checker. The common solution is `babel-plugin-module-resolver`, a third-party dependency.

Before adding it, ENGINEERING_PRINCIPLES.md's Dependency Management questions were applied: "can we reasonably build this ourselves?" The installed Metro version (`0.84.4`, via `@react-native/metro-config@0.86.0`) was checked directly and already supports `resolver.extraNodeModules` — a built-in mechanism for exactly this purpose.

### Decision

Implement path aliases using Metro's built-in `resolver.extraNodeModules` in `metro.config.js`, with no new dependency. The same mapping is mirrored in two other places that each do their own, separate module resolution:

- `tsconfig.json` (`baseUrl` + `paths`) — for type-checking and editor navigation
- `jest.config.js` (`moduleNameMapper`) — for test resolution

All three must be kept in sync manually; each file's aliasing block is commented to say so.

Aliases defined: `@screens`, `@components`, `@navigation`, `@hooks`, `@services`, `@stores`, `@theme`, `@assets` — one per top-level `src/` folder, each supporting both a bare import (`from '@theme'`, resolving to that folder's `index`) and a subpath import (`from '@theme/colors'`).

The mechanism was verified end-to-end with a temporary smoke test (a throwaway file + import in each of the three tools, `jest` and `tsc`, both confirmed passing for bare and subpath forms), then removed — no placeholder/dead code was left behind. Full Metro-bundler resolution inside a running app was not exercised in this phase (no screen mounts anything yet); that will be exercised naturally when Phase 007 (Navigation) first runs the app on a physical device.

### Consequences

Advantages

No new dependency

Aliases work identically whether resolved by Metro, Jest, or `tsc`

Verified mechanism, not just verified configuration

Disadvantages

Three files must be kept in sync by hand whenever a new top-level `src/` folder is added — there is no single source of truth for the alias list. Acceptable at this scale (8 aliases); revisit if this becomes error-prone.

Metro-bundler-level resolution (as opposed to Jest/tsc resolution) remains unverified until Phase 007's first real app run.

### Future

If alias drift between the three config files becomes a recurring problem, reconsider `babel-plugin-module-resolver` (which can read a single config) at that point — this ADR's "no new dependency" call was correct for 8 stable, rarely-changing aliases, not necessarily forever.

---

# ADR-019

## Feature-Flag Gated Navigation (Environment Configuration)

Status

Accepted

Date

2026-07-15

### Context

Phase 006 is "Environment Configuration." Nova has no backend, no cloud AI, and no secrets to manage (ABSOLUTE RULES in CLAUDE.md), so the conventional `.env` / per-environment-API-URL pattern that phase name usually implies does not apply here. The real near-term need is different: PROJECT_ROADMAP.md builds Nova's ten engines incrementally across ~90 phases, but Phase 007 (Navigation) needs to wire up all ten screens (`src/screens/*`, created in Phase 005) long before most of those engines exist. Without a way to gate that, Phase 007 would either link to screens with nothing behind them, or Phase 007 would have to hardcode which screens are "really" ready — a decision that would need to be re-made and re-wired by hand every time a new engine phase completes.

### Decision

Add `src/env/index.ts` exporting:

- `IS_DEV` — a direct alias of React Native's built-in `__DEV__` global (no custom dev/release detection invented).
- `FEATURES` — a typed, frozen map of screen name → boolean, one entry per engine-backed screen (`assistant`, `notifications`, `automation`, `memory`, `history`, `plugins`), defaulting to `false` until that engine's roadmap phases are done. `developer` and `diagnostics` are tied to `IS_DEV` rather than an engine. `home` and `settings` are intentionally not gated — they are unconditional shell screens with no engine dependency.

Phase 007 will read `FEATURES` when building navigation, so enabling a screen becomes a one-line flip in this file once its engine is complete, rather than a navigation-code change.

Given `@env` follows the same one-alias-per-`src/`-folder pattern as ADR-018, it was added to `metro.config.js`, `tsconfig.json`, and `jest.config.js` alongside the existing eight.

### Consequences

Advantages

Phase 007 has a concrete, typed contract to build against instead of guessing which screens should be reachable

Enabling a finished engine's screen is a one-line change, not a navigation refactor

No speculative code — `FEATURES` only encodes screens that already exist (Phase 005) and engines already named in PROJECT_MANIFEST.md, nothing hypothetical beyond that

Disadvantages

`FEATURES` must be updated by hand as each engine phase completes; nothing enforces that a flag actually reflects reality. Acceptable for now — the alternative (deriving flags automatically from which native modules are registered) is real complexity not justified at this stage.

### Future

If Nova ever needs true per-environment configuration (e.g. a staging vs. production on-device model set), extend `src/env/index.ts` rather than introducing a new mechanism.

---

# ADR-020

## Path Alias Resolution, Corrected: Adopt babel-plugin-module-resolver

Status

Accepted — supersedes the Metro-side mechanism in ADR-018

Date

2026-07-15

### Context

ADR-018 verified path aliases through `tsc` and `jest`, but explicitly noted: "Full Metro-bundler resolution inside a running app was not exercised in this phase... that will be exercised naturally when Phase 007 (Navigation) first runs the app on a physical device." Phase 007 did exactly that, and it failed: the app showed a red screen — `Unable to resolve module @navigation/RootNavigator`.

Root cause, confirmed by reading `metro-resolver/src/resolve.js` (`parseBareSpecifier`): for any import starting with `@` that contains exactly one `/`, Metro treats the **entire string** as a single atomic package name — mirroring real npm's `@scope/name` convention — with an empty subpath. So `@navigation/RootNavigator` is parsed as packageName `"@navigation/RootNavigator"`, subpath `""`, and Metro looks up `extraNodeModules["@navigation/RootNavigator"]`, which doesn't exist (the map only has a `"@navigation"` key). Only bare imports with no subpath at all (`from '@theme'`, `from '@env'`) ever worked, because those never enter that two-segment parsing branch. This is a hard limitation of Metro's built-in resolver for a "prefix + arbitrary subpath" alias scheme — not a configuration mistake fixable by adjusting `extraNodeModules` further.

`tsc` and `jest` didn't catch this because neither uses Metro's resolver: `tsc` uses its own glob-style `paths` substitution, and Jest (at the time) used its own regex-based `moduleNameMapper` — both are unrelated mechanisms that happened to mask a bug specific to Metro's real bundler.

### Decision

Replace the Metro-side mechanism with `babel-plugin-module-resolver`, configured once in `babel.config.js`. It rewrites aliased imports to relative paths at the Babel/AST transform stage — before Metro's resolver (or Jest's, via `babel-jest`) ever sees the `@`-prefixed specifier — so Metro's `@scope/name` parsing quirk never comes into play.

Consequently:

- `metro.config.js` no longer sets `resolver.extraNodeModules` — back to the default config, with a comment pointing here.
- `jest.config.js` no longer sets `moduleNameMapper` — `babel-jest` applies the same `babel.config.js` plugin during test transforms, confirmed by re-running the full suite (`env.test.ts`, `App.test.tsx`) with `moduleNameMapper` removed: still passing.
- `tsconfig.json`'s `paths` are unchanged — `tsc` doesn't run through Babel, so it still needs its own mapping.

This reduces the "must stay in sync by hand" surface ADR-018 flagged as a disadvantage from three files to two (`babel.config.js` and `tsconfig.json`).

Verification performed: full toolchain (`eslint`, `prettier --check`, `tsc --noEmit`, `jest`) passing, plus **actual on-device verification** — built, installed, and launched on the connected physical device (I2219, Android 16), confirmed via `adb logcat` (no crashes, no JS errors) and screenshots that Home renders, tapping "Settings" navigates with a native transition, and the hardware back button returns to Home.

### Consequences

Advantages

Aliases now work identically in Metro, Jest, and `tsc` — actually verified in a running app, not just in test tooling

One fewer file to keep in sync (two instead of three)

Standard, widely-used solution for exactly this problem in the React Native ecosystem

Disadvantages

One new dependency (`babel-plugin-module-resolver`) was added after all — ADR-018's "no new dependency" call did not survive contact with the real bundler. Recorded here rather than pretending ADR-018 was fully correct: it was correct for what it verified (`tsc`, `jest`), and wrong for what it didn't (Metro).

### Future

This is the definitive alias mechanism going forward. If a new top-level `src/` folder is added, update both `babel.config.js` and `tsconfig.json` — not `metro.config.js` or `jest.config.js`, which no longer carry alias config.

---

# Future ADRs

Every future architectural decision must follow this document.

Never overwrite previous decisions.

Instead

Create a new ADR.

If necessary,

Mark the previous ADR as

Superseded

and explain why.

Architecture evolves.

History should never be lost.