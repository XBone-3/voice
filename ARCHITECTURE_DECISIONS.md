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

# ADR-021

## Theme System (Material 3 Foundation)

Status

Accepted

Date

2026-07-15

### Context

PROJECT_ROADMAP.md splits theming into two phases: Phase 008 "Theme System" and Phase 009 "Design Tokens." This ADR covers Phase 008 only — the mechanism (context, provider, light/dark switching) — not the full token catalog. Interpreted literally: Phase 008 builds the plumbing with the smallest honest color set needed to make light/dark mode actually work and be visibly testable; Phase 009 is where the complete Material 3 token catalog (full color roles, typography scale, elevation, motion curves — ADR-009) gets built out on top of this mechanism.

The four screens built in Phase 007 had no shared theming at all — no explicit background/text colors, just default OS chrome. This meant "dark mode" wasn't actually controlled by the app; it was accidental.

### Decision

Built in `src/theme/`:

- `types.ts` — a `Theme` interface: `mode` (`'light' | 'dark'`) plus five color roles (`background`, `surface`, `text`, `textSecondary`, `primary`)
- `light.ts` / `dark.ts` — two `Theme` objects using Material 3's baseline color values (not invented colors)
- `ThemeContext.tsx` / `ThemeProvider.tsx` — plain React Context, no new dependency (ADR-013's "can we build it ourselves?" — yes). `ThemeProvider` reads RN's built-in `useColorScheme()` and selects light or dark; consumers only ever call `useTheme()`, never `useColorScheme()` directly, so a manual override can be added later (e.g. in Phase 011 Settings) without touching any consumer.
- `src/navigation/theme.ts` — a small adapter (`toNavigationTheme`) mapping our `Theme` to React Navigation's own `Theme` shape (`{ dark, colors, fonts }`, confirmed by reading `@react-navigation/native`'s `DefaultTheme`/`DarkTheme` source), so the native header bar follows the same theme instead of showing React Navigation's unrelated defaults.
- All four Phase 007 screens updated to consume `useTheme()` for `backgroundColor`/`color` instead of relying on implicit OS defaults.

