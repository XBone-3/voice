You are continuing development of an existing long-term software project.

This project is expected to last for many months.

Treat this repository as the single source of truth.

DO NOT assume anything before reading the project documentation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — LOAD PROJECT CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read the following files IN THIS ORDER.

1. PROJECT_MANIFEST.md
2. VISION.md
3. CLAUDE.md
4. PROJECT_CONTEXT.md
5. ENGINEERING_PRINCIPLES.md
6. NON_FUNCTIONAL_REQUIREMENTS.md
7. ARCHITECTURE_DECISIONS.md
8. PROJECT_ROADMAP.md
9. SESSION.md along with PROJECT_STATE.json

Do not skip any file.

Do not start coding yet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — UNDERSTAND THE PROJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After reading every document, summarize:

• Project vision

• Current architecture

• Development philosophy

• Engineering principles

• Current progress

• Last completed phase

• Current repository state

• Next planned phase

If any documents conflict,

identify the conflict instead of making assumptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — VERIFY CURRENT STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before generating code verify:

✓ Current project builds successfully

✓ Existing architecture is respected

✓ No unfinished previous phase exists

✓ SESSION.md is consistent

✓ PROJECT_ROADMAP.md matches SESSION.md

If inconsistencies exist,

report them first.

Do not continue until resolved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — PLAN THE NEXT PHASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Determine the next phase from PROJECT_ROADMAP.md.

Explain:

Goal

Why this phase exists

Architecture impact

Files created

Files modified

Dependencies required

Permissions required

Android APIs used

Native modules required

React Native changes

Potential risks

Testing strategy

Physical device verification

ADB commands

Expected logs

Known limitations

Future extensibility

Estimate implementation complexity.

If the phase is too large,

split it into multiple smaller phases.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5 — WAIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STOP.

Wait for my approval.

Do not generate code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER APPROVAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generate ONLY the code required for the approved phase.

Do not modify unrelated files.

Do not redesign previous phases unless absolutely required.

Explain every important architectural decision.

Prefer readability over cleverness.

Avoid unnecessary abstractions.

Avoid technical debt.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER CODE GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide:

Project tree

Files added

Files modified

Dependencies installed

Commands to execute

Build commands

Run commands

ADB commands

Permissions required

How to install

How to test

Expected behaviour

Expected logs

Common failures

Debugging checklist

Recovery procedure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UPDATE DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Update the following if necessary.

SESSION.md

PROJECT_ROADMAP.md

README.md

ARCHITECTURE_DECISIONS.md

Relevant documentation

If a significant architectural decision was made,

create a new ADR.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before marking the phase complete verify:

✓ Compiles

✓ No warnings

✓ No duplicate logic

✓ No dead code

✓ Engineering principles satisfied

✓ Non-functional requirements satisfied

✓ Physical device testing documented

✓ Documentation updated

If any requirement fails,

fix it before considering the phase complete.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This project follows these non-negotiable rules.

Android only.

Never support iOS.

React Native owns only UI.

Kotlin owns Android functionality.

Voice first.

Context first.

Offline first.

Privacy first.

AI last.

No cloud AI dependencies.

No external assistant frameworks.

Always prefer Android SDK.

Always prefer Jetpack.

Always prefer Kotlin.

Every subsystem must be modular.

Every phase must compile.

Every phase must be independently testable.

Never skip phases.

Never continue automatically.

Always stop after one completed phase.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEVELOPMENT TARGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The application should eventually become an Android-native intelligence layer that feels like part of Android itself.

The user should never think:

"I need to open the assistant."

Instead they should naturally speak.

The assistant should already be there.

Listening.

Understanding.

Helping.

Without becoming intrusive.

Build toward this vision one phase at a time.