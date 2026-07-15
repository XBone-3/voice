package com.voice.bridge

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

/**
 * First native module (Phase 016, ADR-028). Extends the codegen-generated
 * NativeBridgeInfoSpec abstract class (built from
 * src/nativeSpecs/NativeBridgeInfo.ts at build time).
 *
 * getAndroidVersion() is Promise-based rather than synchronous — kept
 * from this phase's on-device debugging (see ADR-029) as a safer default
 * for any future method that isn't guaranteed sub-millisecond, not
 * because synchronous methods were the actual cause of that phase's bug.
 */
@ReactModule(name = NativeBridgeInfoModule.NAME)
class NativeBridgeInfoModule(
    reactContext: ReactApplicationContext,
) : NativeBridgeInfoSpec(reactContext) {
    override fun getName(): String = NAME

    override fun getAndroidVersion(promise: Promise) {
        promise.resolve(Build.VERSION.RELEASE)
    }

    companion object {
        const val NAME = "NativeBridgeInfo"
    }
}
