# NON_FUNCTIONAL_REQUIREMENTS.md

# Non-Functional Requirements (NFR)

## Purpose

This document defines the measurable engineering standards that every subsystem of the Android Intelligence Assistant must satisfy.

Functional features describe **what** the assistant does.

Non-functional requirements describe **how well** it must do it.

A phase is **not complete** unless it satisfies both its functional goals and the relevant non-functional requirements.

---

# Vision

The assistant should feel like part of Android itself.

It should be:

- Instant
- Reliable
- Invisible
- Predictable
- Battery efficient
- Privacy preserving
- Offline capable

The user should never think about performance.

The assistant should simply work.

---

# Platform Requirements

Target Platform

Android only

Minimum SDK

Android 10 (API 29)

Recommended

Android 14+

Target SDK

Latest stable Android SDK

Supported CPU

ARM64

Support x86 only when required for development.

Do not optimize primarily for emulators.

Physical Android devices are the primary target.

---

# Performance Requirements

## Wake Word

Target

< 150 ms detection latency

Maximum acceptable

250 ms

---

## Speech Recognition

Speech processing should begin immediately after wake-word detection.

Target

Recognition begins within 100 ms.

---

## Command Classification

Simple deterministic commands

Target

< 100 ms

Maximum

200 ms

Examples

Open Camera

Call Mom

Turn on Bluetooth

Increase Volume

---

## Action Execution

Simple Android actions

Target

< 300 ms

Complex actions

< 1 second

AI-assisted reasoning

< 3 seconds

Whenever execution exceeds 1 second, acknowledge the user immediately before continuing.

---

## UI Performance

Target Frame Rate

60 FPS

Preferred

120 FPS where supported

Animation budget

16 ms per frame

Avoid jank.

Avoid unnecessary recompositions.

Avoid blocking the UI thread.

---

## Startup

Cold Start

Target

< 2 seconds

Warm Start

< 500 ms

Resume

Instant whenever possible.

---

# Memory Requirements

Background Service

Target

< 100 MB RAM

Maximum

150 MB

Foreground UI

Target

< 250 MB

Avoid unnecessary allocations.

Avoid retaining Context.

Destroy listeners immediately when no longer required.

Avoid memory leaks.

---

# Battery Requirements

The assistant should always be available.

Battery usage must remain minimal.

Idle battery consumption

Target

< 2% per hour

Avoid

Busy loops

Continuous polling

Frequent wake locks

Repeated database scans

Prefer

Broadcast Receivers

Callbacks

Flows

Observers

WorkManager

Foreground services should only perform essential work.

---

# Storage Requirements

Configuration

DataStore

Structured data

Room

Large binary data

Internal Storage

Sensitive information

Encrypted Storage

Target database growth

< 500 MB

Conversation history should be configurable.

Support automatic cleanup.

---

# Network Requirements

Core assistant functionality must work without internet.

Internet should only enhance optional capabilities.

Core systems must not fail because the network is unavailable.

Every online feature must:

Detect offline state.

Fail gracefully.

Explain limitations.

Recover automatically.

---

# Privacy Requirements

Default Mode

Private

Voice recordings

Never uploaded automatically.

Contacts

Never uploaded.

Messages

Never uploaded.

Notifications

Never uploaded.

Calendar

Never uploaded.

Photos

Never uploaded.

Location

Never uploaded.

User consent is required before transmitting any personal information.

---

# Security Requirements

Use Android Keystore whenever applicable.

Encrypt sensitive local data.

Validate all Intent inputs.

Do not expose unnecessary exported components.

Avoid reflection unless absolutely necessary.

Request only the minimum permissions required.

Never request permissions before they are needed.

---

# Reliability Requirements

Target crash-free sessions

99.9%

Background service restart

Automatic

Voice session recovery

Automatic

Permission denial

Graceful degradation

Unexpected exceptions

Recover whenever possible.

Never terminate the assistant unless recovery is impossible.

---

# Availability

The assistant should remain operational while:

Screen is off

Phone is locked

Another application is active

Music is playing

Notifications arrive

Calls occur

Graceful degradation is acceptable where Android restrictions apply.

---

# Offline Capability

The following features must work offline whenever Android APIs permit:

Voice interaction

Command execution

Notifications

Phone calls

SMS

Contacts

Calendar

Reminders

Automation

History

Memory

Media control

Device settings

Offline support is considered a primary requirement.

---

# Logging Requirements

Every subsystem should log:

Initialization

Shutdown

Errors

Warnings

Performance metrics

Permission changes

State transitions

Never log:

Passwords

Messages

Notification contents

Contacts

Voice recordings

Personal information

Sensitive logs should be disabled in release builds.

---

# Observability

Every major subsystem should expose metrics for:

Initialization time

Average execution time

Maximum execution time

Memory usage

Failure count

Recovery count

Battery impact estimate

Metrics should be lightweight.

Never significantly impact performance.

---

# Code Quality

Every Pull Request should satisfy:

Build succeeds

No compiler warnings

No dead code

No duplicated logic

No unused resources

No unnecessary dependencies

Documentation updated

Session updated

Roadmap updated

---

# Testing Requirements

Every completed phase must include:

Build instructions

Installation instructions

Physical device testing

ADB commands

Logcat filters

Expected behaviour

Known limitations

Failure scenarios

Recovery procedure

---

# Physical Device

Testing is performed on:

Real Android phone

Connected over USB

USB debugging enabled

ADB available

The emulator is optional.

Physical device validation is mandatory.

---

# ADB Requirements

Whenever a subsystem is added, provide:

Relevant adb commands

Permission verification

Logcat filters

Service verification

Broadcast verification

Expected logs

Example

adb logcat | grep VoiceEngine

adb shell dumpsys activity services

adb shell dumpsys notification

---

# Scalability

Every subsystem should be independently replaceable.

Subsystems communicate through interfaces.

Avoid direct implementation dependencies.

Avoid global mutable state.

Support future plugin loading.

Support future local AI models.

Support future launcher integration.

---

# Dependency Management

Before introducing a dependency, answer:

Can Android already do this?

Can Kotlin already do this?

Can Jetpack already do this?

Can we build this ourselves reasonably?

If the answer is yes,

Do not add another dependency.

Every dependency must include documented justification.

---

# Accessibility

Support:

TalkBack

Dynamic font scaling

High contrast

Screen readers

Keyboard navigation where applicable

Accessibility is a release requirement.

---

# Localization

Architecture must support future localization.

Hardcoded user-facing strings are prohibited.

Date, time, and number formatting should respect the device locale.

---

# Maintainability

Code should be understandable six months later.

Every complex subsystem requires:

Architecture documentation

Sequence diagrams (when appropriate)

Public interfaces

Usage examples

Known limitations

Future extension notes

---

# Future AI Requirements

Future local AI engines must:

Be optional

Be replaceable

Support offline execution

Fail gracefully

Never block deterministic commands

Never become mandatory for core assistant functionality

The assistant should continue operating if all AI models are removed.

---

# Acceptance Criteria

A phase is complete only if:

✓ Code compiles

✓ Tests pass

✓ Physical device verified

✓ Performance targets met

✓ No architectural regression

✓ Documentation updated

✓ SESSION.md updated

✓ ROADMAP updated

✓ Engineering Principles satisfied

✓ Non-functional requirements satisfied

Only then may the next phase begin.