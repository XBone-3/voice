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