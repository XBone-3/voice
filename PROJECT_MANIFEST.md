# PROJECT_MANIFEST.md

# Nova - Android Intelligence Layer

Version: 1.0.0

Status: Active Development

Primary Platform: Android

Project Type: Native Android Intelligence Layer

---

# Mission

Build the most intelligent Android-native assistant possible.

Nova is not another application.

Nova is an operating-system companion that integrates deeply with Android and enables natural, voice-first interaction with the device.

The assistant should become the user's primary interface for interacting with Android.

---

# Vision

Nova should feel like part of Android itself.

It should be:

- Invisible
- Intelligent
- Fast
- Reliable
- Offline-first
- Privacy-first
- Context-aware
- Modular
- Extensible

Users should interact with their phone through conversation rather than navigation.

The assistant should reduce friction—not introduce it.

---

# Core Philosophy

Less Interface.

More Intelligence.

Voice is the primary interface.

Touch exists only when necessary.

The assistant should anticipate needs through context while always respecting user privacy and control.

---

# Interaction Hierarchy

Priority:

Voice

↓

Context

↓

Automation

↓

Typing

↓

Touch

Typing is a fallback.

Touch is the last resort.

Every feature should eventually become voice accessible.

---

# Engineering Priorities

Priority Order

1. Privacy
2. Reliability
3. Performance
4. Simplicity
5. Maintainability
6. Extensibility
7. Scalability

If priorities conflict, the higher priority wins unless explicitly approved otherwise.

---

# Platform Policy

Supported Platforms

✅ Android

Unsupported Platforms

❌ iOS

❌ iPadOS

❌ watchOS

❌ macOS

❌ Windows

Do not generate cross-platform abstractions.

Optimize exclusively for Android.

---

# Technology Stack

Frontend

- React Native
- TypeScript
- React Navigation
- Zustand
- React Query
- React Native Reanimated
- React Native Gesture Handler

Native Layer

- Kotlin
- Android SDK
- Jetpack Libraries
- Coroutines
- Flow
- Foreground Services
- NotificationListenerService
- AccessibilityService
- WorkManager
- MediaSession
- AudioManager

Bridge

- Turbo Modules
- Native Modules
- Event Emitters

---

# Architecture

React Native is responsible only for:

- User Interface
- Navigation
- Theme
- Animation
- Presentation
- Settings UI

Kotlin is responsible for:

- Voice Engine
- Wake Word Engine
- Audio Pipeline
- Command Engine
- Context Engine
- Notification Engine
- Accessibility Engine
- Automation Engine
- Memory Engine
- Android APIs
- Background Services
- Device Integration

The bridge should remain thin.

No business logic belongs in React Native.

---

# AI Policy

AI is optional.

Android APIs always take priority.

Decision hierarchy

Android APIs

↓

Rule Engine

↓

Context Engine

↓

On-device AI

↓

Clarification

Never use remote AI services for core functionality.

Never require internet connectivity for core assistant features.

Internet should enhance—not enable—the assistant.

---

# Offline Policy

Core assistant capabilities must function without internet.

Examples include:

- Voice interaction
- Calls
- Contacts
- Notifications
- SMS
- Device control
- Automation
- Calendar
- Reminders
- Media
- Local memory

---

# User Experience Principles

The assistant should never feel slow.

Immediately acknowledge user requests.

Prefer deterministic responses.

Avoid loading indicators whenever possible.

Animations should communicate state—not decorate the interface.

Every screen should have a single responsibility.

Avoid clutter.

---

# Development Workflow

Development proceeds in small phases.

Every phase must:

- Compile successfully
- Be independently testable
- Leave the project in a working state
- Include documentation updates
- Be approved before moving to the next phase

Claude must never skip phases.

Claude must never continue automatically.

---

# Testing Environment

Primary Testing

Physical Android device connected via USB.

ADB available.

USB debugging enabled.

Emulator testing is optional.

Every phase must include:

- Build instructions
- Installation steps
- ADB commands
- Logcat filters
- Expected behaviour
- Recovery procedure

---

# Required Project Documents

Claude must read these files before making architectural or implementation decisions:

1. PROJECT_MANIFEST.md — static
2. CLAUDE.md — static
3. PROJECT_CONTEXT.md — static
4. ENGINEERING_PRINCIPLES.md — static
5. NON_FUNCTIONAL_REQUIREMENTS.md — static
6. ARCHITECTURE_DECISIONS.md — dynamic
7. PROJECT_ROADMAP.md — dynamic
8. SESSION.md — dynamic
9. PROJECT_STATE.json — dynamic

**Static** documents (vision, philosophy, policy, engineering standards) change rarely. **Dynamic** documents (SESSION.md, PROJECT_STATE.json, PROJECT_ROADMAP.md, ARCHITECTURE_DECISIONS.md) change every phase by design and must always be read in full.

Since Phase 006, a new session does not need to re-read every static document in full every time. Start from START_HERE.md instead: it holds condensed summaries of all six static documents plus a hash-based staleness check against DOCS_MANIFEST.json. If a static document's recorded hash still matches `git hash-object <file>`, trust START_HERE.md's summary of it. If the hash differs, that document changed since it was last condensed — read it in full, update the understanding, and refresh DOCS_MANIFEST.json. Dynamic documents are exempt from this shortcut and are always read in full, every session.

If any document conflicts with another, resolve conflicts in this order:

PROJECT_MANIFEST.md

↓

CLAUDE.md

↓

ARCHITECTURE_DECISIONS.md

↓

ENGINEERING_PRINCIPLES.md

↓

NON_FUNCTIONAL_REQUIREMENTS.md

↓

PROJECT_CONTEXT.md

↓

PROJECT_ROADMAP.md

↓

SESSION.md

---

# Claude Code Startup Procedure

Every new session begins with the following steps:

1. Read START_HERE.md and DOCS_MANIFEST.json. For each static document, compare its recorded hash to `git hash-object <file>` — read the full document only if the hash no longer matches. Read all four dynamic documents in full, always (ARCHITECTURE_DECISIONS.md, PROJECT_ROADMAP.md, SESSION.md, PROJECT_STATE.json).
2. Summarize the current project state.
3. Identify the last completed phase from SESSION.md.
4. Identify the next phase from PROJECT_ROADMAP.md.
5. Explain the goal, architecture, files affected, dependencies, risks, and testing plan.
6. Wait for user approval.
7. Generate only the code for the approved phase.
8. Update SESSION.md after successful completion. If any static document changed, update its summary in START_HERE.md and its hash in DOCS_MANIFEST.json.
9. Stop and wait for further instructions.

Claude must never proceed automatically to another phase.

---

# Definition of Done

A phase is complete only when:

- Code compiles successfully
- Build passes
- Physical device testing succeeds
- Documentation is updated
- SESSION.md is updated
- PROJECT_ROADMAP.md is updated
- Relevant ADRs are created or amended
- Engineering Principles are satisfied
- Non-Functional Requirements are satisfied

Only then may the next phase begin.

---

# Long-Term Goal

Nova should evolve from a voice assistant into a complete Android Intelligence Layer capable of:

- Understanding natural language
- Executing Android actions
- Remembering context
- Automating workflows
- Providing proactive assistance
- Operating primarily offline
- Remaining modular and extensible
- Feeling like a native part of Android

Every architectural decision should move the project toward this vision.

---

# Project Motto

**Less Interface. More Intelligence.**