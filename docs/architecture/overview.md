# Architecture Overview

Status as of Phase 015 (Architecture Validation), 2026-07-15. First real content for `docs/architecture/`, which had been empty since Phase 001.

This document summarizes the actual architecture built across Phases 001–014, validates it against ARCHITECTURE_DECISIONS.md / ENGINEERING_PRINCIPLES.md / NON_FUNCTIONAL_REQUIREMENTS.md, and records the resolved native package layout (ADR-028) before Phase 016 crosses into native Kotlin work. It reflects current reality — update it as architecture changes, don't let it drift into aspiration (see ADR-015, "Documentation Is Code").

---

## Current State

Nova is, as of Phase 014, a React Native application with **no native Kotlin code beyond the CLI-generated `MainActivity`/`MainApplication`**. Every engine named in PROJECT_MANIFEST.md/ENGINEERING_PRINCIPLES.md (Voice, Wake Word, Command, Context, Notification, Accessibility, Automation, Memory, Plugin, Analytics) is unbuilt. This is expected — PROJECT_ROADMAP.md schedules native module work starting Phase 016. Everything below is the React Native / JS-side foundation those engines will eventually sit behind.

## Module Map (`src/`)

| Module | Purpose | Key files | Introduced |
|---|---|---|---|
| `env/` | Centralized build/environment facts: `IS_DEV`, `APP_NAME`/`APP_VERSION`, per-engine `FEATURES` flags | `index.ts` | Phase 006, extended 012 |
| `logger/` | Leveled, in-memory ring-buffer logger; no persistence, no third-party reporting | `logger.ts`, `types.ts` | Phase 013 |
| `theme/` | Material 3 theme: color roles, full type scale, spacing, elevation, motion; light/dark resolution | `ThemeProvider.tsx`, `ThemeContext.tsx`, `light.ts`/`dark.ts`, `typography.ts`, `spacing.ts`, `elevation.ts`, `motion.ts` | Phase 008, expanded 009 |
| `stores/` | Zustand state; currently just the theme override preference | `settingsStore.ts` | Phase 011 |
| `components/` | Shared presentation components: `Screen`, `AppText`, `MenuLink`, `Card`, `Button` | one file per component | Phase 010, expanded 011/014 |
| `navigation/` | React Navigation wiring: typed param list, root stack navigator, theme bridge to `@react-navigation/native` | `RootNavigator.tsx`, `types.ts`, `theme.ts` | Phase 007 |
| `screens/` | The 10 screens from CLAUDE.md's Navigation architecture. 4 have real content (Home, Settings, Developer, Diagnostics); 6 remain README-only, gated off by `FEATURES` until their engine exists | one folder per screen | Phase 005 (shells), 007/010/011/012/014 (real content) |

## Data Flow (current)

```
useSettingsStore (Zustand)
        │ themeOverride
        ▼
ThemeProvider ── useColorScheme() (OS signal)
        │ resolved Theme
        ▼
useTheme() ── consumed by every screen/component
        │
        ├──► toNavigationTheme() ──► NavigationContainer (native header)
        └──► Screen/AppText/Card/Button/MenuLink (screen bodies)

logger (singleton) ◄── called from ThemeProvider, App.tsx, (future: any engine)
        │ getEntries()
        ▼
DiagnosticsScreen (log viewer, refreshed on focus)
```

Nothing here talks to native Android APIs yet — there is no bridge to talk to.

## Path Aliases

Per ADR-020, aliases are defined in exactly two files (`babel.config.js`, `tsconfig.json`) — not `metro.config.js` or `jest.config.js`, which don't carry alias config after ADR-020 superseded ADR-018's Metro-side mechanism. Current aliases (10): `@env`, `@logger`, `@screens`, `@components`, `@navigation`, `@hooks`, `@services`, `@stores`, `@theme`, `@assets`. `@hooks`/`@services`/`@assets` exist as folders but have no content yet.

## Native Kotlin Package Layout (ADR-028)

Resolves Known Issue #2 (CLAUDE.md's own two conflicting native-layout sections). Canonical base path, required by Gradle: `android/app/src/main/java/com/voice/`, then one package per near-term phase:

| Package | Phase |
|---|---|
| `bridge/` | 016/017 |
| `permissions/` | 018 |
| `services/` | 019/020 |
| `receivers/` | 021 |
| `device/` | 022 |
| `repository/` | 023/024 |
| `eventbus/` | 025 |
| `utils/` | (shared, no dedicated phase) |

