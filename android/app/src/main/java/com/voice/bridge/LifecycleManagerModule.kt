package com.voice.bridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.voice.services.LifecycleManager

/**
 * Thin TurboModule wrapper (ADR-008) over services/LifecycleManager's
 * real Android logic — this class only translates JS calls/events, no
 * lifecycle logic of its own. Registers the real observer once, in
 * initialize(), following the exact pattern Phase 017's
 * NativeBridgeInfoModule established for ComponentCallbacks2.
 */
@ReactModule(name = LifecycleManagerModule.NAME)
class LifecycleManagerModule(
    reactContext: ReactApplicationContext,
) : NativeLifecycleManagerSpec(reactContext) {
    override fun getName(): String = NAME

    override fun isInForeground(promise: Promise) {
        promise.resolve(LifecycleManager.isInForeground())
    }

    // NativeEventEmitter's JS-side subscription bookkeeping calls these;
    // no-ops on Android, per the same pattern as NativeBridgeInfoModule.
    override fun addListener(eventName: String) {}

    override fun removeListeners(count: Double) {}

    override fun initialize() {
        super.initialize()
        LifecycleManager.start { foreground ->
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(EVENT_LIFECYCLE_CHANGED, foreground)
        }
    }

    companion object {
        const val NAME = "LifecycleManager"
        const val EVENT_LIFECYCLE_CHANGED = "onLifecycleChanged"
    }
}
