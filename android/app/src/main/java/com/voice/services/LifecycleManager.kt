package com.voice.services

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.ProcessLifecycleOwner

/**
 * Plain Android process-lifecycle logic (ADR-028's services/ package,
 * ADR-033) — wraps ProcessLifecycleOwner (androidx.lifecycle, already a
 * transitive dependency of this project) so any future native engine can
 * query or observe app foreground/background state directly, not just
 * through the bridge. No React Native dependency here, per ADR-008/028's
 * split between real Android logic and the thin bridge surface.
 */
object LifecycleManager {
    /**
     * Reads the real, current lifecycle state on demand — not a manually
     * tracked variable — so there's no race between app startup and the
     * first observer callback.
     */
    fun isInForeground(): Boolean =
        ProcessLifecycleOwner.get().lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)

    private var started = false

    /**
     * Registers [onForegroundChanged] to receive future foreground/background
     * transitions. Idempotent — safe to call more than once; only the first
     * registration takes effect (this project has exactly one bridge-module
     * consumer today).
     */
    @Synchronized
    fun start(onForegroundChanged: (Boolean) -> Unit) {
        if (started) return
        started = true
        // Lifecycle.addObserver() requires the main thread; NativeModule
        // initialize() is not guaranteed to run on it.
        Handler(Looper.getMainLooper()).post {
            ProcessLifecycleOwner.get().lifecycle.addObserver(
                object : DefaultLifecycleObserver {
                    override fun onStart(owner: LifecycleOwner) = onForegroundChanged(true)

                    override fun onStop(owner: LifecycleOwner) = onForegroundChanged(false)
                },
            )
        }
    }
}