Engine-specific packages (`voice/`, `command/`, `notification/`, etc., Phases 026+) are deliberately not pre-specified — see ADR-028's "Future" note. No folders were created this phase; Phase 016 creates `bridge/` when it has real content.

## Dependency Audit

Every runtime dependency, per ADR-013/ENGINEERING_PRINCIPLES.md's Dependency Management gate ("can Android/Kotlin/Jetpack already do this? Can we build it ourselves?"):

| Dependency | Why it exists | Justified in |
|---|---|---|
| `@react-navigation/native` + `native-stack` | Screen navigation; no Android-native equivalent accessible from RN without a bridge that doesn't exist yet | Phase 007 |
| `react-native-screens` | Required peer of `native-stack` | Phase 007 |
| `react-native-safe-area-context` | CLI default, used for safe-area insets | Phase 002 (CLI template) |
| `zustand` | Already named in the project's own stack (PROJECT_MANIFEST.md/CLAUDE.md) — not a new architectural decision | ADR-024 |
| `babel-plugin-module-resolver` (dev) | Metro's built-in `resolver.extraNodeModules` cannot resolve `@alias/subpath` imports — confirmed by reading Metro's resolver source, not assumed | ADR-020 |

No dependency exists without a documented reason. No third-party crash/log reporting, analytics, or cloud service has been added — ADR-026 explicitly ruled that out for logging, and the same reasoning (PROJECT_MANIFEST.md's no-cloud-dependencies policy) applies project-wide.

## Validation Against ARCHITECTURE_DECISIONS.md

| ADR | Status |
|---|---|
| ADR-001 Android Only | ✅ No iOS code added; `ios/` was removed early (Phase 005) |
| ADR-002 Kotlin Owns Native Logic | ✅ Vacuously true — no native logic exists yet to misplace |
| ADR-003 Voice First | Not yet applicable — no voice engine exists |
| ADR-004 Offline First | ✅ Nothing added requires network; app has zero network calls |
| ADR-005 AI Is Optional | Not yet applicable |
| ADR-006 Foreground Service | Not yet applicable — Phase 019 |
| ADR-007 Modular Engine Architecture | Partially — the JS-side modules (`theme`, `logger`, `stores`, `env`) are already independently testable and interface-driven; native engines not started |
| ADR-008 Thin Bridge | Not yet applicable — no bridge exists |
| ADR-009 Modern Material Design | ✅ Material 3 tokens, dark mode, ripple feedback all implemented and device-verified |
| ADR-010 Physical Device Development | ✅ Every phase since 007 has been verified on the connected device (I2219, Android 16) |
| ADR-011 Local Data Ownership | ✅ Settings store is local-only, no upload path exists |
| ADR-012 Navigation Architecture | ✅ Every screen owns its own file; no giant scrolling dashboard |
| ADR-013 Dependency Policy | ✅ See Dependency Audit above — every dependency has a documented reason |
| ADR-014 Performance Over Features | Not yet measured — no perf-sensitive engine work exists yet to regress |
| ADR-015 Documentation Is Code | ✅ Every phase this session has updated SESSION.md/PROJECT_ROADMAP.md/ADRs; this document is a direct product of that discipline |

## Validation Against NON_FUNCTIONAL_REQUIREMENTS.md

- **Performance targets** (wake word, command classification, action execution latency): not yet measurable — no engines exist. Nothing to report false confidence about.
- **Memory/battery**: no background services, no polling anywhere in the codebase (`DiagnosticsScreen`'s refresh uses `useFocusEffect`, not an interval — ADR-027).
- **Storage**: nothing persisted yet; `settingsStore` is explicitly in-memory (ADR-024), by design, until Phase 023/024.
- **Privacy**: no data leaves the device; no analytics/crash-reporting SDKs.
- **Accessibility**: not yet audited — flagged here as a genuine gap, not previously called out. Should be checked (TalkBack, dynamic font scaling, contrast) once Phase 010's components have more real usage; worth a pass before Stage 1 closes.

## Open Items Carried Forward

- App branding (`Voice` → `Nova`) not yet done — Known Issue #1, unaffected by this phase.
- Accessibility has not been explicitly audited (see above) — new item, not previously tracked; added to SESSION.md.
- Settings persistence remains deferred to Phase 023/024 (ADR-024) — on schedule, not blocking anything yet.
