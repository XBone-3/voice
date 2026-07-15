# START_HERE.md

This is the bootstrap file. Read this file and DOCS_MANIFEST.json at the start of every session — nothing else is mandatory reading until the hash check below tells you otherwise.

---

## The protocol

Project documents fall into two categories:

- **Static** — PROJECT_MANIFEST.md, VISION.md, CLAUDE.md, PROJECT_CONTEXT.md, ENGINEERING_PRINCIPLES.md, NON_FUNCTIONAL_REQUIREMENTS.md. Vision, philosophy, and policy. Change rarely.
- **Dynamic** — SESSION.md, PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md. Current state. Change every phase by design. **Always read these four in full, every session** — this bootstrap file does not summarize them.

For each static document, DOCS_MANIFEST.json records a `git hash-object` hash from when it was last actually read and condensed below.

1. Run `git hash-object <file>` for each of the six static documents.
2. Compare to the hash in DOCS_MANIFEST.json.
3. **Hash matches** → trust the condensed summary below; do not re-read the file.
4. **Hash differs** → the file changed since it was last condensed. Read it in full, then update both its summary below and its hash in DOCS_MANIFEST.json before proceeding.

This exists because the six static documents together run well over 3,000 lines and essentially never change phase-to-phase — re-reading all of them every session was pure waste. See ARCHITECTURE_DECISIONS.md for the ADR recording this decision (added Phase 006).

If DOCS_MANIFEST.json itself is missing or unreadable, fall back to reading every document in full — do not guess.

---

## Condensed static document summaries

### PROJECT_MANIFEST.md

Nova = Android-only intelligence layer, not "another app." Motto: "Less Interface. More Intelligence." Android only, ARM64 primary, no iOS/cross-platform. Stack: React Native + TypeScript + Zustand + React Query + Reanimated + Gesture Handler (UI only) / Kotlin + Jetpack + Coroutines + Flow + Foreground Services + NotificationListenerService + AccessibilityService + WorkManager + MediaSession + AudioManager (everything else) / TurboModules + NativeModules + EventEmitters (thin bridge). AI decision hierarchy: Android APIs → Rule Engine → Context Engine → On-device AI → Clarification — never remote AI, never require internet for core features. Engineering priority order: Privacy > Reliability > Performance > Simplicity > Maintainability > Extensibility > Scalability. Document conflict-resolution order: PROJECT_MANIFEST > CLAUDE > ARCHITECTURE_DECISIONS > ENGINEERING_PRINCIPLES > NON_FUNCTIONAL_REQUIREMENTS > PROJECT_CONTEXT > PROJECT_ROADMAP > SESSION. Small phases only, each must compile/be testable/leave the repo healthy; approval gate before generating code (unless the user explicitly says to proceed). Physical Android device via USB/ADB is the primary test target, emulator optional. A phase is done only when it compiles, builds, is device-tested, and SESSION.md/PROJECT_ROADMAP.md/ADRs are updated.

### VISION.md

"The phone should adapt to the user," not the other way around. Nova is quiet intelligence living inside the device, not an app competing for attention. Interaction priority: Voice > Context > Automation > Typing > Touch. Nova accomplishes goals, not just answers questions; understands context rather than waiting for commands; respects privacy over cloud intelligence; tries to be useful rather than sound intelligent. What Nova is: voice-first, Android-native, privacy-first, context-aware, offline-capable, predictable, fast, reliable, modular, helpful. What Nova is not: a chatbot, search engine, social platform, notification spammer, gimmick, cloud-dependent service, or replacement for human judgment. Intelligence is measured by how little effort the user expends, not how many questions get answered — infer before asking, ask only on genuine uncertainty. Speed: fast feels intelligent, slow feels broken; acknowledge the user immediately. Privacy is "a promise, not a feature" — nothing personal leaves the device without explicit consent. Offline by default: core functionality works in airplane mode wherever Android APIs permit. Memory helps, never surprises — the user can always view/edit/delete/disable it. Personality: professional, warm, concise, confident; never sarcastic, overly emotional, or verbose; honest over confident. Success looks like "I didn't have to unlock my phone / search / remember. I just asked" — not feature count or lines of code.

### CLAUDE.md

