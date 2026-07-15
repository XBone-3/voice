package com.voice.bridge

import android.content.ComponentCallbacks2
import android.content.res.Configuration
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * First native module (Phase 016, ADR-028). Extends the codegen-generated
 * NativeBridgeInfoSpec abstract class (built from
 * src/nativeSpecs/NativeBridgeInfo.ts at build time).
 *
 * getAndroidVersion() is Promise-based rather than synchronous — kept
 * from this phase's on-device debugging (see ADR-029) as a safer default
 * for any future method that isn't guaranteed sub-millisecond, not
 * because synchronous methods were the actual cause of that phase's bug.
 *
 * Phase 017 (ADR-030) adds the event-emission half of the bridge:
 * ComponentCallbacks2.onTrimMemory() is a real Android system signal
 * (fired when the OS reports memory pressure) with no RN-core equivalent
 * (AppState only covers foreground/background), so it doubles as an
 * honest, non-simulated proof of native-to-JS events while giving
 * NON_FUNCTIONAL_REQUIREMENTS.md's Memory section a real signal to react
 * to later.
 */
@ReactModule(name = NativeBridgeInfoModule.NAME)
class NativeBridgeInfoModule(
    reactContext: ReactApplicationContext,
) : NativeBridgeInfoSpec(reactContext),
    ComponentCallbacks2 {
    override fun getName(): String = NAME

    override fun getAndroidVersion(promise: Promise) {
        promise.resolve(Build.VERSION.RELEASE)
    }

    // NativeEventEmitter's JS-side subscription bookkeeping calls these;
    // Android needs no explicit listener registration (unlike iOS), so
    // both are no-ops — the standard pattern for Android TurboModules
    // that emit events.
    override fun addListener(eventName: String) {}

    override fun removeListeners(count: Double) {}

    override fun initialize() {
        super.initialize()
        reactApplicationContext.registerComponentCallbacks(this)
    }

    override fun invalidate() {
        reactApplicationContext.unregisterComponentCallbacks(this)
        super.invalidate()
    }

    override fun onTrimMemory(level: Int) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_MEMORY_PRESSURE, level.toDouble())
    }

    override fun onConfigurationChanged(newConfig: Configuration) {}

    override fun onLowMemory() {}

    companion object {
        const val NAME = "NativeBridgeInfo"
        const val EVENT_MEMORY_PRESSURE = "onMemoryPressure"
    }
}