Verification: 2 new tests (`__tests__/theme.test.tsx`) confirming `ThemeProvider` resolves to `lightTheme`/`darkTheme` based on `useColorScheme()`. Per the Phase 007 lesson (`tsc`/`jest` passing doesn't guarantee correctness in the real app), this was also verified on the physical device in both modes: toggled with `adb shell cmd uimode night yes/no`, screenshotted both, confirmed correct colors **and** that the native header bar changes too (via the navigation theme bridge) — not just the screen body.

### Consequences

Advantages

Dark mode is now actually controlled by the app, not accidental OS chrome

Native header bar and screen body always agree, because both read the same `Theme`

No new dependency

Mechanism is provably correct on-device, not just in tests

Disadvantages

Only five color roles exist — no typography, spacing, or elevation tokens yet. Any screen needing those still hardcodes them until Phase 009. This is intentional scope control, not an oversight.

### Future

Phase 009 (Design Tokens) expands `src/theme/` with the full Material 3 catalog. It should extend the existing `Theme` interface rather than replace the mechanism built here.

---

# ADR-022

## Design Tokens (Material 3 Catalog Expansion)

Status

Accepted

Date

2026-07-15

### Context

ADR-021 explicitly deferred the full Material 3 token catalog to Phase 009 and instructed that it extend, not replace, Phase 008's `Theme` interface and mechanism. This phase does exactly that.

### Decision

Added four new mode-independent token modules (identical between light and dark — only `colors` differs by theme):

- `src/theme/typography.ts` — the full Material 3 type scale (15 styles: `display{Large,Medium,Small}`, `headline{Large,Medium,Small}`, `title{Large,Medium,Small}`, `body{Large,Medium,Small}`, `label{Large,Medium,Small}`), each with `fontSize`/`lineHeight`/`fontWeight`/`letterSpacing`. No `fontFamily` override — Android's system default (Roboto) applies.
- `src/theme/spacing.ts` — a 4dp-grid scale (`xs`=4 through `xxl`=48).
- `src/theme/elevation.ts` — Material 3's 6 elevation levels in dp (0, 1, 3, 6, 8, 12), mapping directly to Android's `elevation` style property.
- `src/theme/motion.ts` — 3 duration buckets (`durationShort`=100ms, `durationMedium`=300ms, `durationLong`=500ms) — a deliberate simplification of M3's full 12-token duration scale, since nothing consumes finer granularity yet; expand when Phase 091 (Animations) actually needs it.

`Theme` (`types.ts`) was extended, not replaced: the 5 Phase 008 color role names (`background`, `surface`, `text`, `textSecondary`, `primary`) are kept for backward compatibility, with the fuller Material 3 vocabulary added alongside (`onPrimary`, `primaryContainer`, `onPrimaryContainer`, `secondary`, `onSecondary`, `onBackground`, `onSurface`, `surfaceVariant`, `onSurfaceVariant`, `error`, `onError`, `outline`). `light.ts`/`dark.ts` were updated with real Material 3 baseline color values for the new roles (the existing 5 values were left untouched to avoid perturbing the already device-verified Phase 008 result) and now import/spread the shared `typography`/`spacing`/`elevation`/`motion` modules instead of each phase re-declaring them.

`secondaryContainer`, `tertiary`/`tertiaryContainer`, and the full 12-token motion scale were deliberately not added — nothing consumes them yet; add when a real consumer (likely Phase 010 UI Components) needs them, per the project's dependency/scope-minimalism principle applied to tokens as well as code.

All 4 Phase 007/008 screens were retrofitted to use `theme.typography.*` and `theme.spacing.*` instead of hardcoded `fontSize`/`gap`/`marginTop` values, closing the Technical Debt item SESSION.md flagged for this phase.

Verification: 3 new tests confirming `typography`/`spacing`/`elevation`/`motion` are identical between `lightTheme`/`darkTheme` (only `colors` differs), the full 15-style type scale is present, and elevation levels increase monotonically. Also verified on the physical device (build, install, launch, screenshot of Home and Settings) — no crashes, correct layout with the new type scale and spacing applied.

### Consequences

Advantages

Screens have a real, complete token vocabulary to build against instead of ad hoc values

Phase 008's mechanism, already device-verified, was untouched — only additive changes

Typography/spacing/elevation/motion defined once, shared by both themes — no duplication

Disadvantages

Token values (especially typography line-heights/letter-spacing) are Material 3 baseline references, not custom-tuned for Nova's brand — acceptable for now, revisit if a distinct visual identity is wanted later

`secondaryContainer`/`tertiary` roles and the full motion scale are still absent — will need adding when a real screen needs them

### Future

Phase 010 (UI Components) is the first expected consumer of the newly added `secondary`/`error` colors and `elevation` tokens (buttons, cards). If it needs roles not yet defined here, extend this catalog rather than hardcoding in the component.

---

# ADR-023

## Shared UI Components

Status

Accepted

Date

2026-07-15

### Context

ADR-022 predicted Phase 010 would be the first consumer of `secondary`/`error`/`elevation` tokens. In practice, the 4 existing screens (still just title text and navigation links) never needed a raised surface, an error state, or a secondary action — so this phase ended up consuming only `background`, `text`, `textSecondary`, `primary` (existing) and `primaryContainer` (new, for ripple). Recorded honestly rather than claiming tokens were used that weren't; `secondary`/`error`/`elevation` remain unconsumed until a screen genuinely needs them (likely Phase 011 Settings, with real setting rows/toggles).

The real, present problem this phase solved: all 4 screens duplicated an identical `flex:1`/`backgroundColor` container, duplicated manual `theme.typography.*` spreading, and Home's 3 navigation "links" were plain `Text` with `onPress` — no press feedback at all, not idiomatic Material.

### Decision

Added to `src/components/` (previously empty except its README):

- **`Screen`** — themed `View` wrapper (`flex:1`, `backgroundColor: theme.colors.background`, optional `center` prop, default `true`). Replaces the container style every screen duplicated.
- **`AppText`** — themed `Text` taking a `variant: keyof Theme['typography']`, applying that type-scale style plus `theme.colors.text` by default (overridable via a `color` prop). Replaces manual `theme.typography.*` spreading in every screen.
- **`MenuLink`** — a `Pressable` + `AppText` combination with `android_ripple` using `theme.colors.primaryContainer`, replacing the underlined-`Text`-with-`onPress` pattern, which had zero touch feedback. Accepts an optional `testID` (a real, useful prop for any consumer's own testing, not test-only scaffolding).

All 4 screens were retrofitted: `SettingsScreen`/`DeveloperScreen`/`DiagnosticsScreen` collapsed to a few lines each (no longer need `useTheme`/`useMemo`/local `createStyles` at all — `Screen`/`AppText` handle theming internally). `HomeScreen` composes `Screen` + `AppText` + 3×`MenuLink`.

Verified: 3 new tests (`Screen` applies theme background, `AppText` applies the requested variant, `MenuLink` renders its label and fires `onPress`), plus on-device verification — rebuilt, installed, launched, screenshotted Home (confirmed ripple-capable links, no more underline styling) and Settings (confirmed navigation still works through the new `Pressable`-based `MenuLink`), no crashes.

### Consequences

Advantages

Real, present duplication removed across all 4 screens, not speculative refactoring

Navigation links now have proper Material ripple feedback, which they never had before

3 of 4 screens no longer need any local theming boilerplate at all

Disadvantages

`secondary`/`error`/`elevation` tokens remain unconsumed — no card/error-state component exists yet since nothing needs one

`MenuLink` is single-purpose (a themed navigation link); a more general `Button` (primary/secondary/text variants) is not yet built since nothing currently needs one beyond navigation

### Future

Phase 011 (Settings Infrastructure) is the next likely consumer of `secondary`/`elevation` (setting rows, possibly a card-like grouping) and may need a general-purpose `Button` beyond `MenuLink`'s navigation-only shape. Extend `src/components/` then rather than building it speculatively now.

---

# ADR-024

## Settings Infrastructure: State Now, Persistence Later

Status

Accepted

Date

2026-07-15

### Context

NON_FUNCTIONAL_REQUIREMENTS.md's Storage Requirements assign configuration to Android Jetpack DataStore — a native API. But re-reading PROJECT_ROADMAP.md in full surfaced something worth stopping on: **Phase 016 "Native Module Infrastructure"**, **Phase 023 "Storage Layer"**, and **Phase 024 "Configuration Repository"** are all separate, later phases. None of them exist yet. Building real DataStore-backed persistence in Phase 011 — or even a JS-only stopgap like `@react-native-async-storage/async-storage` — would mean either jumping ahead of the roadmap's own native-module sequencing, or shipping something that gets ripped out and replaced once Phase 016/023/024 land. Both are exactly the kind of technical debt CLAUDE.md's "every decision should make future phases easier" rule warns against.

So this phase scopes to the settings **state and UI only**, using Zustand — already named in the project's own stack (PROJECT_MANIFEST.md/CLAUDE.md), so adding it now fulfills an existing stack decision rather than making a new one.

The concrete feature: ADR-021 explicitly reserved this extension point when Phase 008 built `ThemeProvider` — *"a manual override can be added later (e.g. in Phase 011 Settings) without touching any consumer."* This phase delivers exactly that.

### Decision

- `src/stores/settingsStore.ts` — a Zustand store holding `themeOverride: 'system' | 'light' | 'dark'` (default `'system'`), **in-memory only, no persistence**. The file's own doc comment states this and points to ADR-024/Phase 023-024 so nobody mistakes the omission for an oversight.
- `ThemeProvider` (`src/theme/ThemeProvider.tsx`) now reads the store: if the override is `'system'`, it behaves exactly as before (`useColorScheme()`); if `'light'`/`'dark'`, that wins regardless of the OS setting. Zero changes to any consumer of `useTheme()` — confirming ADR-021's design held up exactly as intended.
- `SettingsScreen` now has real content: a `Card` (elevation) containing 3 selectable rows (System/Light/Dark) with a checkmark on the active choice, each a `Pressable` with the same ripple pattern as `MenuLink`.
- `secondary`/`error` tokens still went unused this phase too (recorded honestly, as with ADR-023) — a single-select list didn't call for them. `elevation` (via `Card`) is now consumed for the first time.
- No general-purpose `Button` was built — the settings rows are selectable list items, not action buttons; still nothing has needed one.

Verified: 5 new tests (store defaults/setter, `ThemeProvider` resolving `system`/explicit `light`/explicit `dark` regardless of OS scheme) plus a `Card` test. A real test-hygiene bug was found and fixed along the way: resetting the Zustand store in `afterEach` was triggering a React state update on the *previous* test's still-mounted tree outside `act()` — fixed by unmounting before resetting store state.

**On-device verification was the real proof here**, not just tests: installed, launched, opened Settings, tapped "Dark" — the **entire app** (native header, Card surface, all screens) switched to dark immediately, while the device's actual system-level dark mode setting remained "off" the whole time, confirming the override genuinely takes precedence over `useColorScheme()`. Navigated back to Home and confirmed the override persisted across screens. No crashes.

### Consequences

Advantages

Delivers a real, working feature (Nova now has an in-app theme preference, working end-to-end) without building persistence that would need to be rebuilt

Confirms ADR-021's forward-looking design decision was actually correct — no consumer changes needed

`elevation` finally has a real consumer

Disadvantages

The theme choice resets to "System" on every app restart until Phase 023/024 add real persistence — an explicit, documented, temporary limitation, not a bug

`secondary`/`error` tokens remain unconsumed

### Future

When Phase 016 (Native Module Infrastructure) and Phase 023/024 (Storage Layer / Configuration Repository) exist, back `settingsStore` with real persistence (Android DataStore via a native module) rather than reaching for a JS-only stopgap library — read the persisted value on store initialization and write through `setThemeOverride`. The Zustand store shape here should not need to change, only where its state comes from.

---

# ADR-025

## Developer Mode: Read-Only Diagnostics, Logging Deferred

Status

Accepted

Date

2026-07-15

### Context

`src/screens/developer/README.md`, written back in Phase 005, already specified this screen's scope: *"logging controls, feature flags, internal state inspection."* Of those three, only "logging controls" isn't buildable yet — Phase 013 is literally "Logging Framework," which doesn't exist. Building fake or placeholder logging controls now would be dead UI wired to nothing. The other two — feature flags and internal state inspection — are fully achievable with what already exists (`FEATURES` from ADR-019, `theme`/`themeOverride` from ADR-021/024).

### Decision

- `src/env/index.ts` gained `APP_NAME`/`APP_VERSION`, read once from `package.json` (`resolveJsonModule`, already enabled per ADR-016) — centralizing the one deep-relative import here rather than scattering it, following the same pattern `IS_DEV`/`FEATURES` already established.
- `DeveloperScreen` now shows three `Card`-grouped sections, all read-only:
  - **Build Info** — app name, version, dev/production environment
  - **Theme** — the resolved mode and the current override (from Phase 011's `settingsStore`)
  - **Feature Flags** — every key in `FEATURES` with its live Enabled/Disabled state
- A screen-local `InfoRow` component (label + value) was added directly in `DeveloperScreen.tsx`, not promoted to `src/components/` — it has exactly one consumer so far, matching how `ThemeOptionRow` was scoped in Phase 011.
- No manual "enable Developer Mode" toggle was added. The screen remains gated by `FEATURES.developer = IS_DEV` (ADR-019) — debug builds already show it, release builds don't, and Nova is Android-only with physical-device debug-build testing as its primary workflow (ADR-010), so a separate production-facing unlock mechanism isn't needed at this stage. Revisit only if a release-build diagnostics need ever arises (likely Phase 098/099).
- Logging controls are explicitly deferred to Phase 013.

Verified: 3 new tests confirming real build info, live theme override, and every feature flag's actual state are shown (not hardcoded expectations — the flags test reads `FEATURES` itself rather than assuming a value, so it can't silently drift). A second instance of the Phase 011 `act()`-wrapping bug was found in the new test file and fixed the same way (unmount before resetting store state).

**On-device verification**: rebuilt, installed, launched, navigated to Developer, screenshotted — confirmed every row shows real, live data matching the actual `FEATURES` object and `package.json` values, not placeholders. No crashes.

### Consequences

Advantages

The screen is now genuinely useful for verifying engine-rollout status and theme state during development, not just a shell

No dead/placeholder UI — everything shown is live and real

Disadvantages

No logging controls yet — the README's third promise is still open, correctly scoped to Phase 013

### Future

When Phase 013 (Logging Framework) exists, add a log-level control section to this screen following the same `Card` + read-only-display-plus-one-control pattern established here and in Phase 011's theme section.

**Correction (2026-07-15, Phase 013):** re-checking CLAUDE.md's Navigation architecture shows there is no separate "Debug" screen among the 10 defined screens — `DiagnosticsScreen` already exists (a shell since Phase 007), and its own Phase-005 README describes exactly this role ("read-only surface over metrics the native engines expose"). Phase 014 "Debug Screen" almost certainly means giving `DiagnosticsScreen` its first real content (a log viewer over Phase 013's `logger.getEntries()`), not adding a log section to `DeveloperScreen` as this ADR's "Future" note above assumed. Left the original text unedited per this document's own rule (never silently rewrite a past ADR) — this note corrects it instead.

---

# ADR-026

## Logging Framework: Mechanism Only, No Third-Party Reporting

Status

Accepted

Date

2026-07-15

### Context

ENGINEERING_PRINCIPLES.md's Logging section and NON_FUNCTIONAL_REQUIREMENTS.md's Logging Requirements both call for a logging discipline (state transitions, errors, permission changes; never passwords/messages/notification contents/contacts/PII/voice recordings). Nothing enforces or even implements this today — there is no logger at all. PROJECT_ROADMAP.md assigns the framework to this phase and a **separate** Debug Screen to the next (Phase 014) — mirroring the same "mechanism, then UI" split as Theme System/Design Tokens (008/009) and UI Components/Settings Infrastructure (010/011). This phase builds the mechanism only.

No existing `src/` folder fit: `services/` is explicitly scoped ("thin wrappers around the native bridge," per its own Phase-005 README) and a logger isn't a bridge wrapper. Added `src/logger/` as a 10th top-level folder + `@logger` alias, following the exact precedent Phase 006 set when `src/env/` became the 9th.

### Decision

- `src/logger/types.ts` — `LogLevel` (`'debug' | 'info' | 'warn' | 'error'`), `LogEntry` (timestamp, level, tag, message, optional `data`).
- `src/logger/logger.ts` — a `Logger` class, exported as a singleton `logger`. `debug/info/warn/error(tag, message, data?)` each push into a fixed-capacity (200-entry) in-memory ring buffer (`getEntries()` returns a defensive copy, `clear()` empties it) and, in dev builds only (`IS_DEV`), mirror to the matching `console.*` method for immediate visibility during development.
- **No content-based redaction was built.** NON_FUNCTIONAL_REQUIREMENTS.md's "never log passwords/messages/contacts/PII/voice recordings" is a convention callers must follow — nothing calls this with sensitive data yet (no engines exist), so there is nothing to enforce today. Revisit once a real caller with sensitive data exists (e.g. Phase 044 Contacts, Phase 046 SMS).
- **No third-party crash/log reporting service (Sentry, Crashlytics, etc.) was integrated, deliberately.** PROJECT_MANIFEST.md's platform policy prohibits cloud dependencies, and that reasoning applies to logging/crash infrastructure exactly as it does to AI — the logger is 100% local and in-memory, no network calls.
- Wired into two real call sites so the framework isn't built in isolation: `App.tsx` logs `info` on mount (`"Nova started"`), `ThemeProvider` logs `debug` whenever the resolved theme changes (mode + override). Both verified appearing in real `adb logcat` output (`ReactNativeJS` tag) on the physical device, not just in Jest.

Verified: 7 new tests (entry recording per level, optional `data`, `clear()`, defensive-copy `getEntries()`, ring-buffer eviction at capacity, dev-console mirroring). Full regression pass. On-device: rebuilt, installed, launched, confirmed via `adb logcat -t 3000` (a wider buffer window than usual, since the device had gone to sleep and scrolled the default window past the launch — a genuine gotcha worth noting for next time) that both wired log calls appear exactly as expected, and no crashes.

### Consequences

Advantages

Every future engine phase now has a ready-made, real (not placeholder) logging mechanism to call into

No cloud dependency introduced — consistent with the project's strictest policy

Verified working on-device, not just in tests

Disadvantages

No redaction/sensitivity enforcement yet — purely a documented convention until a real caller needs it

Ring buffer is lost on app restart (acceptable — it's a debugging aid, not an audit log; NON_FUNCTIONAL_REQUIREMENTS.md doesn't ask for log persistence)

### Future

Phase 014 (Debug Screen) should read `logger.getEntries()` to build a log viewer, most likely on `DiagnosticsScreen` rather than `DeveloperScreen` (see the correction note above). Full per-subsystem metrics (init time, memory, battery impact — NON_FUNCTIONAL_REQUIREMENTS.md's Observability section) remain `DiagnosticsScreen`'s later, engine-dependent work (its README already says "Phase 035 and beyond").

---

# ADR-027

## Debug Screen: Log Viewer on DiagnosticsScreen

Status

Accepted

Date

2026-07-15

### Context

Confirmed the correction recorded in ADR-026: CLAUDE.md's Navigation architecture defines only 10 screens with no separate "Debug" screen, and `DiagnosticsScreen`'s own Phase-005 README already describes exactly this role. This phase gives `DiagnosticsScreen` its first real content — a viewer over Phase 013's `logger.getEntries()`. Full per-subsystem metrics (init time, memory, battery impact) remain deferred, per that same README, to "Phase 035 and beyond," since no engines exist to measure yet.

### Decision

- `DiagnosticsScreen` now renders: a header (title + Refresh/Clear actions), then either an empty state ("No log entries yet.") or a `FlatList` of log entries, most-recent-first.
- Refreshing uses `useFocusEffect` (from `@react-navigation/native`, already a dependency) to reload entries whenever the screen gains focus — no polling, per ENGINEERING_PRINCIPLES.md's "prefer callbacks/listeners" battery guidance. A manual Refresh button covers the case of new entries arriving while already on the screen.
- Each row (`LogRow`, screen-local) color-codes by level: `error` → `theme.colors.error`, `warn` → `theme.colors.secondary`, `info`/`debug` → `theme.colors.text`. Row separators use `theme.colors.outline`. **This is the first real, honest consumption of the `error`, `secondary`, and `outline` color tokens** — unused since Phase 009 (`error`/`secondary` were explicitly flagged as unconsumed in ADR-023/024/025's "Disadvantages" sections) — not forced in; they fit the log-level semantics naturally.
- Added **`src/components/Button.tsx`** — a generic action button (Pressable + ripple), finally resolving the "no general-purpose Button" gap flagged since ADR-023. Its implementation necessarily resembles `MenuLink`'s (both are themed Pressable+ripple+AppText); kept as separate, small, deliberate duplication rather than refactoring `MenuLink` to share code, per CLAUDE.md's "don't redesign previous phases unless required" — `MenuLink` is semantically navigation-specific (its own doc comment says so) while `Button` is a generic action, and Phase 010's already-verified `MenuLink` wasn't worth touching for a minor DRY gain.

Verified: 6 new tests (`Button` render/press; `DiagnosticsScreen` empty state, showing existing entries, Refresh picking up new entries, Clear emptying both the logger and the display). `useFocusEffect` was mocked to behave like `useEffect` for this focused unit test, since it needs a real navigation context to run normally — a standard pattern for testing screens that use React Navigation's focus hooks in isolation. One overly specific test assertion (checking the rendered node's exact type matched the raw `Pressable` reference) was written, found to be fragile — `findByProps` matched the outer `Button` composite rather than the inner host node — and removed rather than patched, since the behavior it was reaching for was already covered by the passing press-interaction tests.

**On-device verification, the most interactive yet**: rebuilt, installed, launched, navigated to Settings, toggled the theme override twice (generating real `ThemeProvider` log entries), navigated to Diagnostics, and confirmed via screenshot that all 4 real entries appeared in the correct order with correct tags/timestamps/messages. Tapped Clear and confirmed the empty state appeared. One navigation mistake along the way: pressing the hardware back button while on Home (the stack's root) exits the app entirely, as expected Android back-stack behavior — not a bug, just a reminder to use the in-app header back arrow when popping a single screen rather than the hardware button from the root.

### Consequences

Advantages

`DiagnosticsScreen` is now genuinely useful for observing real app behavior during development, not a shell

Closes two long-tracked gaps at once: the missing `Button` component and the unused `error`/`secondary`/`outline` tokens — both closed by genuine need, not forced

No polling — respects the project's battery-awareness principle

Verified interactively on the physical device (navigate, toggle, observe, clear), not just statically screenshotted

Disadvantages

`Button` and `MenuLink` duplicate similar Pressable+ripple styling code — a deliberate, small, acceptable tradeoff (see Decision)

### Future

Phase 035 and beyond should extend `DiagnosticsScreen` with real per-engine metrics (init time, memory, battery impact) once those engines exist, per NON_FUNCTIONAL_REQUIREMENTS.md's Observability section — additive to this log viewer, not a replacement.

---

# ADR-028

## Native Kotlin Package Layout (Resolves Known Issue #2)

Status

Accepted — resolves the CLAUDE.md self-conflict flagged since Phase 005 (SESSION.md Known Issues #2)

Date

2026-07-15

### Context

CLAUDE.md contains two different native-code layouts that conflict with each other and were never reconciled:

- Its "Folder Structure" section: `android/native/{voice,notification,accessibility,bridge}`
- Its "Kotlin Structure" section: `android/{voice,notification,automation,memory,bridge,services,receivers,permissions,repository,utils}`

Neither accounts for the real Gradle/Android constraint that Kotlin sources must live under `android/app/src/main/java/<package>/` to compile at all — `applicationId` is `com.voice` (per `android/app/build.gradle`; Known Issue #1 tracks that this hasn't been rebranded to Nova yet). PROJECT_MANIFEST.md's document conflict-resolution hierarchy doesn't help here, since both conflicting sections are inside CLAUDE.md itself — the hierarchy resolves conflicts *between* documents, not a document's self-contradiction. Per ARCHITECTURE_DECISIONS.md's own stated authority ("future contributors must read this before proposing architectural changes"), this ADR is the resolution — CLAUDE.md's own text is left untouched (its two conflicting sections are historical/aspirational, not something to silently edit), but going forward, this ADR governs where native code actually goes.

Phase 016 (Native Module Infrastructure) is next and needs this decided before it can start.

### Decision

Canonical base path: **`android/app/src/main/java/com/voice/`**, then:

```
bridge/       — TurboModules, NativeModules, EventEmitters (ADR-008, thin bridge). Phase 016/017.
permissions/  — Permission request/management helpers. Phase 018.
services/     — Foreground Service and other Android Services. Phase 019/020.
receivers/    — BroadcastReceivers. Phase 021.
device/       — Device information helpers. Phase 022.
repository/   — Repository Pattern data access (DataStore/Room, per CLAUDE.md's Code
                Philosophy). Phase 023/024.
eventbus/     — Internal cross-module event bus. Phase 025.
utils/        — Shared utilities; no business logic of its own.
```

This adopts the "Kotlin Structure" section's naming (it's the more detailed, Kotlin-specific of the two) as the base, correcting it to sit under the real required Gradle path, and mapping each package to the specific near-term phase that will populate it.

**Deliberately not decided yet:** top-level packages for the engine-specific work more than a few phases out — `voice/`, `wakeword/`, `command/`, `context/`, `notification/`, `accessibility/`, `automation/`, `memory/`, `plugin/`, `analytics/` (this last one meaning local performance/observability metrics per NON_FUNCTIONAL_REQUIREMENTS.md's Observability section, not third-party tracking — that would violate the no-cloud-dependencies policy). PROJECT_ROADMAP.md spreads these across Phases 026–090; specifying their internal package structure now, 10+ phases ahead of the work, would be exactly the kind of speculative architecture this project's own discipline (applied consistently since Phase 005's folder-structure and Phase 009's token-catalog scoping) argues against. Each gets its own top-level package when its own dedicated phase begins.

No folders were created this phase — Gradle/git don't track empty directories, and Phase 016 is what actually populates `bridge/` with real content. This ADR is the decision; Phase 016 does the creating.

### Consequences

Advantages

Phase 016 has an unambiguous, real (Gradle-compatible) path to build against

Resolves a documentation conflict that had been carried forward, unaddressed, across 10 prior phases (005–014)

Avoids over-specifying package structure for engines 10+ phases away

Disadvantages

CLAUDE.md's own two conflicting sections remain textually unedited — a future reader skimming only CLAUDE.md (not this ADR) could still be misled. Mitigated by this ADR being referenced from SESSION.md's Known Issues resolution and from Architecture Status going forward.

### Future

As each engine's dedicated phase begins (026 onward), add its top-level package here via a short ADR amendment (not a full new ADR) rather than deciding all of them speculatively now.

---

# ADR-029

## Native Module Infrastructure: TurboModule Registered, Promise-Based, Stale-Build False Alarm

Status

Accepted

Date

2026-07-15

### Context

Phase 016 built the first native Kotlin module (ADR-028's `bridge/` package): a `NativeBridgeInfo` TurboModule exposing `getAndroidVersion()`, registered via `BridgePackage` (a `BaseReactPackage`, following react-native-screens' own real implementation) and added manually to `MainApplication.kt`'s `packageList`, per RN's documented pattern for packages that cannot be autolinked.

After the first successful native build (`BUILD SUCCESSFUL`, zero warnings once the deprecated 7-arg `ReactModuleInfo` constructor was corrected to the 6-arg form), on-device verification kept failing: `TurboModuleRegistry.get('NativeBridgeInfo')` returned `null` in JS, logging `"NativeBridgeInfo module is not linked"`, even though temporary native logging proved `BridgePackage.getModule("NativeBridgeInfo")` **was** being called and **did** return a valid, correctly-typed `NativeBridgeInfoModule` instance. Core bundled modules (`PlatformConstants`, `DeviceInfo`) resolved fine via the identical `TurboModuleRegistry.get()` call in the same JS runtime, ruling out a systemic Bridgeless failure.

Extensive isolated testing eliminated, one at a time, with device evidence for each:
- **Stale installed APK** — reinstalled fresh, confirmed via `adb shell dumpsys package` timestamps.
- **Stale Metro bundle** — killed Metro, restarted with `--reset-cache`, confirmed "transform cache was reset"; bug persisted.
- **Synchronous vs. Promise-based method** — converted `getAndroidVersion()` to return `Promise<string>`; identical failure either way.
- **`useTurboModuleInterop` feature flag** — this New-Architecture flag defaults to `true` (`ReactNativeNewArchitectureFeatureFlagsDefaults.kt`) and its `getLegacyModule()` code path explicitly excludes real TurboModules. Force-disabled it via `ReactNativeFeatureFlags.dangerouslyForceOverride(...)`, confirmed the flag really was `false` at call time via logging — bug persisted anyway. Reverted this override afterward since it never fixed anything and left an unproven "dangerous" API call in `MainApplication.kt`.

To settle whether this was a general RN 0.86 Bridgeless limitation or something specific to this project, a throwaway minimal RN 0.86 app was scaffolded from scratch (`npx @react-native-community/cli init`, New Architecture on by default) with the exact same manually-registered `BaseReactPackage` TurboModule pattern, including the Promise-based signature, the `babel-plugin-module-resolver` path-alias config, and a two-hop service-wrapper JS structure mirroring `bridgeInfo.ts`. **It worked correctly on the first try** — `getAndroidVersion()` resolved and returned the real Android version. This proved the registration pattern itself, the async signature, and the alias resolution were never the problem.

Given the fresh template worked and nothing about the JS/Kotlin structure differed meaningfully, the remaining suspect was this project's own build state — accumulated across many iterative edits, native rebuilds, and constructor-signature fixes earlier in this same phase. A fully clean rebuild (`rm -rf node_modules android/build android/app/build android/.gradle`, fresh `npm install`, fresh `gradlew assembleDebug` — 136/136 tasks executed, none cached — plus Metro restarted with `--reset-cache`) resolved it immediately: `'[App] Native bridge OK — Android 16'` logged correctly, confirmed across two independent relaunches.

### Decision

- Ship `NativeBridgeInfo` as a Promise-based TurboModule (`getAndroidVersion(): Promise<string>`), not synchronous — kept from the debugging process as a genuinely safer default (no reliance on `isBlockingSynchronousMethod`), independent of the root cause.
- Root cause of the on-device failure was a corrupted/stale build artifact somewhere in `node_modules`, `android/build`, `android/app/build`, `android/.gradle`, or Metro's transform cache — not a code or architecture defect. No production code changes were needed beyond the async signature; the fix was a clean rebuild.
- **New standing practice**: whenever a native-module phase behaves inexplicably on-device after several native rebuilds within the same session (Kotlin returns a valid value but JS doesn't see it, or similar "impossible" splits between native and JS state), do a fully clean rebuild (delete `node_modules`, all `android/build*` output, `.gradle`, and Metro cache) *before* spending further effort on architectural theories. This session spent significant time disproving Metro caching, the interop flag, and sync-vs-async before reaching the actual cause.
- When a bug's cause is genuinely ambiguous between "my project" and "the platform," build the smallest possible fresh reproduction of the platform's own documented pattern rather than continuing to theorize against the framework's internals — it settled this question in one build/run cycle after roughly a dozen failed on-device attempts against the real project.

### Consequences

Advantages

First real native Kotlin↔JS bridge working and verified on the physical device, closing out Phase 016

Promise-based signature is a better long-term default for all future TurboModule methods in this project

The clean-rebuild-first practice and the throwaway-repro-app practice are now documented, reusable techniques for future phases' native debugging

Disadvantages

The actual root cause (which specific stale artifact) was never isolated — a full clean rebuild fixes it but doesn't identify whether it was Gradle's CMake cache, a stale generated codegen file, or something in Metro's haste map. If this recurs, isolate incrementally (Metro cache alone, then `android/app/build` alone, etc.) rather than nuking everything at once.

Significant session time was spent on architectural theories (feature flags, sync/async, interop) that turned out to be unrelated — all reverted cleanly, but worth remembering clean-rebuild is a cheap early check

### Future

If native modules ever behave inconsistently again after multiple same-session rebuilds, try a clean rebuild before deep architectural investigation. `docs/architecture/overview.md` should note the Promise-based-by-default convention for new TurboModule methods.

---

# ADR-030

## Turbo Module Setup: Native-to-JS Event Emission

Status

Accepted

Date

2026-07-15

### Context

PROJECT_ROADMAP.md names Phase 017 "Turbo Module Setup," but Phase 016 ("Native Module Infrastructure") already built and device-verified a complete, working TurboModule — registration pattern, codegen, and a real call-and-return method (`getAndroidVersion()`). Unlike most prior phases, no Phase-005 screen README or earlier ADR note disambiguated what 017 specifically adds on top of that. Rather than guess between "invent a new capability" and "harden what already exists" — either of which risks either speculative/fabricated feature work or redundant no-op work, both of which CLAUDE.md explicitly warns against — the user was asked directly. Answer: build the event-emission half of the bridge.

ADR-008 ("Thin Bridge") defines the bridge as carrying **commands, events, and state**. Phase 016 delivered commands only (a call that returns a value). This phase adds native → JS events — a `NativeEventEmitter`-based subscription, the standard React Native mechanism, completing the triad before Phase 018 (Permission Manager) and later phases (019 Foreground Service, 020 Lifecycle Manager, 021 Broadcast Receivers) need to push native-initiated notifications to JS.

The remaining design question was which event to build the pattern around. Building a fake/synthetic event (e.g., a manually-fired "bridge ready" signal) would be exactly the kind of proof-of-concept-only, no-real-consumer code CLAUDE.md and this project's own established discipline (ADR-019, ADR-023, ADR-028) consistently avoid. `ComponentCallbacks2.onTrimMemory()` was chosen instead: a genuine Android system callback (fires on real OS-reported memory pressure), not duplicated by any existing RN API (`AppState` covers foreground/background only, nothing about memory), independently triggerable for verification via Android's own `adb shell am send-trim-memory` tool (not a simulation written by this project), and it gives NON_FUNCTIONAL_REQUIREMENTS.md's Memory section (background service memory limits, "no leaks") a real signal to react to, rather than inventing an unrelated demo event.

### Decision

- `src/nativeSpecs/NativeBridgeInfo.ts` — `Spec` gains `addListener(eventName: string): void` and `removeListeners(count: number): void`, the standard boilerplate `NativeEventEmitter` requires of any event-emitting native module's JS-visible interface.
- `android/.../NativeBridgeInfoModule.kt` — implements `addListener`/`removeListeners` as no-ops (Android needs no explicit listener bookkeeping, unlike iOS — this is the standard, documented pattern). The module itself implements `ComponentCallbacks2`, registered via `reactApplicationContext.registerComponentCallbacks(this)` in the `initialize()` lifecycle hook and unregistered via `unregisterComponentCallbacks(this)` in `invalidate()` — paired registration/cleanup specifically to avoid the leaked-callback/retained-context problem NON_FUNCTIONAL_REQUIREMENTS.md's Reliability section warns about. `onTrimMemory(level)` emits `"onMemoryPressure"` (payload: the raw trim level) via `reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(...)` — the same mechanism used internally by React Native's own core modules (confirmed by reading `ReactContext.java`), not a novel or exotic API.
- `src/services/bridgeInfo.ts` — new `subscribeToMemoryPressure(callback): () => void`, wrapping `NativeEventEmitter(NativeBridgeInfo)`. Returns a no-op unsubscribe and logs a warning (matching `getAndroidVersion()`'s existing not-linked handling) if the module isn't available, rather than throwing.
- `App.tsx` — subscribes on mount alongside the existing bridge check, logging each event via the existing `logger` (`"Memory pressure signaled — level N"`), and returns the unsubscribe function from the effect for proper cleanup. This gives the event a real, immediate consumer: `DiagnosticsScreen`'s existing log viewer (ADR-027) displays it with no changes to that screen at all, since it already renders whatever lands in the logger.

Verified: 1 new Jest test (`subscribeToMemoryPressure` logs a warning and returns a safe no-op unsubscribe when the module isn't linked, e.g. in Jest). Full regression pass (`eslint`/`prettier`/`tsc`/`jest`, 9 suites, 35 tests) and a clean `gradlew assembleDebug` with zero warnings.

**On-device verification, using a real Android system mechanism rather than an in-app simulation**: installed, launched, confirmed the existing command pattern still works (`'Native bridge OK — Android 16'`), then ran `adb shell am send-trim-memory com.voice RUNNING_CRITICAL` — confirmed via `adb logcat` that `'[App] Memory pressure signaled — level 15'` (15 = the real `TRIM_MEMORY_RUNNING_CRITICAL` constant value) was received and logged within ~200ms. Navigated to `DiagnosticsScreen` and confirmed the entry appears correctly, color-coded as a warning, with correct timestamp and tag, no code changes needed to that screen. No crashes.

### Consequences

Advantages

Completes ADR-008's "commands, events, state" bridge triad — both halves (call-and-return, native-initiated push) are now proven patterns future engine phases can follow

The chosen event is genuinely useful (ties to a documented NFR concern) rather than a synthetic proof-of-concept with no real consumer

Verified with a real OS-level trigger (`adb shell am send-trim-memory`), not a simulated/fake event fired from within the app's own code

`DiagnosticsScreen` required zero changes to display the new event — confirms ADR-027's log-viewer design was general enough to absorb new event sources

Disadvantages

`onMemoryPressure` currently only reaches the logger — no engine yet reacts to it (e.g. by reducing its own memory footprint). Acceptable: no memory-sensitive engine exists yet: this phase's job was proving the event pattern, not building a memory-response policy

Android's `adb shell am send-trim-memory` only allows escalating trim levels within a single session (attempting a lower level after a higher one throws `IllegalArgumentException`) — a testing-tool quirk, not a limitation of the implementation; noted here so a future session doesn't waste time on it

### Future

When a future engine phase (most plausibly one from Phase 026 onward, or the Memory Engine phases 067–072) needs to react to memory pressure rather than just log it, subscribe via `subscribeToMemoryPressure` from that engine rather than adding response logic to `App.tsx` or `bridgeInfo.ts` — both should stay thin per ADR-008.

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