(This file is also auto-injected as system instructions every session — this summary exists so START_HERE.md is self-contained even outside that context.) Act as lead architect/senior engineer; build production software, never a demo; never skip architecture or create technical debt. Absolute rules: never recommend iOS or Flutter; never move Android functionality into React Native; RN owns presentation only, Kotlin owns everything Android; never use cloud AI (no OpenAI/Anthropic/Gemini/remote inference); internet is never required for core features. Architecture: SOLID, Clean Architecture, Repository Pattern, MVVM, composition over inheritance; no God classes, no duplicated logic. UI: Pixel/Nothing OS/Material 3 quality — minimal, fluid, generous spacing, purposeful animation. Navigation: one dedicated screen per module (Home, Assistant, Notifications, Automation, Memory, History, Plugins, Settings, Developer, Diagnostics), never a single giant screen. Folder structure calls for `src/{screens/*,components,navigation,hooks,services,stores,theme,assets}` and `android/native/{voice,notification,accessibility,bridge}` — **note:** this conflicts with CLAUDE.md's own separate "Kotlin Structure" section (`android/{voice,notification,automation,memory,bridge,services,receivers,permissions,repository,utils}`); unresolved, flagged for Phase 016 (see SESSION.md Known Issues). Development style: one phase at a time, explain-then-wait-for-approval-then-code-then-explain, unless the user explicitly says to proceed without waiting. Physical-device testing only, with ADB commands/permissions/verification steps/expected logs provided for every feature. Every phase updates documentation (README, Architecture, Roadmap, Known Issues). Assistant should challenge poor architecture and propose alternatives rather than blindly implementing debt-introducing requests.

### PROJECT_CONTEXT.md

Nova is always-awake, continuously listening, context-understanding — not a chatbot. It performs Android actions, speaks naturally, and automates Android, aiming to become the user's primary interface with the device. Interaction priority: Voice > Context > Automation > Typing > Touch (typing is a fallback only). Core philosophy: "Less Interface. More Intelligence." — reduce cognitive load, less app-navigating, more natural talking. Assistant responsibilities: understand intent, execute Android actions, read/summarize notifications, reply to messages, control the device, remember context, automate tasks, learn routines. Future goals: wake word, local STT, local TTS, local LLM, plugin ecosystem, launcher replacement, full Android Intelligence Platform.

### ENGINEERING_PRINCIPLES.md

Priority order: Privacy > Reliability > Speed > Simplicity > Maintainability > Scalability > Extensibility. Android First: prefer platform APIs (SDK, Jetpack, Foreground Services, NotificationListenerService, AccessibilityService, WorkManager, Coroutines, Flow, MediaSession, AudioManager) over third-party SDKs — every dependency needs explicit justification ("can Android/Kotlin/Jetpack already do this? Can we build it ourselves?"). Voice First / Context First / AI Last (Native Android Action → Rule Engine → Local Intelligence → Clarification) / Offline First / Privacy First (never upload personal data without explicit consent, prefer on-device processing). Speed targets: wake word <150ms, command classification <100ms, simple action <300ms, UI 60fps, cold start <2s, warm start <500ms — perf regressions block new feature work. Battery: avoid polling/busy loops/frequent wake locks, prefer broadcasts/callbacks/listeners/WorkManager. Native before RN: RN owns UI/nav/animation/theme only; Kotlin owns everything else; the bridge stays thin. Modularity: Voice/Wake Word/Command/Automation/Notification/Accessibility/Memory/Plugin/Context/Analytics Engines, each independently replaceable, depending on interfaces not implementations. Clean code: one thing per function/class, readable over clever, six-months-later readability bar. Error handling: never silently fail; log + recover + inform + continue where possible; crash only when unavoidable. Logging: log state transitions/errors/permission changes, never log passwords/messages/notifications/contacts/PII/voice recordings. Testing priority: Real device > ADB > Instrumentation > Unit tests > Emulator. Future AI must be on-device, replaceable, offline-capable — the app must still function if every AI model is removed.

### NON_FUNCTIONAL_REQUIREMENTS.md

Min SDK Android 10 (API 29), recommended Android 14+, ARM64 primary, physical device is the real target (not emulator). Perf targets: wake word <150ms (max 250ms), command classification <100ms (max 200ms), simple action <300ms / complex <1s / AI-assisted <3s (acknowledge immediately if >1s), UI 60fps, cold start <2s, warm start <500ms. Memory: background service <100MB (max 150MB), foreground UI <250MB; no leaks, no retained Context. Battery: idle <2%/hour; avoid busy loops/polling; prefer broadcast receivers/callbacks/flows/WorkManager. Storage: DataStore for config, Room for structured data, encrypted storage for sensitive info, DB growth target <500MB. Network: core features must work offline; online features must detect-offline/fail-gracefully/recover-automatically. Privacy: default-private, nothing personal auto-uploaded, consent required before any personal-info transmission. Security: Android Keystore where applicable, encrypt sensitive local data, validate all Intent inputs, minimum permissions, never request permissions before needed. Reliability: 99.9% crash-free session target, automatic background-service and voice-session recovery, graceful degradation on permission denial. Accessibility and localization are release requirements (TalkBack, dynamic font scaling, no hardcoded user-facing strings). A phase's acceptance criteria: compiles, tests pass, device-verified, performance targets met, no architectural regression, docs updated.

---

## Then continue with the normal procedure

After the above, proceed per PROJECT_MANIFEST.md's "Claude Code Startup Procedure": read all four dynamic documents in full, identify the last completed phase (SESSION.md) and the next phase (PROJECT_ROADMAP.md), and plan before writing any code.
